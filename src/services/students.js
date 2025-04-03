import { StudentsCollection } from '../db/models/student.js';

export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students;
};

export const getStudentById = async (id) => {
  const student = await StudentsCollection.findById(id);
  return student;
};

export const createStudent = async (student) => {
  const newStudent = await StudentsCollection.create(student);
  return newStudent;
};

export const deleteStudentById = async (id) => {
  const student = await StudentsCollection.findByIdAndDelete(id); //best practise
  // const student = await StudentsCollection.findOneAndDelete({
  //   _id: id,
  //   // name: 'John Doe', //Burda baska filtrelerde kullanilir ilkini bulur ve siler id daha unique
  // });
  return student;
};
