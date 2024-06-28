import { AuthenMiddleware } from '../middleware/authen.middleware';
import express from 'express';
const router = express.Router();

import userRoutes from './user.route';
import uploadRoutes from './upload-cnv-tool-result.route';
import reformatRoutes from './reformat-cnv-tool-result.route';
import samplesetRoutes from './sampleset.route';
import tabFileMappingRoutes from './tab-file-mapping.route';
import analysisRoutes from './analysis.route';
import datasourceRoute from './datasource.route';


export default function (app: express.Application) {
  app.use('/api/ping', ((req, res, next) => {
    return res.status(201).json({
      message: 'pong'
    });
  }));
  app.use('/api/users', userRoutes);
  app.use(
    '/api/upload-cnv-tool-results',
    [AuthenMiddleware.checkAuth],
    uploadRoutes
  );
  app.use(
    '/api/reformat-cnv-tool-results',
    [AuthenMiddleware.checkAuth],
    reformatRoutes
  );
  app.use('/api/samplesets', [AuthenMiddleware.checkAuth], samplesetRoutes);
  app.use(
    '/api/tab-file-mappings',
    [AuthenMiddleware.checkAuth],
    tabFileMappingRoutes
  );
  app.use('/api/analysises', [AuthenMiddleware.checkAuth], analysisRoutes);
  app.use('/api/datasource', datasourceRoute)
}
