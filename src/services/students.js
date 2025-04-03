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

//update student

export const updateStudent = async (studentId, newFields, options = {}) => {
  const result = await StudentsCollection.findOneAndUpdate(
    {
      _id: studentId,
    },
    newFields,
    {
      new: true, // yeni olusturulan /updatelenen datayi bana return et
      includeResultMetadata: true,
      ...options, // options parametrelerini ekle
    },
  );
  if (result.value) {
    return {
      student: result.value,
      isNew: Boolean(result.lastErrorObject.upserted),
    };
  }
  return null;
};
