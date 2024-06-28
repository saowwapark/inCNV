import { TableVersion, DatasourceVersion } from './datasource-version.model';
import fs from 'fs-extra';
import * as path from 'path';
import { dbPool } from '../../config/database.config';
import { DATASOURCES_TMP_DIR_PATH, DATASOURCES_VERSION_PATH, DATASOURCES_ORIGINAL_VERSION_PATH, DATASOURCES_VOLUME_DIR_PATH } from '../../config/path.config';

import mysqlPromise from 'mysql2/promise';
import { databases, TableScript } from './database-const';
import { utilityDatasource } from './utility-datasource';
import AdmZip from 'adm-zip';

export class UpdateDatabase {
  private readonly url =
    'https://api.github.com/repos/saowwapark/inCNV-datasource/releases/latest';
  private readonly expectedZipFileName = 'db_datasource.zip';
  private readonly expectedZipFilePath = path.join(
    DATASOURCES_TMP_DIR_PATH,
    this.expectedZipFileName
  );
  private readonly tmpExtractedDirPath = path.join(
    DATASOURCES_TMP_DIR_PATH,
    'db_datasource'
  );

  checkShouldUpdateVersion = () => {
    const datasourceVersion = utilityDatasource.getDatasourceVersion();
    const dbVersions = datasourceVersion.dbVersions;
    let isShouldUpdate: boolean = true;
    for (const currentDbVersion of dbVersions) {
      const dbNameVersion = currentDbVersion.databaseName;
      const tableVersions: TableVersion[] = currentDbVersion.tables;
      for (const tableVersion of tableVersions) {
        const tableName = tableVersion.tableName;
        const releasedVersion = tableVersion.releasedVersion;
        if (releasedVersion && releasedVersion.length > 0) {
          isShouldUpdate = false;
          return isShouldUpdate;
        }
      }
    }
    return isShouldUpdate;
  };

  main = async (): Promise<string> => {
    let shouldUpdate: boolean = this.checkShouldUpdateVersion();
    console.log('Should update Bio DB: ' + shouldUpdate);
    if (!shouldUpdate) {
      return Promise.resolve('==> Bio DB should not be updated');
    }
    console.log('--------------------- Upadating Bio DB released version XXX ... ')
    const data = await utilityDatasource.getDatasource(
      this.url,
      this.expectedZipFileName
    );
    // /tmp/datasource/db__datasource.zip
    const zipFilePath = path.join(DATASOURCES_TMP_DIR_PATH, this.expectedZipFileName);
    utilityDatasource.saveRetrievedFile(zipFilePath, data);

    // extract zip file
    return new Promise((resolve, reject) => {
      try {
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(DATASOURCES_TMP_DIR_PATH)
        this.updateTable().then(() => {
          // remove zip file
          fs.removeSync(this.expectedZipFilePath);
          // remove extracted directory
          fs.removeSync(this.tmpExtractedDirPath);

          // update db version
          const updatedDatasourceVersion = this.createUpdatedDatasourceVersion();
          utilityDatasource.writeDatasourceVersion(updatedDatasourceVersion);
          resolve(
            '=> Updating Bio DB SUCCESS!!'
          );
        });
      } catch (err) {
        reject(new Error('Error!! to unzip Bio database\n' + err));
      }
    });
  };

  private createUpdatedDatasourceVersion = () => {
    const datasourceVersion = utilityDatasource.getDatasourceVersion();
    const dbVersions = datasourceVersion.dbVersions;
    // update db version
    for (const dbVersion of dbVersions) {
      const tableVersions: TableVersion[] = dbVersion.tables;
      for (const tableVersion of tableVersions) {
        tableVersion.releasedVersion = 'new released version';
        tableVersion.srcReleasedDate = 'new released date';
      }
    }
    return datasourceVersion;
  };

  private updateTable = async () => {
    let files: string[] = [];
    try {
      files = fs.readdirSync(this.tmpExtractedDirPath);
    } catch (err) {
      console.error('Could not list the directory.', err);
      process.exit(1);
    }
    const tableList = ['ensembl', 'dgv', 'clinvar'];
    let bioGrch37Tables: TableScript[] = [];
    let bioGrch38Tables: TableScript[] = [];

    for (const database of databases) {
      if (database.databaseName === 'bio_grch37') {
        bioGrch37Tables = database.tables;
      } else if (database.databaseName === 'bio_grch38') {
        bioGrch38Tables = database.tables;
      }
    }

    for (const fullFileName of files) {
      // example: ensembl__grch37__2017-03-20.txt
      const fileTypeIndex = fullFileName.indexOf('.txt');
      const fileName = fullFileName.substring(0, fileTypeIndex);
      const fileNameParts = fileName.split('__');
      const tableName: string = fileNameParts[0];
      const databaseName =
        fileNameParts[1] === 'grch37' ? 'bio_grch37' : 'bio_grch38';
      // const releasedDate: Date = new Date(fileNameParts[2]);

      console.log(`-> Updating table ${databaseName}.${tableName} ...`)
      if (tableList.indexOf(tableName) > -1) {
        const filePath = path.join(this.tmpExtractedDirPath, fullFileName);
        const dataList = this.getTableData(filePath);
        const insertSql = this.getInsertSql(
          databaseName,
          tableName,
          bioGrch37Tables,
          bioGrch38Tables
        );

        await this.loadDataIntoTable(
          databaseName,
          tableName,
          insertSql,
          dataList
        );
      }
    }
  };

  private getInsertSql = (
    databaseName: string,
    tableName: string,
    bioGrch37Tables: TableScript[],
    bioGrch38Tables: TableScript[]
  ) => {
    let insertSql = '';

    for (const bioGrch37Table of bioGrch37Tables) {
      if (
        tableName === bioGrch37Table.tableName &&
        databaseName === 'bio_grch37'
      ) {
        insertSql = bioGrch37Table.insertSql!;
        break;
      }
    }
    for (const bioGrch38Table of bioGrch38Tables) {
      if (
        tableName === bioGrch38Table.tableName &&
        databaseName === 'bio_grch38'
      ) {
        insertSql = bioGrch38Table.insertSql!;
        break;
      }
    }
    return insertSql;
  };

  private loadDataIntoTable = async (
    databaseName: string,
    tableName: string,
    insertSql: string,
    dataList: any[]
  ) => {
    // remove data
    const removedSql = `TRUNCATE TABLE ${databaseName}.${tableName}`;
    await dbPool.query(removedSql);
    console.log(`${removedSql} SUCCESS!!`);

    // devide inserting data as multiple chuncks (1000 records per chunck)
    let start = 0;
    let end: number;
    const size = 1000;
    while (start < dataList.length) {
      end = start + size;
      const records = dataList.slice(start, end);
      // insert chunck of data into DB
      const insertStatement = mysqlPromise.format(insertSql, [records]);
      await dbPool.query(insertStatement);
      start = end;
    }
    console.log(`INSERT ${databaseName}.${tableName} SUCCESS!!`);
  };

  private getTableData = (filePath: string) => {
    const context = fs.readFileSync(filePath, 'utf8');
    const lines = context.split('\n');

    const dataList: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      // start at second line => ignore first line

      const line = lines[i];

      // ignore line space
      if (!line || line === '') continue;

      // ignore a commented line
      if (line.charAt(0) === '#') continue;

      const data = line.split('\t');
      dataList.push(data);
    }
    return dataList;
  };
}

export const updateDatabase = new UpdateDatabase();
