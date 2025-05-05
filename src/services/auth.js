import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { FIFTEEN_MINUITES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/sessions.js';
import { sendMail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs/promises';
import handlebars from 'handlebars';
import { validateCode } from '../utils/googleOAuth.js';

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

export const logoutUser = async (sessionId) => {
  await SessionsCollection.findByIdAndDelete(sessionId);
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(404, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  // Eski oturumu sil
  await SessionsCollection.findByIdAndDelete(sessionId);

  // Yeni tokenlar oluştur
  const accessTokenNew = randomBytes(30).toString('base64');
  const refreshTokenNew = randomBytes(30).toString('base64');
  const accessTokenValidUntilNew = new Date(Date.now() + FIFTEEN_MINUITES); // 15 minutes
  const refreshTokenValidUntilNew = new Date(Date.now() + ONE_DAY); // 7 days

  // Yeni oturumu oluştur
  const sessionNew = await SessionsCollection.create({
    userId: session.userId,
    accessToken: accessTokenNew,
    refreshToken: refreshTokenNew,
    accessTokenValidUntil: accessTokenValidUntilNew,
    refreshTokenValidUntil: refreshTokenValidUntilNew,
  });

  return sessionNew;
};

export const requestResetEmnail = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  //TOKEN OLUSTURMA
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  // eslint-disable-next-line no-undef
  const TEMPLATE_DIR = path.join(process.cwd(), 'src', 'templates');
  const templatePath = path.join(TEMPLATE_DIR, 'reset-password-mail.html');
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const temmplate = handlebars.compile(templateContent.toString());
  const appDomain = env('APP_DOMAIN');
  const htmlContent = temmplate({
    name: user.name,
    url: `${appDomain}/auth/reset-password?token=${resetToken}`,
  });

  //EMAIL GONDERME
  await sendMail({
    from: env('SMTP_FROM'),
    to: user.email,
    subject: 'Sifre Sifirlama Maili',
    html: htmlContent,
  });
  return true;
};

export const resetPassword = async (token, newPassword) => {
  const jwtSecret = env('JWT_SECRET');

  const decodedToken = jwt.verify(token, jwtSecret);

  if (!decodedToken) {
    throw createHttpError(401, 'Invalid token');
  }

  const userId = decodedToken.sub;
  const userEmail = decodedToken.email;

  const user = await UsersCollection.findOne({ _id: userId, email: userEmail });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UsersCollection.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  return true;
};

export const loginOrRegisterWithGoogle = async (code) => {
  const userFromGoogle = await validateCode(code);

  let user = await UsersCollection.findOne({
    email: userFromGoogle.email,
  });

  if (!user) {
    user = await UsersCollection.create({
      name: userFromGoogle.name,
      email: userFromGoogle.email,
      password: randomBytes(30).toString('base64'),
    });
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
