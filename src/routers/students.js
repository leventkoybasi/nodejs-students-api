import { Router } from 'express';
import {
  createStudentController,
  deleteStudentController,
  getStudentByIdController,
  getStudentsController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const studentsRouter = Router();

// Starts the students router endpoint
studentsRouter.get('/', ctrlWrapper(getStudentsController));
studentsRouter.get('/:studentId', ctrlWrapper(getStudentByIdController));
studentsRouter.post('/', ctrlWrapper(createStudentController));
studentsRouter.delete('/:studentId', ctrlWrapper(deleteStudentController));

export default studentsRouter;
