import * as path from 'path';
import * as dotenv from 'dotenv';

const filename = 'dev.env';
const tsPath = path.resolve(__dirname, `../../../${filename}`);
dotenv.config({ path: tsPath });

const setupEnvConfig = () => {
  return process.env;
};

export const enviroments = {
  dev: '.env',
  prod: '.prod.env',
};

// setup env variables for secret config as per the environment
setupEnvConfig();
