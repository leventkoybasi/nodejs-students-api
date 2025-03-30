import { Router } from 'express';
import {
  getStudentByIdController,
  getStudentsController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const studentsRouter = Router();

// Starts the students router endpoint
studentsRouter.get('/', ctrlWrapper(getStudentsController));
studentsRouter.get('/:studentId', ctrlWrapper(getStudentByIdController));

export default studentsRouter;
