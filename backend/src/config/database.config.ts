import mysqlPromise from 'mysql2/promise';
import { envData } from '../db-env';

const dbEnv = envData.dbEnv;

const dbGeneralConfig = {
  host: dbEnv?.dbHost,
  port: Number(dbEnv?.dbPort),
  user: dbEnv?.dbUserName,
  password: dbEnv?.dbPassword,
}

const dynamicDbConfig = {
  ...dbGeneralConfig,
  connectTimeout: 100000,
  // acquireTimeout: 100000,
  connectionLimit: 30,
  queueLimit: 10000
};

const inCnvConfig = {
  ...dbGeneralConfig,
  database: 'inCNV',
  connectTimeout: 100000,
  // acquireTimeout: 100000,
  connectionLimit: 30,
  queueLimit: 10000
};

const bioGrch37Config = {
  ...dbGeneralConfig,
  database: 'bio_grch37',
  connectTimeout: 100000,
  // acquireTimeout: 100000,
  connectionLimit: 80,
  queueLimit: 10000
};

const bioGrch38Config = {
  ...dbGeneralConfig,
  database: 'bio_grch38',
  connectTimeout: 100000,
  // acquireTimeout: 100000,
  connectionLimit: 80,
  queueLimit: 10000
};

export const bioGrch37Pool = mysqlPromise.createPool(bioGrch37Config);
export const bioGrch38Pool = mysqlPromise.createPool(bioGrch38Config);
export const inCnvPool = mysqlPromise.createPool(inCnvConfig);
export const dbPool = mysqlPromise.createPool(dynamicDbConfig);
