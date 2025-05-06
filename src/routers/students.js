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
import { authorize } from '../middlewares/authorize.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { USER_ROLES } from '../constants/index.js';
import { upload } from '../middlewares/upload.js';

// Starts with '/students' endpoint
const studentsRouter = Router();
studentsRouter.use(authorize); // Protect all routes with authorization middleware

// get students -> Tum Ogrenciler
// ! Only Teacher
studentsRouter.get(
  '/',
  checkRoles(USER_ROLES.TEACHER),
  ctrlWrapper(getStudentsController),
);

// get student by id -> Id'si verilern ogrenci
// ! Teacher + Parent
studentsRouter.get(
  '/:studentId',
  isValidId,
  checkRoles(USER_ROLES.TEACHER, USER_ROLES.PARENT),
  ctrlWrapper(getStudentByIdController),
);

// create student -> Ogrenci olustur
// ! Only Teacher
studentsRouter.post(
  '/',
  checkRoles(USER_ROLES.TEACHER),
  upload.single('photo'), // single file upload
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController),
);
// delete student -> Ogrenci sil
// ! Only Teacher
studentsRouter.delete(
  '/:studentId',
  checkRoles(USER_ROLES.TEACHER),
  isValidId,
  ctrlWrapper(deleteStudentController),
);
// upsert => update + instert
// Put & Patch ikiside edit ama put ile yeni bir ogrenci kaydida olusturabilirsin (upsert)
// ! Only Teacher
studentsRouter.put(
  '/:studentId',
  checkRoles(USER_ROLES.TEACHER),
  isValidId,
  ctrlWrapper(updatePutStudentController),
); // edit whole student object with put method
// update student -> Ogrenci guncelle
// ! Teacher + Parent
studentsRouter.patch(
  '/:studentId',
  isValidId,
  checkRoles(USER_ROLES.TEACHER, USER_ROLES.PARENT),
  validateBody(updateStudentSchema),
  ctrlWrapper(updatePatchStudentController),
); // edit only one field of student object with patch method

export default studentsRouter;
