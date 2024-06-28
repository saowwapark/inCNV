import fs from 'fs-extra';
import * as path from 'path';
import unzipper from 'unzipper';
import {
  DATASOURCES_TMP_DIR_PATH,
  REF_GENOME_GRCH37_FASTA_PATH,
  REF_GENOME_GRCH37_FAI_PATH,
} from '../../config/path.config';
import { utilityDatasource } from './utility-datasource';

export class UpdateReferenceGenomeGrch37 {
  private readonly url =
    'https://api.github.com/repos/saowwapark/inCNV-datasource/releases/latest';
  private readonly expectedZipFileName = 'reference_genome_grch37.zip';
  private readonly expectedZipFilePath = path.join(
    DATASOURCES_TMP_DIR_PATH,
    this.expectedZipFileName
  );
  private readonly tmpExtractedDirPath = path.join(
    DATASOURCES_TMP_DIR_PATH,
    'reference_genome_grch37'
  );

  checkShouldUpdateVersion = () => {
    const datasourceVersion = utilityDatasource.getDatasourceVersion();
    const referenceGenomeGrch37Versions =
      datasourceVersion.referenceGenomeGrch37Versions;

    let isShouldUpdate: boolean = true;
    for (const referenceGenomeGrch37Version of referenceGenomeGrch37Versions) {
      const releasedVersion = referenceGenomeGrch37Version.releasedVersion;
      if (releasedVersion && releasedVersion.length > 0) {
        isShouldUpdate = false;
        return isShouldUpdate;
      }
    }
    return isShouldUpdate;
  };

  main = async (): Promise<string> => {
    let shouldUpdate: boolean = this.checkShouldUpdateVersion();
    if (!shouldUpdate)
      return Promise.resolve(
        '==> Reference genome GRCh37 should not be updated'
      );

    const data = await utilityDatasource.getDatasource(
      this.url,
      this.expectedZipFileName
    );

    utilityDatasource.saveRetrievedFile(this.expectedZipFilePath, data);

    // extract zip file
    const readStream = fs.createReadStream(this.expectedZipFilePath);

    return new Promise((resolve, reject) => {
      readStream
        .pipe(unzipper.Extract({ path: DATASOURCES_TMP_DIR_PATH }))
        .on('error', function (err) {
          reject(
            new Error('Error!! unzip Reference genome GRCh37\n' + err.stack)
          );
        })
        .on('close', async () => {
          this.modifyFile();

          // remove zip file
          fs.removeSync(this.expectedZipFilePath);
          // remove extracted directory
          fs.removeSync(this.tmpExtractedDirPath);

          // update db version
          const updatedDatasourceVersion = this.createDatasourceVersion();
          utilityDatasource.writeDatasourceVersion(updatedDatasourceVersion);
          resolve(
            '=> Updating Reference Genome GRCh37 SUCCESS!!'
          );
        });
    });
  };

  private modifyFile() {
    const fileNames = fs.readdirSync(this.tmpExtractedDirPath);
    console.log('tmpExtractedDir: ' + this.tmpExtractedDirPath);
    console.log('fileNames: ' + fileNames);
    for (const fileName of fileNames) {
      const extractedFilePath = path.join(this.tmpExtractedDirPath, fileName);
      if (fileName.charAt(0) !== '.' && fileName.endsWith('.fa.fai')) {
        this.moveFile(extractedFilePath, REF_GENOME_GRCH37_FAI_PATH);
      } else if (fileName.charAt(0) !== '.' && fileName.endsWith('.fa')) {
        this.moveFile(extractedFilePath, REF_GENOME_GRCH37_FASTA_PATH);
      }
    }
  }
  private moveFile(oldPath: string, newPath: string) {
    console.log('oldPath: ' + oldPath);
    console.log('newPath: ' + newPath);

    fs.removeSync(newPath);
    fs.moveSync(oldPath, newPath);
    console.log('moveFileSuccess!!');
  }

  private createDatasourceVersion = () => {
    const datasourceVersion = utilityDatasource.getDatasourceVersion();
    const referenceGenomeGrch37Versions =
      datasourceVersion.referenceGenomeGrch37Versions;
    // update db version
    referenceGenomeGrch37Versions[0].fileName = 'new fasta grch37';
    referenceGenomeGrch37Versions[0].releasedVersion = 'new released version';
    referenceGenomeGrch37Versions[0].srcReleasedDate = 'new released date';

    referenceGenomeGrch37Versions[1].fileName = 'new fasta index grch37';
    referenceGenomeGrch37Versions[1].releasedVersion = 'new released version';
    referenceGenomeGrch37Versions[1].srcReleasedDate = 'new released date';

    return datasourceVersion;
  };
}

export const updateReferenceGenomeGrch37 = new UpdateReferenceGenomeGrch37();
