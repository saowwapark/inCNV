import * as mysql from 'mysql2/promise';
import { inCnvPool } from '../src/configs/database';

async function addUser() {
  const userId = 2;
  const email = 'testSql@gmail.com';
  const password = 'testpassword';
  const post = [userId, email, password];

  const sql = mysql.format(
    `INSERT INTO user (
        user_id, email, password , create_date) 
      VALUES(?, ?, ?, NOW())`,
    post
  );
  console.log(sql);
  try {
    const value = await inCnvPool.query<mysql.OkPacket>(sql);
    console.log(value);
  } catch (err) {
    console.log(err);
  }
}

async function deleteUser() {
  const sql = mysql.format(
    `DELETE FROM user 
      WHERE user_id = ?`,
    [2]
  );
  console.log(sql);
  try {
    const [value] = await inCnvPool.query<mysql.OkPacket>(sql);
    if (value.affectedRows !== 1) {
      console.error(`cannot delete record user_id = 2`);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getUser() {
  const sql = mysql.format(`SELECT * FROM user`);
  console.log(sql);
  try {
    const value = await inCnvPool.query<mysql.RowDataPacket[]>(sql);
    console.log(value);
  } catch (err) {
    console.log(err);
  }
}

// call function
// addUser();

deleteUser();
