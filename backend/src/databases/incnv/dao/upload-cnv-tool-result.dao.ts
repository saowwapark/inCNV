import {
  UploadCnvToolResultDto,
  UploadCnvToolResultViewDto
} from '../dto/upload-cnv-tool-result.dto';
import * as mysql from 'mysql2/promise';
import { inCnvPool } from '../../../config/database.config';

export class UploadCnvToolResultDao {
  public parse(upload) {
    const uploadCnvToolResultDto = new UploadCnvToolResultDto();
    uploadCnvToolResultDto.uploadCnvToolResultId =
      upload.upload_cnv_tool_result_id;
    uploadCnvToolResultDto.userId = upload.user_id;
    uploadCnvToolResultDto.fileName = upload.file_name;
    uploadCnvToolResultDto.fileInfo = upload.file_info;
    uploadCnvToolResultDto.referenceGenome = upload.reference_genome;
    uploadCnvToolResultDto.cnvToolName = upload.cnv_tool_name;
    uploadCnvToolResultDto.tabFileMappingId = upload.tab_file_mapping_id;
    uploadCnvToolResultDto.samplesetId = upload.sampleset_id;
    uploadCnvToolResultDto.tagDescriptions = upload.tag_descriptions;
    uploadCnvToolResultDto.createDate = upload.create_date;
    uploadCnvToolResultDto.modifyDate = upload.modify_date;

    return uploadCnvToolResultDto;
  }

  public getUploadCnvToolResultViews = async (userId: number) => {
    const post = [userId];
    const sql = mysql.format(
      `SELECT T1.*, T2.tab_file_mapping_name, T3.sampleset_name
        FROM upload_cnv_tool_result AS T1
        INNER JOIN tab_file_mapping AS T2
          ON T1.tab_file_mapping_id = T2.tab_file_mapping_id
        INNER JOIN sampleset AS T3
          ON T1.sampleset_id = T3.sampleset_id
        WHERE T1.user_id = ? 
        ORDER BY T1.file_name`
    );
    const statement = mysql.format(sql, post);
    console.log(statement);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(statement);
    if (rows && rows.length > 0) {
      const uploadCnvToolResultViews: UploadCnvToolResultViewDto[] = [];

      rows.forEach(row => {
        const uploadCnvToolResult: UploadCnvToolResultDto = this.parse(row);
        let uploadCnvToolResultView: UploadCnvToolResultViewDto = {
          ...uploadCnvToolResult
        };
        uploadCnvToolResultView.samplesetName = row.sampleset_name;
        uploadCnvToolResultView.tabFileMappingName = row.tab_file_mapping_name;
        uploadCnvToolResultViews.push(uploadCnvToolResultView);
      });
      return uploadCnvToolResultViews;
    }
  };

  public getUploadCnvToolResultsToChoose = async (
    referenceGenome,
    samplesetId
  ) => {
    const post = [referenceGenome, samplesetId];
    const sql = mysql.format(
      `SELECT upload_cnv_tool_result_id, user_id, file_name, file_info,
          cnv_tool_name, tag_descriptions, create_date
        FROM upload_cnv_tool_result
        WHERE reference_genome = ? 
          AND sampleset_id = ?
        ORDER BY file_name`,
      post
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    if (rows && rows.length > 0) {
      const uploadCnvToolResults: UploadCnvToolResultDto[] = [];

      rows.forEach(row => {
        const uploadCnvToolResult: UploadCnvToolResultDto = this.parse(row);
        uploadCnvToolResults.push(uploadCnvToolResult);
      });
      return uploadCnvToolResults;
    }
  };

  public addUploadCnvToolResult = async (
    upload: UploadCnvToolResultDto
  ): Promise<number> => {
    const post = [
      upload.userId,
      upload.fileName,
      upload.fileInfo,
      upload.referenceGenome,
      upload.cnvToolName,
      upload.tabFileMappingId,
      upload.samplesetId,
      JSON.stringify(upload.tagDescriptions)
    ];

    const sql = `INSERT INTO upload_cnv_tool_result (
          user_id, file_name, file_info,
          reference_genome, cnv_tool_name, tab_file_mapping_id,
          sampleset_id, tag_descriptions, create_date)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW())`
    const statement = mysql.format(
      sql,
      post
    );
    console.log(sql);
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(statement);
    return resultSetHeader.insertId;
  };

  public editUploadCnvToolResult = async (
    uploadCnvToolResult: UploadCnvToolResultDto
  ) => {
    const upload = uploadCnvToolResult;
    const post = [
      upload.fileName,
      upload.fileInfo,
      upload.referenceGenome,
      upload.cnvToolName,
      upload.tabFileMappingId,
      upload.samplesetId,
      JSON.stringify(upload.tagDescriptions),
      upload.uploadCnvToolResultId
    ];
    const sql = mysql.format(
      `UPDATE upload_cnv_tool_result
           SET file_name = ?, file_info = ?,
          reference_genome = ?, cnv_tool_name = ?, tab_file_mapping_id = ?,
          sampleset_id = ?, tag_descriptions = ?
           WHERE upload_cnv_tool_result_id = ?`,
      post
    );
    console.log(sql);
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(sql);
  };

  public deleteUploadCnvToolResult = async (uploadCnvToolResultId: number) => {
    const post = [uploadCnvToolResultId];
    const sql = mysql.format(
      `DELETE FROM upload_cnv_tool_result
        WHERE upload_cnv_tool_result_id = ?`,
      post
    );
    console.log(sql);
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(sql);
    return resultSetHeader.affectedRows;
  };

  public async deleteUploadCnvToolResults(uploadCnvToolResultIds: number[]) {
    const sql = mysql.format(
      `DELETE FROM upload_cnv_tool_result
               WHERE upload_cnv_tool_result_id IN (?)`,
      [uploadCnvToolResultIds]
    );
    console.log(sql);
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(sql);
  }
}

export const uploadCnvToolResultDao = new UploadCnvToolResultDao();
