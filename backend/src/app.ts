import {
  UPLOADED_CNV_RESULTS_TMP_DIR_PATH,
  DATASOURCES_TMP_DIR_PATH,
  STATIC_DIR_PATH,
  REF_GENOME_DIR_PATH,
  DGV_DIR_PATH,
  DATASOURCES_VOLUME_DIR_PATH,
  RESULTS_VOLUME_DIR_PATH,
  DATASOURCES_ORIGINAL_VERSION_PATH,
  DATASOURCES_VERSION_PATH
} from './config/path.config';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as mkdirp from 'mkdirp';
import fs from 'fs-extra';

// Use Only Dev
import logger from 'morgan';
import errorHandler from 'errorhandler';
import methodOverride from 'method-override';

/** My Own Imports **/
import indexRoute from './routes/routes.index';
import { errorMiddleware } from './middleware/error.middleware';

export class App {
  public app: express.Application;

  public static bootstrap(): App {
    return new App();
  }

  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();
  }

  public config() {
    // add static paths
    this.app.use(express.static(STATIC_DIR_PATH));

    // tmp path
    mkdirp.sync(UPLOADED_CNV_RESULTS_TMP_DIR_PATH);
    mkdirp.sync(DATASOURCES_TMP_DIR_PATH);
    
    // volume path
    mkdirp.sync(DATASOURCES_VOLUME_DIR_PATH);
    mkdirp.sync(RESULTS_VOLUME_DIR_PATH);
    mkdirp.sync(REF_GENOME_DIR_PATH);
    mkdirp.sync(DGV_DIR_PATH);
    if (!fs.existsSync(DATASOURCES_VERSION_PATH) ){
      console.log(`Creating 'datasources_version.json'`)
      fs.copyFileSync(DATASOURCES_ORIGINAL_VERSION_PATH, DATASOURCES_VERSION_PATH);
    } 
    // use logger middlware
    this.app.use(logger('dev'));

    // use json form parser middlware
    this.app.use(bodyParser.json());

    // use query string parser middlware
    // setup application to parse data that is sent as form-data
    this.app.use(
      bodyParser.urlencoded({
        extended: false
      })
    );

    // user CORS
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        res.set(
          'Access-Control-Allow-Methods',
          'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        );
        next();
      }
    );
    // Respond to preflight requests
    this.app.options('*', (req, res) => {
      res.sendStatus(204);
    });
    // use cookie parser middleware
    this.app.use(cookieParser('SECRET_GOES_HERE'));

    // use override middlware
    this.app.use(methodOverride());

    // catch 404 and forward to error handler
    this.app.use(function(
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      err.status = 404;
      next(err);
    });

    //error handling
    this.app.use(errorHandler());

    indexRoute(this.app);
    this.app.use(errorMiddleware);
  }
}
