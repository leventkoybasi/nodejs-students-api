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
import {
  createStudentSchema,
  updateStudentSchema,
} from '../validators/student.js';
import { validateBody } from '../middlewares/validatorBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const studentsRouter = Router();

// Starts the students router endpoint
studentsRouter.get('/', ctrlWrapper(getStudentsController));
studentsRouter.get(
  '/:studentId',
  isValidId,
  ctrlWrapper(getStudentByIdController),
);
studentsRouter.post(
  '/',
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController),
);
studentsRouter.delete(
  '/:studentId',
  isValidId,
  ctrlWrapper(deleteStudentController),
);
// upsert => update or instert
studentsRouter.put(
  '/:studentId',
  isValidId,
  ctrlWrapper(updatePutStudentController),
); // edit whole student object with put method
studentsRouter.patch(
  '/:studentId',
  isValidId,
  validateBody(updateStudentSchema),
  ctrlWrapper(updatePatchStudentController),
); // edit only one field of student object with patch method

export default studentsRouter;
