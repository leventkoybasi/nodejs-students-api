import createHttpError from 'http-errors';
import { getAllStudents, getStudentById } from '../services/students.js';

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
