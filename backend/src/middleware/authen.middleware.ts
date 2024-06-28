import * as jwt from 'jsonwebtoken';
import express from 'express';

export class AuthenMiddleware {
  static checkAuth = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      res.status(401).json('Not authenticated.');
    }
    let decodedToken;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
      } catch (err: any) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
          res
            .status(500)
            .json(
              'Authentication is expired.\nPlease sign out and sign in again.'
            );
        }
        res.status(500).json(err + '\nPlease sign out and sign in again.');
      }
      if (!decodedToken) {
        res.status(401).json('Not authenticated.');
      }
    }
    next();
  };
}
