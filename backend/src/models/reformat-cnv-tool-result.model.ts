import { HttpException } from './../exceptions/http.exception';
import es from 'event-stream';
import {
  TabFileMappingDto,
  HeaderColumnMapping,
  HeaderColumnIndex,
  DataFieldMapping,
} from '../databases/incnv/dto/tab-file-mapping.dto';
import { reformatCnvToolResultDao } from '../databases/incnv/dao/reformat-cnv-tool-result.dao';
import fs from 'fs';
import { ReformatCnvToolResultDto } from '../databases/incnv/dto/reformat-cnv-tool-result.dto';
import {
  bioGrch37Pool,
  bioGrch38Pool,
  inCnvPool,
  dbPool,
} from '../config/database.config';
import { server } from '../server';
const allChrNames = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  'x',
  'y',
];

class ReformatCnvToolResultModel {
  /**
   * Define Index for each column
   */
  private mapHeaderColumnIndexs = (
    headerLine: string,
    column: HeaderColumnMapping
  ): HeaderColumnIndex | null => {
    // check new line
    if (!headerLine || headerLine === '') {
      throw new HttpException(400, `First line must not be a new line.`);
    }
    const columnIndex: HeaderColumnIndex = {};

    const columnNames: string[] = headerLine.split('\t');

    columnNames.forEach((columnName, i) => {
      switch (columnName) {
        case column.sample:
          columnIndex.sampleIndex = i;
          break;
        case column.chromosome:
          columnIndex.chromosomeIndex = i;
          break;
        case column.startBp:
          columnIndex.startBpIndex = i;
          break;
        case column.endBp:
          columnIndex.endBpIndex = i;
          break;
        case column.cnvType:
          columnIndex.cnvTypeIndex = i;
          break;
        default:
          break;
      }
    });

    let errorMessage = '';
    let errorColumns: string[] = [];
    columnIndex.sampleIndex === undefined
      ? errorColumns.push('Sample Name')
      : null;

    columnIndex.chromosomeIndex === undefined
      ? errorColumns.push('Chromosome')
      : null;
    columnIndex.startBpIndex === undefined
      ? errorColumns.push('Start Basepair')
      : null;
    columnIndex.endBpIndex === undefined
      ? errorColumns.push('End Basepair')
      : null;
    columnIndex.cnvTypeIndex === undefined
      ? errorColumns.push('Cnv Type')
      : null;

    errorColumns.forEach((errorColumn, i) => {
      if (i === 0) {
        errorMessage = errorColumn;
      } else {
        errorMessage += `, ${errorColumn}`;
      }
    });
    if (errorColumns.length > 0) {
      throw new HttpException(
        400,
        `Cannot map header column named '${errorMessage}'.  Please check file headers whether matching with the configuration of tab file mapping.`
      );
    }
    return columnIndex;
  };

  private mapDatas = (
    lines: string[],
    columnIndex: HeaderColumnIndex,
    dataFieldMapping: DataFieldMapping,
    uploadCnvToolResultId: number
  ): ReformatCnvToolResultDto[] => {
    const mappedDatas: ReformatCnvToolResultDto[] = [];

    for (let index = 1; index < lines.length; index++) {
      const line = lines[index];

      // check new line
      if (!line || line === '') {
        continue;
      }

      const data = line.split('\t');

      const mappedData = new ReformatCnvToolResultDto();

      // Map UploadCnvToolResult Id
      mappedData.uploadCnvToolResultId = uploadCnvToolResultId;

      // Map Sample Name
      mappedData.sample = data[columnIndex.sampleIndex!];

      // Map Chromosome -- Chromosome22
      if (dataFieldMapping.chromosome22!.indexOf('22') !== -1) {
        const chrIndex = dataFieldMapping.chromosome22!.indexOf('22');
        const originalChromosome = data[columnIndex.chromosomeIndex!];
        if (originalChromosome === undefined) {
          throw new HttpException(
            400,
            `At line: ${index +
              2}.  Cannot map chromosome column. Please check file content whether matching with the configuration of tab file mapping.`
          );
        }
        const chrName = originalChromosome.substring(chrIndex).toLowerCase();

        if (allChrNames.includes(chrName)) {
          mappedData.chromosome = chrName;
        } else {
          throw new HttpException(
            400,
            `At line: ${index +
              2}.  Cannot map chromosome column. Please check file content whether matching with the configuration of tab file mapping.`
          );
        }
      } else {
        throw new HttpException(
          400,
          `At line: ${index +
            2}.  Please check file content whether matching with the configuration of tab file mapping.`
        );
      }

      // Map CNV Type
      const originalCnvType = data[columnIndex.cnvTypeIndex!];
      if (originalCnvType === dataFieldMapping.duplication) {
        mappedData.cnvType = 'duplication';
      } else if (originalCnvType === dataFieldMapping.deletion) {
        mappedData.cnvType = 'deletion';
      } else {
        throw new HttpException(
          400,
          `At line: ${index +
            2}. Cannot map data named '${originalCnvType}'.  Please check file content whether matching with the configuration of tab file mapping.`
        );
      }

      // Map Start Basepair
      // Confirm that this value is number
      // * use regex to remove comma from number
      // * use '+' to confirm this element is number
      const originalStartBp = data[columnIndex.startBpIndex!];
      mappedData.startBp = Number(originalStartBp.replace(/,/gu, ''));
      if (isNaN(mappedData.startBp)) {
        throw new HttpException(
          400,
          `At line: ${index +
            2}. 'start basepair': ${originalStartBp} is not a number`
        );
      }

      // Map End Basepair
      // Confirm that this value is number
      // * use regex to remove comma from number
      // * use '+' to confirm this element is number
      const originalEndBp = data[columnIndex.endBpIndex!];
      mappedData.endBp = Number(originalEndBp.replace(/,/gu, ''));
      if (isNaN(mappedData.endBp)) {
        throw new HttpException(
          400,
          `At line: ${index +
            2}. 'start basepair': ${originalEndBp} is not a number`
        );
      }

      if (mappedData.startBp > mappedData.endBp) {
        console.log(line);
        // continue;
        throw new HttpException(
          400,
          `At line: ${index +
            2}. 'start basepair': ${originalStartBp} is more than 'end basepair': ${originalEndBp}.`
        );
      }
      mappedDatas.push(mappedData);
    }

    return mappedDatas;
  };

