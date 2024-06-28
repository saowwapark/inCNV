import { tabFileMappingDao } from '../databases/incnv/dao/tab-file-mapping.dao';
import { userService } from '../services/user.service';
import express from 'express';

export class TabFileMappingController {
  public editTabFileMapping = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await tabFileMappingDao.editTabFileMapping(req);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public addTabFileMapping = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const tabFileMapping = await tabFileMappingDao.addTabFileMapping(req);
      res.status(200).json({
        payload: tabFileMapping
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteTabFileMapping = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await tabFileMappingDao.deleteTabFileMapping(req);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public getIdAndName = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = userService.getUserId(req);
      const idAndNames = await tabFileMappingDao.getIdAndName(userId);
      res.status(200).json({
        payload: idAndNames
      });
    } catch (err) {
      next(err);
    }
  };

  public getTabFileMappings = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const tabFileMappings = await tabFileMappingDao.getTabFileMappings(req);
      res.status(200).json({
        payload: tabFileMappings
      });
    } catch (err) {
      next(err);
    }
  };
}

export const tabFileMappingController = new TabFileMappingController();
