import { AuthenResDto } from '../dto/authen.dto';
import { userDao } from '../databases/incnv/dao/user.dao';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions/http.exception';
export class UserModel {
  //  public getUserId = (token: string) => {
  //    const decode = jwt.verify(token, 'secret_this_should_be_longer');
  //    let userId = null;
  //    if (decode) {
  //      userId = decode['userId'];
  //    }
  //    return userId;
  //  };

  // private userId;

  // public getUserId() {
  //   return this.userId;
  // }

  // public setUserId(userId: number) {
  //   this.userId = userId;
  // }

  public createUser = async (email: string, password: string) => {
    const hash = await bcrypt.hash(password, 10);
    const duplicatedUser = await userDao.findUser(email);
    if (duplicatedUser) {
      const error = new HttpException(
        500,
        'That username is taken. Try another.'
      );
      throw error;
    }
    await userDao.addUser(email.toLowerCase(), hash);
  };

  public login = async (
    email: string,
    password: string
  ): Promise<AuthenResDto> => {
    const user = await userDao.findUser(email.toLowerCase());
    if (!user) {
      const error = new HttpException(401, `Couldn't find your account.`);
      throw error;
    }

    if (user.password) {
      const isPasswordCorrected = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrected) {
        const error = new HttpException(401, `Password is not corrected.`);
        throw error;
      }
    }

    // initialize user id
    // this.userId = user.userId;

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.userId
      },
      'secret_this_should_be_longer',
      { expiresIn: '1d' }
    );
    const authenData: AuthenResDto = {
      expiresIn: 86400, // 24 * 60 * 60 seconds
      token: token
    };
    return authenData;
  };
}

export const userModel = new UserModel();
