import { reformatCnvToolResultDao } from './../databases/incnv/dao/reformat-cnv-tool-result.dao';
import express from 'express';

export class ReformatCnvToolResultController {
  public getPagingResults = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const uploadCnvToolResultId = +req.params.uploadCnvToolResultId;
      const sort = req.query.sort;
      const order = req.query.order;
      const pageNumber = req.query.pageNumber;
      const pageSize = req.query.pageSize;
      const reformatCnvToolResults = await reformatCnvToolResultDao.getPagingResults(
        uploadCnvToolResultId,
        sort,
        order,
        +pageNumber,
        +pageSize
      );
      const totalCount = await reformatCnvToolResultDao.getTotalCount(
        uploadCnvToolResultId
      );
      res.status(200).json({
        payload: {
          items: reformatCnvToolResults,
          totalCount: totalCount
        }
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteReformatByUploadId = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const uploadCnvToolResultId = req.query.uploadCnvToolResultId;
      await reformatCnvToolResultDao.deleteReformatByUploadId(
        +uploadCnvToolResultId
      );
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public deleteReformatCnvToolResults = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const reformatIds = req.body.reformatCnvToolResultIds;
      await reformatCnvToolResultDao.deleteReformatCnvToolResults(reformatIds);

      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public editReformatCnvToolResult = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const reformatCnvToolResult = req.body.reformatCnvToolResult;
      await reformatCnvToolResultDao.editReformatCnvToolResult(
        reformatCnvToolResult
      );
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public addReformatCnvToolResult = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const reformatCnvToolResult = req.body.reformatCnvToolResult;
      await reformatCnvToolResultDao.addReformatCnvToolResult(
        reformatCnvToolResult
      );
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };
}

export const reformatCnvToolResultController = new ReformatCnvToolResultController();
