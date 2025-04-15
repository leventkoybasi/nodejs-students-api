import { SORT_ORDER } from '../constants/index.js';
import { StudentsCollection } from '../db/models/student.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const studentQuery = StudentsCollection.find();

  if (filter.maxAge) {
    studentQuery.where('age').lte(filter.maxAge); // lte <=
  }
  if (filter.minAge) {
    studentQuery.where('age').gte(filter.minAge); // gte >=
  }
  if (filter.maxAvgMark) {
    studentQuery.where('avgMark').lte(filter.maxAvgMark); // lte <=
  }
  if (filter.minAvgMark) {
    studentQuery.where('avgMark').gte(filter.minAvgMark); // gte >=
  }
  if (filter.gender) {
    (await studentQuery.where('gender')).in(filter.gender); // in
  }

  const totalCount = await StudentsCollection.find()
    .merge(studentQuery)
    .countDocuments(); // toplam kayit sayisini al

  const students = await studentQuery
    .skip((page - 1) * perPage) // page=1 ise skip degeri 0'dan baslar. perPage=10 oldugundan 0 ile 9 arasinda gosterir
    .limit(perPage)
    .sort({ [sortBy]: sortOrder }) // sort({name: "asc"}) gibi
    .exec(); // exec() ile veritabanina sorgu gonderiyoruz

  // const students = await StudentsCollection.find(); //pagination olmadan
  const pagination = calculatePaginationData(totalCount, page, perPage);
  return {
    data: students,
    pagination,
  };
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
