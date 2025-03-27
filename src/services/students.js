import { StudentsCollection } from '../db/models/student.js';

export const getAllStudents = async () => {
  try {
    const students = await StudentsCollection.find();
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

export const getStudentById = async (id) => {
  try {
    const student = await StudentsCollection.findById(id);
    return student;
  } catch (error) {
    console.error('Error fetching student by ID:', error);
  }
};
