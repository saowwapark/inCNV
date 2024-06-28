import { inCnvPool, dbPool } from '../../config/database.config';

import * as mysql from 'mysql2/promise';
import { DatabaseScript } from './database-const';

export class CreateDatabase {
  // private checkExistDatabase = async (
  //   connection: mysql.Connection,
  //   databaseName: string
  // ) => {
  //   const statement =
  //     'SELECT * FROM information_database.databaseta WHERE database_name = ?';
  //   const sql = mysql.format(statement, [databaseName]);
  //   console.log(sql);
  //   const [rows]: any[] = await connection.query<mysql.RowDataPacket[]>(sql);
  //   if (rows && rows.length > 0) {
  //     return true;
  //   }
  // };

  // private checkExistTable = async (
  //   connection: mysql.Connection,
  //   databaseName: string,
  //   tableName: string
  // ) => {
  //   const sql = `SHOW TABLES FROM ${databaseName} like '${tableName}'`;
  //   console.log(sql);
  //   const [rows]: any[] = await connection.query<mysql.RowDataPacket[]>(sql);
  //   if (rows && rows.length > 0) {
  //     return true;
  //   }
  // };

  // checkAndCreate = async (
  //   connection: mysql.Connection,
  //   dbDatabases: DatabaseConfig[]
  // ) => {
  //   for (const dbDatabase of dbDatabases) {
  //     if (!this.checkExistDatabase(connection, dbDatabase.databaseName)) {
  //       // create database
  //       const databaseSql = `CREATE DATABASE IF NOT EXISTS ${dbDatabase.databaseName}`;
  //       // create empty tables
  //     } else {
  //       for (const table of dbDatabase.tables) {
  //         if (
  //           !this.checkExistTable(
  //             connection,
  //             dbDatabase.databaseName,
  //             table.tableName
  //           )
  //         ) {
  //           // create empty tables
  //         }
  //       }
  //     }
  //   }
  // };

  crateDb = async (databases: DatabaseScript[]): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      for (const database of databases) {
        const databaseSql = `CREATE DATABASE IF NOT EXISTS ${database.databaseName}`;
        try {
          await dbPool.query(databaseSql);
        } catch (err) {
          const errMsg = 'Error!! ' + databaseSql + '\n' + err;
          reject(new Error(errMsg));
        }
        for (const dbTable of database.tables) {
          try {
            await dbPool.query(dbTable.createSql);
          } catch (err) {
            const errMsg = 'Error!! ' + dbTable.createSql + '\n' + err;
            reject(new Error(errMsg));
          }
        }
      }
      resolve(
        '==> Creating DB if not existing SUCCESS!!'
      );
    });
  };

  // updateDbVersion = async (dbDatabase: SchmaConfig)
}

export const createDatabase = new CreateDatabase();
