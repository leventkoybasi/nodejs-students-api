import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (userData) => {
  const { email, password } = userData;
  const user = await UsersCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'User already exists');
  }

  const hasedPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({
    ...userData,
    password: hasedPassword,
  });
};

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid password');
  }
  return user;
};
