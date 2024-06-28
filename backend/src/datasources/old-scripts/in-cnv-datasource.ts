import { inCnvPool } from '../../config/database.config';
import mysql from 'mysql2/promise';

export class inCnvDataSource {
  private creatUserTable = async () => {
    await inCnvPool.execute(`DROP TABLE IF EXISTS user`);
    const sql = `CREATE TABLE user (
  user_id int(11) unsigned NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  create_date datetime DEFAULT NULL,
  modify_date datetime DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;
    console.log(sql);
    await inCnvPool.execute(sql);
    console.log(`CREATE 'user' TABLE SUCCESS!!`);
  };

  private createSamplesetTable = async () => {
    await inCnvPool.execute(`DROP TABLE IF EXISTS sampleset`);
    const sql = `CREATE TABLE sampleset (
  sampleset_id int(11) unsigned NOT NULL AUTO_INCREMENT,
  user_id int(11) unsigned DEFAULT NULL,
  sampleset_name varchar(45) DEFAULT NULL,
  description varchar(128) DEFAULT NULL,
  samples json DEFAULT NULL,
  create_date datetime DEFAULT NULL,
  modify_date datetime DEFAULT NULL,
  PRIMARY KEY (sampleset_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;
    console.log(sql);
    await inCnvPool.execute(sql);
    console.log(`CREATE 'sampleset' TABLE SUCCESS!!`);
  };

  private creatTabFileMappingTable = async () => {
    await inCnvPool.execute(`DROP TABLE IF EXISTS tab_file_mapping`);
    const sql = `CREATE TABLE tab_file_mapping (
                  tab_file_mapping_id int(11) NOT NULL AUTO_INCREMENT,
                  user_id int(11) DEFAULT NULL,
                  tab_file_mapping_name varchar(45) DEFAULT NULL,
                  sample varchar(128) DEFAULT NULL,
                  chromosome varchar(45) DEFAULT NULL,
                  start_bp varchar(45) DEFAULT NULL,
                  end_bp varchar(45) DEFAULT NULL,
                  cnv_type varchar(45) DEFAULT NULL,
                  chromosome_22 varchar(45) DEFAULT NULL,
                  duplication varchar(45) DEFAULT NULL,
                  deletion varchar(45) DEFAULT NULL,
                  create_date datetime DEFAULT NULL,
                  modify_date datetime DEFAULT NULL,
                  PRIMARY KEY (tab_file_mapping_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;
    console.log(sql);
    await inCnvPool.execute(sql);
    console.log(`CREATE 'tab_file_mapping' SUCCESS!!`);
  };

  private createUploadCnvToolResultTable = async () => {
    await inCnvPool.execute(`DROP TABLE IF EXISTS upload_cnv_tool_result`);
    const sql = `CREATE TABLE upload_cnv_tool_result (
                  upload_cnv_tool_result_id int(11) unsigned NOT NULL AUTO_INCREMENT,
                  user_id int(11) unsigned DEFAULT NULL,
                  sampleset_id int(11) unsigned DEFAULT NULL,
                  tab_file_mapping_id int(11) unsigned DEFAULT NULL,
                  file_name varchar(128) DEFAULT NULL,
                  file_info varchar(128) DEFAULT NULL,
                  cnv_tool_name varchar(45) DEFAULT NULL,
                  reference_genome varchar(45) DEFAULT NULL,
                  tag_descriptions json DEFAULT NULL,
                  create_date datetime DEFAULT NULL,
                  modify_date datetime DEFAULT NULL,
                  PRIMARY KEY (upload_cnv_tool_result_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;
    console.log(sql);
    await inCnvPool.execute(sql);
    console.log(`CREATE 'upload_cnv_tool_result' SUCCESS!!`);
  };

  private createReformatCnvToolResultTable = async () => {
    await inCnvPool.execute(`DROP TABLE IF EXISTS reformat_cnv_tool_result`);
    const sql = `CREATE TABLE reformat_cnv_tool_result (
                  reformat_cnv_tool_result_id int(11) unsigned NOT NULL AUTO_INCREMENT,
                  upload_cnv_tool_result_id int(11) unsigned NOT NULL,
                  sample varchar(45) DEFAULT NULL,
                  chromosome varchar(45) DEFAULT NULL,
                  start_bp int(11) DEFAULT NULL,
                  end_bp int(11) DEFAULT NULL,
                  cnv_type varchar(45) DEFAULT NULL,
                  PRIMARY KEY (reformat_cnv_tool_result_id),
                  KEY upload_cnv_tool_result_id (upload_cnv_tool_result_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;
    console.log(sql);
    await inCnvPool.execute(sql);
    console.log(`CREATE 'reformat_cnv_tool_result' SUCCESS!!`);
  };

  main() {
    this.creatUserTable();
    this.createSamplesetTable();
    this.creatTabFileMappingTable();
    this.createUploadCnvToolResultTable();
    this.createReformatCnvToolResultTable();
  }
}
