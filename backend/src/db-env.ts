import * as dotenv from 'dotenv';

export interface BackendEnv {
  host?: string;
  port?: string;
  dbEnv?: DatabaseEnv;
}
export interface DatabaseEnv {
  dbHost?: string,
  dbPort?: string,
  dbUserName?: string,
  dbPassword?: string
}

if (process.env.NODE_ENV === "dev") {
  dotenv.config({
    path: `${__dirname}/../.env.${process.env.NODE_ENV}`
  })
}

function checkUndefinedProps(object: Object): string[] {
  const undefinedProps: string[] = [];
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      if (value === undefined) {
        undefinedProps.push(`${key}`);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively check nested objects
        const nestedUndefinedProps = checkUndefinedProps(value as Object);
        undefinedProps.push(...nestedUndefinedProps);
      }
    }
  }
  return undefinedProps;
}


/* For developer, please set "export NODE_ENV=dev" at terminal.
*  "unset NODE_ENV", "echo $NODE_ENV"
*/


let envData: BackendEnv = {
  host: process.env.HOST,
  port: process.env.PORT,
  dbEnv: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUserName: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD
  }
}

if (process.env.NODE_ENV === 'dev') {
  console.log(`Back-end host: ${envData.host}:${envData.port}`);
  console.log(`Database host: ${envData.dbEnv?.dbHost}:${envData.dbEnv?.dbPort}`);
  console.log('dbUserName: ' + envData.dbEnv?.dbUserName);
  console.log('dbPassword: ' + envData.dbEnv?.dbPassword);
}

const undefinedProps = checkUndefinedProps(envData)
if (undefinedProps?.length > 0) {
  console.error(`You do not set some enviroments for running: ${undefinedProps}.
  Please see information here, https://github.com/saowwapark/inCNV?tab=readme-ov-file#how-to-configure`);
}
export { envData };