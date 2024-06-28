import * as mysql from 'mysql2/promise';
import { TabFileMappingDto } from '../dto/tab-file-mapping.dto';
import { inCnvPool } from '../../../config/database.config';
import { IdAndNameDto } from '../../../dto/id-and-name.dto';
import { userModel } from '../../../models/user.model';
import { userService } from '../../../services/user.service';

export class TabFileMappingDao {
  private parse(tabFileMappingDb) {
    const tabFileMappingDto = new TabFileMappingDto();
    tabFileMappingDto.tabFileMappingId = tabFileMappingDb.tab_file_mapping_id;
    tabFileMappingDto.userId = tabFileMappingDb.user_id;
    tabFileMappingDto.tabFileMappingName =
      tabFileMappingDb.tab_file_mapping_name;
    tabFileMappingDto.createDate = tabFileMappingDb.create_date;
    tabFileMappingDto.modifyDate = tabFileMappingDb.modify_date;

    tabFileMappingDto.headerColumnMapping = {
      sample: tabFileMappingDb.sample,
      chromosome: tabFileMappingDb.chromosome,
      startBp: tabFileMappingDb.start_bp,
      endBp: tabFileMappingDb.end_bp,
      cnvType: tabFileMappingDb.cnv_type
    };

    tabFileMappingDto.dataFieldMapping = {
      chromosome22: tabFileMappingDb.chromosome_22,
      duplication: tabFileMappingDb.duplication,
      deletion: tabFileMappingDb.deletion
    };
    return tabFileMappingDto;
  }

  public getTabFileMapping = async (tabFileMappingId: number) => {
    console.log('getTabFileMapping');
    const sql = mysql.format(
      `SELECT * FROM tab_file_mapping 
  WHERE tab_file_mapping_id = ?`,
      tabFileMappingId
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    const tabFileMapping = this.parse(rows[0]);
    return tabFileMapping;
  };

  public editTabFileMapping = async req => {
    const body = req.body;
    const column = body.headerColumnMapping;
    const field = body.dataFieldMapping;

    const tabFileMappingId = body.tabFileMappingId,
      tabFileMappingName = body.tabFileMappingName,
      sample = column.sample,
      chromosome = column.chromosome,
      startBp = column.startBp,
      endBp = column.endBp,
      cnvType = column.cnvType,
      chromosome22 = field.chromosome22,
      duplication = field.duplication,
      deletion = field.deletion;

    const post = [
      tabFileMappingName,
      sample,
      chromosome,
      startBp,
      endBp,
      cnvType,
      chromosome22,
      duplication,
      deletion,
      tabFileMappingId
    ];
    const sql = mysql.format(
      `UPDATE tab_file_mapping 
      SET   tab_file_mapping_name = ?, sample = ?, chromosome = ?,
            start_bp = ?, end_bp = ?, cnv_type = ?,
            chromosome_22 = ?, duplication = ?, deletion = ?,
            modify_date = NOW() 
      WHERE tab_file_mapping_id = ?`,
      post
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    return rows[0];
  };

  public addTabFileMapping = async req => {
    const body = req.body;
    const column = body.headerColumnMapping;
    const field = body.dataFieldMapping;

    const userId = userService.getUserId(req),
      tabFileMappingName = body.tabFileMappingName,
      sample = column.sample,
      chromosome = column.chromosome,
      startBp = column.startBp,
      endBp = column.endBp,
      cnvType = column.cnvType,
      chromosome22 = field.chromosome22,
      duplication = field.duplication,
      deletion = field.deletion;

    const post = [
      userId,
      tabFileMappingName,
      sample,
      chromosome,
      startBp,
      endBp,
      cnvType,
      chromosome22,
      duplication,
      deletion
    ];
    const sql = mysql.format(
      `INSERT INTO tab_file_mapping (
        user_id, tab_file_mapping_name, sample, chromosome,
        start_bp, end_bp, cnv_type, chromosome_22,
        duplication, deletion, create_date) 
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      post
    );
    console.log(sql);
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(sql);
  };

  public deleteTabFileMapping = async req => {
    const tabFileMappingId = req.params.tabFileMappingId;
    const sql = mysql.format(
      `DELETE FROM tab_file_mapping 
      WHERE tab_file_mapping_id = ?`,
      tabFileMappingId
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    console.log(rows);
    return rows[0];
  };

  public getIdAndName = async userId => {
    const sql = mysql.format(
      `SELECT tab_file_mapping_id AS id,
            tab_file_mapping_name AS name
        FROM tab_file_mapping
        WHERE user_id = ?
        ORDER BY name`,
      userId
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

  public getTabFileMappings = async req => {
    const userId = userService.getUserId(req);
    const sql = mysql.format(
      `SELECT * FROM tab_file_mapping
        WHERE user_id = ? 
        ORDER BY create_date DESC`,
      [userId]
    );
    console.log(sql);
    const [rows] = await inCnvPool.query<mysql.RowDataPacket[]>(sql);

    const tabFileMappings: TabFileMappingDto[] = [];
    rows.forEach(row => {
      const mapping = this.parse(row);
      tabFileMappings.push(mapping);
    });
    return tabFileMappings;
  };
}

export const tabFileMappingDao = new TabFileMappingDao();
