import express from 'express';
import * as jwt from 'jsonwebtoken';

export class UserService {
  // Not use yet
  public getUserId = (req: express.Request): number | undefined => {
    const token = req.headers.authorization!.split(' ')[1];
    const decode = jwt.decode(token);
    if (decode) {
      const userId = decode['userId'];
      return userId;
    }
  };
}

export const userService = new UserService();
