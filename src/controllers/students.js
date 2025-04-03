import createHttpError from 'http-errors';
import {
  createStudent,
  deleteStudentById,
  getAllStudents,
  getStudentById,
} from '../services/students.js';

//get students
export const getStudentsController = async (req, res) => {
  const students = await getAllStudents();

  res.status(200).json({
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
