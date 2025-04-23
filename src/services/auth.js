import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { FIFTEEN_MINUITES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/sessions.js';

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

  await SessionsCollection.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUITES); // 15 minutes
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY); // 7 days

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};
