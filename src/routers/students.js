import { Router } from 'express';
import {
  getStudentByIdController,
  getStudentsController,
} from '../controllers/students.js';

const studentsRouter = Router();

// Starts the students router endpoint m
studentsRouter.get('/', getStudentsController);

studentsRouter.get('/:studentId', getStudentByIdController);

export default studentsRouter;
