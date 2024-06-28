import { bioGrch38Pool, inCnvPool, dbPool, bioGrch37Pool } from './config/database.config';
/** Third Party Packages **/
import http from 'http';
import express from 'express';
import { App } from './app';
import { envData } from './db-env';
class Server {
  port: number;
  hostname: string;
  server: http.Server;

  constructor(port, hostname, app) {
    this.port = this.normalizePort(port);
    this.hostname = hostname;

    // create server according to setting application
    this.server = http.createServer(app);
    this.server.listen(this.port, this.hostname);
    this.config();
  }

  config() {
    this.server.on('error', error => {
      this.onError(error);
    });
  }

  private onError(error) {
    console.log(error);
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind =
      typeof this.port === 'string' ? 'pipe ' + this.port : 'port ' + this.port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }
}

/******************************** Main ******************************/

// setting application
const app: express.Application = App.bootstrap().app;

// create server
export const server = new Server(envData.port, envData.host, app).server;


// (async () => {
//   console.log(
//     '\n#################################  CHECKING DATASOURCE VERSION ...  #################################'
//   );
//   await updateDatasource.main();

//   console.log(
//     '#################################  CHECKING DATASOURCE VERSION SUCCESS!!  #################################'
//   );
// })();

// kill [ps_id]
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    try {
      console.log('Ending Db connection.');
      bioGrch37Pool.end();
      bioGrch38Pool.end();
      inCnvPool.end();
      dbPool.end();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
});

// ctrl + c
process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    try {
      console.log('Ending Db connection.');
      bioGrch37Pool.end();
      bioGrch38Pool.end();
      inCnvPool.end();
      dbPool.end();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
