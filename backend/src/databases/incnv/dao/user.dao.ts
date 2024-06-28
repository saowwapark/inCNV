import { UserDto } from '../dto/user.dto';
import * as mysql from 'mysql2/promise';
import { inCnvPool } from '../../../config/database.config';

export class UserDao {
  private parse(userDb) {
    if (userDb) {
      const userDto = new UserDto();
      userDto.userId = userDb.user_id;
      userDto.email = userDb.email;
      userDto.password = userDb.password;
      userDto.createDate = userDb.create_date;
      userDto.modifyDate = userDb.modify_date;
      return userDto;
    }
  }

  public addUser = async (email, hash: string) => {
    const post = [email, hash];
    const sql = mysql.format(
      `INSERT INTO user (email, password, create_date)
    VALUES (?,?, NOW())`,
      post
    );
    const [resultSetHeader] = await inCnvPool.query<mysql.OkPacket>(sql);
  };

  public findUser = async (email): Promise<UserDto | undefined> => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const [rows] = await inCnvPool.query(sql, email);
    if (rows[0]) {
      const user = this.parse(rows[0]);
      return user;
    }
  };
}

export const userDao = new UserDao();
