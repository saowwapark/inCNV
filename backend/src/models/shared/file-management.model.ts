import fs from 'fs';
import * as path from 'path';
import cron from 'cron';

export class FileManagement {
  // delete all file in directory
  clearAllFiles = (dirPath: string) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(dirPath, file), err => {
          if (err) throw err;
          console.log(`Directory Path: ${dirPath}`);
          console.log('Delete all files in directory Done!!');
        });
      }
    });
  };

  createConJon = (cronTime: string, callback) => {
    var CronJob = cron.CronJob;
    var job = new CronJob(cronTime, callback());
    job.start();
  };
}
