import { Router } from 'express';
import {
  createStudentController,
  deleteStudentController,
  getStudentByIdController,
  getStudentsController,
  updatePatchStudentController,
  updatePutStudentController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validatorSchema } from '../validators/student.js';
import { validateBody } from '../middlewares/validatorBody.js';

const studentsRouter = Router();

// Starts the students router endpoint
studentsRouter.get('/', ctrlWrapper(getStudentsController));
studentsRouter.get('/:studentId', ctrlWrapper(getStudentByIdController));
studentsRouter.post(
  '/',
  validateBody(validatorSchema),
  ctrlWrapper(createStudentController),
);
studentsRouter.delete('/:studentId', ctrlWrapper(deleteStudentController));
// upsert => update or instert
studentsRouter.put('/:studentId', ctrlWrapper(updatePutStudentController)); // edit whole student object with put method
studentsRouter.patch('/:studentId', ctrlWrapper(updatePatchStudentController)); // edit only one field of student object with patch method

export default studentsRouter;
