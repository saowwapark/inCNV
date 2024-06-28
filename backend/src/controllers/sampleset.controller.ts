import { samplesetModel } from './../models/sampleset.model';
import { samplesetDao } from '../databases/incnv/dao/sampleset.dao';
import express from 'express';
import { userService } from '../services/user.service';

export class SamplesetController {
  public getIdAndName = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = userService.getUserId(req);
      const idAndNames = await samplesetDao.getIdAndNames(userId!);
      res.status(200).json({
        payload: idAndNames
      });
    } catch (err) {
      next(err);
    }
  };

  public countSampleset = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const totalSampleset = await samplesetDao.countSampleset(req);
      res.status(200).json({
        payload: totalSampleset
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Find samplesets per page
   */
  public findSamplesets = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const samplesets = await samplesetDao.findSampleset(req);
      res.status(200).json({
        payload: samplesets
      });
    } catch (err) {
      next(err);
    }
  };

  public addSampleset = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await samplesetDao.addSampleset(req);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public editSampleset = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await samplesetDao.editSampleset(req);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public deleteSamplesets = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const samplesetIds = req.body.samplesetIds;
      console.log(samplesetIds);
      await samplesetDao.deleteSamplesets(samplesetIds);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public getSamplesets = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = userService.getUserId(req);
      const uploadCnvToolResults = await samplesetModel.getSamplesets(userId!);
      res.status(200).json({ payload: uploadCnvToolResults });
    } catch (err) {
      next(err);
    }
  };
}

export const samplesetController = new SamplesetController();
