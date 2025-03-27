import { initMongoDB } from './db/initMongoDB.js';
import { createServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  createServer();
};

bootstrap();
