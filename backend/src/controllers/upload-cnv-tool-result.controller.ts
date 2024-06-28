import { userService } from './../services/user.service';
import { uploadCnvToolResultDao } from '../databases/incnv/dao/upload-cnv-tool-result.dao';
import { uploadCnvToolResultModel } from './../models/upload-cnv-tool-result.model';
import express from 'express';
import { UploadCnvToolResultDto } from '../databases/incnv/dto/upload-cnv-tool-result.dto';

export class UploadCnvToolResultController {
  public addUploadCnvToolResult = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const uploadCnvToolResult: UploadCnvToolResultDto = JSON.parse(
      req.body.uploadCnvToolResult
    );
    uploadCnvToolResult.userId = userService.getUserId(req);

    const filePath = req.file.path;

    try {
      const uploadCnvToolResultId = await uploadCnvToolResultModel.addUploadCnvToolResult(
        uploadCnvToolResult,
        filePath
      );

      res.status(200).json({
        payload: uploadCnvToolResultId
      });
    } catch (err) {
      next(err);
    }
  };

  public getUploadCnvToolResultViews = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = Number(userService.getUserId(req));
      const uploadCnvToolResults = await uploadCnvToolResultDao.getUploadCnvToolResultViews(
        userId
      );
      res.status(200).json({ payload: uploadCnvToolResults });
    } catch (err) {
      next(err);
    }
  };

  public editUploadCnvToolResult = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const uploadCnvToolResult = req.body.uploadCnvToolResult;
      await uploadCnvToolResultDao.editUploadCnvToolResult(uploadCnvToolResult);
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public deleteUploadCnvToolResult = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const uploadCnvToolResultId = +req.params.uploadCnvToolResultId;
      await uploadCnvToolResultDao.deleteUploadCnvToolResult(
        uploadCnvToolResultId
      );
      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };

  public deleteUploadCnvToolResults = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const uploadIds = req.body.uploadCnvToolResultIds;
      await uploadCnvToolResultDao.deleteUploadCnvToolResults(uploadIds);

      res.status(200).end();
    } catch (err) {
      next(err);
    }
  };
}

export const uploadCnvToolResultController = new UploadCnvToolResultController();
