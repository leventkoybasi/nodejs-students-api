import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { FIFTEEN_MINUITES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/sessions.js';
import { sendMail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';

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

  await sendMail({
    from: env('SMTP_FROM'),
    to: 'leventkoybasi@hotmail.com',
    subject: 'Password Reset Request - NodeJS Auth',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6e6e6; border-radius: 5px;">
      <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. You can reset it by clicking the button below:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000/auth/request-reset-password?token=${user._id}"
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Reset Password
        </a>
      </div>

      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <hr style="border: 0; border-top: 1px solid #e6e6e6; margin: 20px 0;">
      <p style="color: #777; font-size: 12px; text-align: center;">
        If you have any questions, feel free to contact us.<br>
        Best regards,<br>
        The NodeJS Auth Team
      </p>
    </div>
    `,
  });
  return true;
};
