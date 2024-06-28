import * as mysql from 'mysql2/promise';
import { inCnvPool } from '../../../config/database.config';
import { IdAndNameDto } from '../../../dto/id-and-name.dto';
import { SamplesetDto } from '../dto/sampleset.dto';
import { userService } from '../../../services/user.service';

export class SamplesetDao {
  private parse(samplesetDb) {
    const samplesetDto = new SamplesetDto();
    samplesetDto.samplesetId = samplesetDb.sampleset_id;
    samplesetDto.userId = samplesetDb.user_id;
    samplesetDto.samplesetName = samplesetDb.sampleset_name;
    samplesetDto.description = samplesetDb.description;
    samplesetDto.samples = samplesetDb.samples;
    samplesetDto.createDate = samplesetDb.create_date;
    samplesetDto.modifyDate = samplesetDb.modify_date;
    return samplesetDto;
  }

  public async addSampleset(req) {
    const body = req.body;
    const userId = userService.getUserId(req),
      name = body.samplesetName,
      description = body.description,
      samples = JSON.stringify(body.samples);
    const data = [userId, name, description, samples];
    const sql = mysql.format(
      `INSERT INTO sampleset (
        user_id, sampleset_name, description, samples, create_date) 
      VALUES(?, ?, ?, ?, NOW())`,
      data
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.OkPacket>(sql);
  }

  public getIdAndNames = async (userId: number) => {
    const sql = mysql.format(
      `SELECT sampleset_id AS id,
            sampleset_name AS name
        FROM sampleset
        WHERE user_id = ?
        ORDER BY name`,
      [userId]
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    const idAndNames: IdAndNameDto[] = [];

    rows.forEach(row => {
      const idAndName = new IdAndNameDto(row);
      idAndNames.push(idAndName);
    });
    return idAndNames;
  };

  public getSamplesets = async userId => {
    const sql = mysql.format(
      `SELECT *
        FROM sampleset
        WHERE user_id = ?
        ORDER BY sampleset_name`,
      [userId]
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    const samplesets: SamplesetDto[] = [];

    rows.forEach(row => {
      const sampleset = this.parse(row);
      samplesets.push(sampleset);
    });
    return samplesets;
  };

  public getSamplesetsToAnalyze = async userId => {
    const sql = mysql.format(
      `SELECT sampleset_id, sampleset_name, description, samples
        FROM sampleset
        WHERE user_id = ?
        ORDER BY sampleset_name`,
      [userId]
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    const samplesets: SamplesetDto[] = [];

    rows.forEach(row => {
      const sampleset = this.parse(row);
      samplesets.push(sampleset);
    });
    return samplesets;
  };

  public countSampleset = async req => {
    const userId = userService.getUserId(req),
      search = `%${req.query.search || ''}%`;
    const sql = mysql.format(
      `SELECT COUNT(*) AS total
    FROM sampleset
    WHERE user_id = ? AND sampleset_name LIKE ?`,
      [userId, search]
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);

    return rows[0].total;
  };

  public findSampleset = async req => {
    const queryParams = req.query;

    const search = `%${queryParams.search || ''}%`,
      // sortOrder = queryParams.sortOrder,
      pageNumber = parseInt(queryParams.pageNumber) || 0,
      pageSize = parseInt(queryParams.pageSize);

    const initialPos = pageNumber * pageSize;

    const userId = userService.getUserId(req);
    const data = [userId, search, initialPos, pageSize];
    const sql = mysql.format(
      `SELECT * FROM sampleset 
    WHERE user_id = ? AND sampleset_name LIKE ? 
    ORDER BY create_date DESC LIMIT ?, ?`,
      data
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);

    const samplesets: SamplesetDto[] = [];
    rows.forEach(row => {
      const sampleset = this.parse(row);
      samplesets.push(sampleset);
    });
    return samplesets;
  };

  public editSampleset = async req => {
    const body = req.body;

    const samplesetId = body.samplesetId,
      name = body.samplesetName,
      description = body.description,
      samples = JSON.stringify(body.samples);
    const data = [name, description, samples, samplesetId];
    const sql = mysql.format(
      `UPDATE sampleset 
      SET   sampleset_name = ?,
            description = ?,
            samples = ?,
            modify_date = NOW() 
      WHERE sampleset_id = ?`,
      data
    );
    console.log(sql);
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(sql);
  };

  public deleteSamplesets = async samplesetIds => {
    const sql = mysql.format(
      `DELETE FROM sampleset 
      WHERE sampleset_id IN (?)`,
      [samplesetIds]
    );
    console.log(sql);
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(sql);
  };
}

export const samplesetDao = new SamplesetDao();
