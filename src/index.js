import { TEMP_FOLDER, UPLOAD_FOLDER } from './constants/index.js';
import { initMongoDB } from './db/initMongoDB.js';
import { createServer } from './server.js';
import { createFileIfNotExist } from './utils/createFileIfNotExist.js';

const bootstrap = async () => {
  await initMongoDB();
  await createFileIfNotExist(UPLOAD_FOLDER);
  await createFileIfNotExist(TEMP_FOLDER);
  createServer();
};

bootstrap();
