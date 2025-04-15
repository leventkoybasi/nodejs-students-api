import createHttpError from 'http-errors';
import {
  createStudent,
  deleteStudentById,
  getAllStudents,
  getStudentById,
  updateStudent,
} from '../services/students.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

//get students
export const getStudentsController = async (req, res) => {
  const queryParams = req.query;
  const { page, perPage } = parsePaginationParams(queryParams);
  const { sortBy, sortOrder } = parseSortParams(queryParams);
  const filter = parseFilterParams(queryParams);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter, //default bos array alsin
  });
  // const students = await getAllStudents(); //pagination olmadan

  res.status(200).json({
    message: 'Students fetched successfully',
    status: 200,
    data: students,
  });
};

export const getStudentByIdController = async (req, res) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    // return res.status(404).send({
    //   message: 'Student not found',
    //   status: 404,
    // });

    throw createHttpError(404, 'Student not found '); // This will be caught by the error handler middleware
  }

  res.status(200).send({
    message: 'Student found successfully',
    status: 200,
    data: student,
  });
};

//create student post endpoint
export const createStudentController = async (req, res) => {
  const newStudent = req.body;
  const createdStudent = await createStudent(newStudent);

  res.status(201).send({
    message: 'Student created successfully',
    status: 201,
    // data: req.body, //new student request'in body'sinde...
    data: createdStudent, //created student'ı döndürdük
  });
};

//delete student
export const deleteStudentController = async (req, res) => {
  const { studentId } = req.params;
  const student = await deleteStudentById(studentId);

  if (!student) {
    throw createHttpError(404, 'Student not found ');
  }

  res.status(200).send({
    message: 'Student deleted successfully',
    status: 200,
    data: student,
  });
};

//update student Put
export const updatePutStudentController = async (req, res) => {
  const { studentId } = req.params;
  const newFields = req.body;

  const updatedStudent = await updateStudent(studentId, newFields, {
    upsert: true,
  });

  if (!updatedStudent) {
    throw createHttpError(404, 'Student not found ');
  }

  const status = updatedStudent.isNew ? 201 : 200;
  const message = updatedStudent.isNew
    ? 'Student created successfully'
    : 'Student updated successfully';

  res.status(status).send({
    message: message,
    status: status,
    data: updatedStudent.student,
  });
};

//update student Patch
export const updatePatchStudentController = async (req, res) => {
  const { studentId } = req.params;
  const newFields = req.body;

  const updatedStudent = await updateStudent(studentId, newFields, {
    upsert: false,
  });

  if (!updatedStudent) {
    throw createHttpError(404, 'Student not found ');
  }

  res.status(200).send({
    message: 'Student updated successfully',
    status: 200,
    data: updatedStudent.student,
  });
};
