/* eslint-disable no-undef */
import path from 'path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const STUDENT_SORTABLE_FIELDS = [
  '_id',
  'name',
  'age',
  'gender',
  'avgMark',
  'onDuty',
  'createdAt',
  'updatedAt',
];

export const FIFTEEN_MINUITES = 15 * 60 * 1000; // for access token
export const ONE_DAY = 24 * 60 * 60 * 1000; // for refresh token

export const USER_ROLES = {
  TEACHER: 'teacher',
  PARENT: 'parent',
};

export const TEMP_FOLDER = path.join(process.cwd(), 'temp');
export const UPLOAD_FOLDER = path.join(process.cwd(), 'uploads');
