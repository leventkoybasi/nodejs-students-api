/* eslint-disable no-unused-vars */
import { getAllStudents, getStudentById } from '../services/students.js';

export const getStudentsController = async (req, res) => {
  const students = await getAllStudents();

  res.status(200).json({
    data: students,
  });
};

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    return res.status(404).send({
      message: 'Student not found',
      status: 404,
    });
  }

  res.status(200).send({
    message: 'Student found successfully',
    status: 200,
    data: student,
  });
};
