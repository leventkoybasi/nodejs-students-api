/**
 * 1- req.user uzerinden kullaniciya eris
 * 2- Kullanici rolunu, beklenen rollerden biri mi degil mi diye kontrol et
 * -degilse 403
 * 3- Eger role parent ise
 * - parentId'yi kontrol et
 * - var olan parentId ile studentId  eslesiyor mu?
 */

import createHttpError from 'http-errors';
import { getStudentById } from '../services/students.js';
import { USER_ROLES } from '../constants/index.js';

export const checkRoles =
  (...allowedRoles) =>
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      next(createHttpError(401, 'User not found'));
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      next(createHttpError(403, 'You are not allowed to access this resource'));
      return;
    }
    if (user.role === USER_ROLES.PARENT) {
      const { studentId } = req.params;
      const student = await getStudentById(studentId);
      console.log('student', student);

      if (!student) {
        next(createHttpError(404, 'Student not found'));
        return;
      }
      if (student.parentId?.toString() !== user._id?.toString()) {
        next(
          createHttpError(
            403,
            'You are not allowed to access this student resource! Bu senin ogrencin degil...',
          ),
        );
        return;
      }
    }
    next();
  };
