import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllStudents, getStudentById } from './services/students';

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

  app.get('/students', async (req, res) => {
    const students = await getAllStudents();

    res.status(200).json({
      data: students,
    });
  });

  app.get('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
      res.status(404).json({
        message: 'Öğrenci bulunamadı',
      });
      return;
    }
    res.status(200).json({
      data: student,
    });
  });

  app.get('/', (req, res) => {
    res.status(200).type('text').send('Hello Levent KOYBASI');
  });

  //handle 404 error
  app.use((req, res) => {
    res.status(404).send({
      message: '404 Not found!',
      status: 404,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
