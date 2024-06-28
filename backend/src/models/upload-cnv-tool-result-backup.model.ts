import { UploadCnvToolResultDto } from '../databases/incnv/dto/upload-cnv-tool-result.dto';
import { uploadCnvToolResultDao } from '../databases/incnv/dao/upload-cnv-tool-result.dao';
import { tabFileMappingDao } from '../databases/incnv/dao/tab-file-mapping.dao';
import { reformatCnvToolResultModel } from './reformat-cnv-tool-result.model';
import fs from 'fs';

export class UploadCnvToolResultModel {
  public addUploadCnvToolResult = async (
    upload: UploadCnvToolResultDto,
    filePath: string
  ): Promise<number | undefined> => {
    // Get Tab File Mapping
    const tabFileMapping = await tabFileMappingDao.getTabFileMapping(
      upload.tabFileMappingId!
    );

    // Insert Upload CNV Tool Result and receive insertId
    const uploadCnvToolResultId = await uploadCnvToolResultDao.addUploadCnvToolResult(
      upload
    );
    try {
      await reformatCnvToolResultModel.reformatFile(
        uploadCnvToolResultId,
        filePath,
        tabFileMapping
      );
      fs.unlink(filePath, err => {
        if (err) {
          console.error(err);
          return;
        }
      });
      return uploadCnvToolResultId;
    } catch (err) {
      await uploadCnvToolResultDao.deleteUploadCnvToolResult(
        uploadCnvToolResultId
      );
      throw err;
    }
  };
}

export const uploadCnvToolResultModel = new UploadCnvToolResultModel();
