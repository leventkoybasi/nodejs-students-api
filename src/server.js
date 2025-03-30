import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import studentsRouter from './routers/students.js';

dotenv.config();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT;

export const createServer = () => {
  const app = express();

  //Middleware  CORS
  app.use(cors());
  //Middleware to parse JSON request bodies
  app.use(express.json());
  // Middleware to PINO
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/students', studentsRouter);

  //handle 404 error
  app.use((req, res) => {
    res.status(404).send({
      message: '404 Not found!',
      status: 404,
    });
  });

  //Error handling middleware
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // Log the error
    req.log.error(err);
    // Respond with a 500 status code
    res.status(500).send({
      message: err.message ?? 'Internal Server Error',
      status: err.status ?? 500,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