  private mapData = (
    line: string,
    lineNumber: number,
    columnIndex: HeaderColumnIndex,
    dataFieldMapping: DataFieldMapping,
    uploadCnvToolResultId: number
  ): ReformatCnvToolResultDto | null => {
    // check new line
    if (!line || line === '') {
      return null;
    }

    const data = line.split('\t');

    const mappedData = new ReformatCnvToolResultDto();

    // Map UploadCnvToolResult Id
    mappedData.uploadCnvToolResultId = uploadCnvToolResultId;

    // Map Sample Name
    mappedData.sample = data[columnIndex.sampleIndex!];

    // Map Chromosome -- Chromosome22
    if (dataFieldMapping.chromosome22!.indexOf('22') !== -1) {
      const chrIndex = dataFieldMapping.chromosome22!.indexOf('22');
      const originalChromosome = data[columnIndex.chromosomeIndex!];
      if (originalChromosome === undefined) {
        throw new HttpException(
          400,
          `At line: ${lineNumber +
            2}.  Cannot map chromosome column. Please check file content whether matching with the configuration of tab file mapping.`
        );
      }
      const chrName = originalChromosome.substring(chrIndex).toLowerCase();

      if (allChrNames.includes(chrName)) {
        mappedData.chromosome = chrName;
      } else {
        throw new HttpException(
          400,
          `At line: ${lineNumber +
            2}.  Cannot map chromosome column. Please check file content whether matching with the configuration of tab file mapping.`
        );
      }
    } else {
      throw new HttpException(
        400,
        `At line: ${lineNumber +
          2}.  Please check file content whether matching with the configuration of tab file mapping.`
      );
    }

    // Map CNV Type
    const originalCnvType = data[columnIndex.cnvTypeIndex!];
    if (originalCnvType === dataFieldMapping.duplication) {
      mappedData.cnvType = 'duplication';
    } else if (originalCnvType === dataFieldMapping.deletion) {
      mappedData.cnvType = 'deletion';
    } else {
      throw new HttpException(
        400,
        `At line: ${lineNumber +
          2}. Cannot map data named '${originalCnvType}'.  Please check file content whether matching with the configuration of tab file mapping.`
      );
    }

    // Map Start Basepair
    // Confirm that this value is number
    // * use regex to remove comma from number
    // * use '+' to confirm this element is number
    const originalStartBp = data[columnIndex.startBpIndex!];
    mappedData.startBp = Number(originalStartBp.replace(/,/gu, ''));
    if (isNaN(mappedData.startBp)) {
      throw new HttpException(
        400,
        `At line: ${lineNumber +
          2}. 'start basepair': ${originalStartBp} is not a number`
      );
    }

    // Map End Basepair
    // Confirm that this value is number
    // * use regex to remove comma from number
    // * use '+' to confirm this element is number
    const originalEndBp = data[columnIndex.endBpIndex!];
    mappedData.endBp = Number(originalEndBp.replace(/,/gu, ''));
    if (isNaN(mappedData.endBp)) {
      throw new HttpException(
        400,
        `At line: ${lineNumber +
          2}. 'start basepair': ${originalEndBp} is not a number`
      );
    }

    if (mappedData.startBp > mappedData.endBp) {
      throw new HttpException(
        400,
        `At line: ${lineNumber +
          2}. 'start basepair': ${originalStartBp} is more than 'end basepair': ${originalEndBp}.`
      );
    }
    mappedData;

    return mappedData;
  };

