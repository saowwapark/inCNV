import express from 'express';
import * as path from 'path';
import multer from 'multer';
import { UPLOADED_CNV_RESULTS_TMP_DIR_PATH } from '../config/path.config';

export class UploadMiddleware {
  static uploadFile = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const tmpDirPath = UPLOADED_CNV_RESULTS_TMP_DIR_PATH;
    const MIME_TYPE_MAP = {
      'text/plain': 'txt'
    };
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error('Invalid mime type');
        cb(error, tmpDirPath);
      },
      filename: (req, file, cb) => {
        const name = file.originalname
          .toLowerCase()
          .split(' ')
          .join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${name}-${Date.now()}.${extension}`);
      }
    });
    const upload = multer({ storage: storage }).single('file');

    upload(req, res, err => {
      if (err) {
        console.error(err);
        res.status(500).end();
      } else {
        console.log(req.file);
        next();
      }
    });
  };
}
