import axios from 'axios';
import fs from 'fs-extra';
import * as path from 'path';
import { DatasourceVersion } from './datasource-version.model';
import {
  DATASOURCES_VERSION_PATH,
  DATASOURCES_ORIGINAL_VERSION_PATH
} from '../../config/path.config';
export class UtilityDatasource {
  public getDatasource = async (
    downloadedUrl: string,
    expectedFileName: string
  ): Promise<ArrayBuffer> => {
    const lastest = (await axios.get(downloadedUrl)).data;

    const version = lastest.tag_name;
    const assets = lastest.assets;

    let data: ArrayBuffer;
    for (const asset of assets) {
      const url = asset.browser_download_url;
      const filename = asset.name;
      if (filename === expectedFileName) {
        // download zip file and keep in array buffer format
        console.log('Download from: ' + url);
        data = (
          await axios.get(url, {
            responseType: 'arraybuffer'
          })
        ).data;
        break;
      }
      if (data! !== undefined) break;
    }
    return data!;
  };

  /**
   * reformat data from array buffer format to zip file
   */
  public saveRetrievedFile = (filePath: string, data: ArrayBuffer) => {
    fs.writeFileSync(filePath, data);
    const index = filePath.lastIndexOf('/');
    const expectedFileName = filePath.substring(index + 1);
    console.log(`${expectedFileName} was saved`);
  };

  public getDatasourceVersion = (): DatasourceVersion => {
    const rawData = fs.readFileSync(DATASOURCES_VERSION_PATH, 'utf8');
    return JSON.parse(rawData);
  };

  public getDatasourceOriginalVersion = (): DatasourceVersion => {
    let rawData = fs.readFileSync(DATASOURCES_ORIGINAL_VERSION_PATH, 'utf8');
    return JSON.parse(rawData);
  };

  public writeDatasourceVersion = (data: DatasourceVersion) => {
    fs.writeFileSync(DATASOURCES_VERSION_PATH, JSON.stringify(data));
  };

  deleteFiles = (directory: string) => {
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        try {
          fs.removeSync(path.join(directory, file));
        } catch (err) {
          console.log(`Delete all files in ${directory} Done!!`);
        }
      }
    });
  };
}

export const utilityDatasource = new UtilityDatasource();