  private reformatStream = (
    uploadCnvToolResultId: number,
    filePath: string,
    tabFileMapping: TabFileMappingDto
  ): Promise<string> => {
    let lineNumber = 0;
    let chunkSize = 3000;
    let countLine = 0;
    let reformatCnvToolResults: ReformatCnvToolResultDto[] = [];
    let columnIndex: HeaderColumnIndex | null;
    return new Promise((resolve, reject) => {
      const readStream = fs
        .createReadStream(filePath)
        .pipe(es.split())
        .pipe(
          es
            .mapSync(async (line: string) => {
              if (lineNumber === 0) {
                // map file header
                columnIndex = this.mapHeaderColumnIndexs(
                  line,
                  tabFileMapping.headerColumnMapping!
                );
                lineNumber++;
              } else {
                try {
                  const reformatCnvToolResult: ReformatCnvToolResultDto | null = this.mapData(
                    line,
                    lineNumber,
                    columnIndex!,
                    tabFileMapping.dataFieldMapping!,
                    uploadCnvToolResultId
                  );
                  if (reformatCnvToolResult !== null && countLine < chunkSize) {
                    reformatCnvToolResults.push(reformatCnvToolResult);
                    countLine++;
                  } else if (
                    reformatCnvToolResult !== null &&
                    countLine === chunkSize
                  ) {
                    console.log('Count lines === chunck size === ' + countLine);
                    readStream.pause();
                    await reformatCnvToolResultDao.addReformatCnvToolResults(
                      reformatCnvToolResults
                    );
                    readStream.resume();
                    // reset countLine
                    countLine = 0;
                    // reset reformatCnvToolResults
                    reformatCnvToolResults = [];
                  }
                  lineNumber++;
                } catch (err) {
                  reject(err);
                }
              }
            })
            .on('error', function(err) {
              console.log('Error while reading file.', err);
              reformatCnvToolResultDao.deleteReformatByUploadId(
                uploadCnvToolResultId
              );
              reject(err);
            })
            .on('end', async function() {
              console.log('Read entire file.');
              if (reformatCnvToolResults.length > 0) {
                await reformatCnvToolResultDao.addReformatCnvToolResults(
                  reformatCnvToolResults
                );
              }
              resolve('success');
            })
            .on('SIGINT', function() {
              console.log('SIGINT signal received.');
              console.log('Closing http server.');
              reformatCnvToolResultDao.deleteReformatByUploadId(
                uploadCnvToolResultId
              );
              server.close(() => {
                console.log('Http server closed.');
                try {
                  console.log('Ending Db connection.');

                  bioGrch37Pool.end();
                  bioGrch38Pool.end();
                  inCnvPool.end();
                  dbPool.end();
                  process.exit(0);
                } catch (err) {
                  console.error(err);
                  process.exit(1);
                }
              });
            })
        );
    });
  };

  public reformatFile = async (
    uploadCnvToolResultId: number,
    filePath: string,
    tabFileMapping: TabFileMappingDto
  ) => {
    try {
      // read file
      console.log('File path:' + filePath);
      if (fs.existsSync(filePath)) {
        //file exists
        console.log('File exists.');
      } else {
        console.error('Fail to upload file.');
        throw new HttpException(400, 'Fail to upload file.');
      }
      await this.reformatStream(
        uploadCnvToolResultId,
        filePath,
        tabFileMapping
      );
    } catch (err) {
      console.error(err);
      throw new HttpException(400, 'Fail to reformat file.');
    }
  };
  // // obj is tabFileMapping
  // public reformatFile = async (
  //   uploadCnvToolResultId: number,
  //   filePath: string,
  //   tabFileMapping: TabFileMappingDto
  // ) => {
  //   try {
  //     // read file
  //     console.log('File path:' + filePath);
  //     if (fs.existsSync(filePath)) {
  //       //file exists
  //       console.log('File exists.');
  //     } else {
  //       console.error('Fail to upload file.');
  //       throw new HttpException(400, 'Fail to upload file.');
  //     }

  //     const context = fs.readFileSync(filePath, 'utf8');
  //     const lines = context.split('\n');
  //     // map file header
  //     const columnIndex = this.mapHeaderColumnIndexs(
  //       lines[0],
  //       tabFileMapping.headerColumnMapping!
  //     );

  //     // map file data
  //     const reformatCnvToolResults: ReformatCnvToolResultDto[] = this.mapDatas(
  //       lines.slice(1),
  //       columnIndex!,
  //       tabFileMapping.dataFieldMapping!,
  //       uploadCnvToolResultId
  //     );
  //     await this.addReformatCnvToolResults(reformatCnvToolResults);
  //   } catch (err) {
  //     // Delete all records
  //     reformatCnvToolResultDao.deleteReformatByUploadId(uploadCnvToolResultId);
  //     throw err;
  //   }
  // };

  public addReformatCnvToolResults = async (
    reformatCnvToolResults: ReformatCnvToolResultDto[]
  ) => {
    await reformatCnvToolResultDao.addReformatCnvToolResults(
      reformatCnvToolResults
    );
  };
}

export const reformatCnvToolResultModel = new ReformatCnvToolResultModel();
