import { userModel } from '../models/user.model';
import * as express from 'express';
import { AuthenResDto } from '../dto/authen.dto';

export class UserController {
  public createUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const user = await userModel.createUser(email, password);
      res.status(201).json({
        user
      });
    } catch (err) {
      next(err);
    }
  };

  public login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const email = req.body.email,
      password = req.body.password;
    try {
      const authenData: AuthenResDto = await userModel.login(email, password);
      res.status(200).json({ payload: authenData });
    } catch (err) {
      next(err);
    }
  };
}

export const userController = new UserController();
