/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import studentsRouter from './routers/students.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_FOLDER } from './constants/index.js';

dotenv.config();

const PORT = process.env.PORT;

export const createServer = () => {
  const app = express();

  //Middleware  CORS
  app.use(cors());
  //Middleware to parse URL-encoded request bodies
  app.use(cookieParser());
  //Middleware to parse JSON request bodies
  app.use(express.json());
  // Middleware to serve static files from the uploads directory.
  app.use('/uploads', express.static(UPLOAD_FOLDER));
  // Middleware to PINO
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  //students endpoint
  app.use('/students', studentsRouter);
  app.use('/auth', authRouter);

  //Not Found Handle Middleware (404 error)
  app.use(notFoundHandler);

  //Error Handling Middleware
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
