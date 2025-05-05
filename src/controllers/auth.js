import {
  loginOrRegisterWithGoogle,
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  requestResetEmnail,
  resetPassword,
} from '../services/auth.js';
import { generateGoogleAuthUrl } from '../utils/googleOAuth.js';

export const registerUserController = async (req, res) => {
  const userData = req.body;

  const newUser = await registerUser(userData);

  res.status(201).send({
    message: 'User registered successfully',
    status: 201,
    user: newUser,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    message: 'User logged in successfully and session created',
    status: 200,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;

  await logoutUser(sessionId);

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(200).send({
    message: 'User logged out successfully',
    status: 200,
  });
};

export const refreshUserController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await refreshUser({ refreshToken, sessionId });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    message: 'User refresh flow successfully completed',
    status: 200,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;
  const result = await requestResetEmnail(email);
  console.log('RESULT:', result);
  if (result) {
    res.status(200).send({
      message: 'Reset email sent successfully',
      status: 200,
    });
  } else {
    res.status(500).send({
      message: 'Error sending reset email',
      status: 500,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  const result = await resetPassword(token, password);

  if (result) {
    res.status(200).send({
      message: 'Password reset successfully',
      status: 200,
    });
  } else {
    res.status(500).send({
      message: 'Error resetting password',
      status: 500,
    });
  }
};

export const getGoogleAuthUrlController = async (req, res) => {
  const url = await generateGoogleAuthUrl();

  return res.status(200).send({
    message: 'Google auth url generated successfully',
    status: 200,
    data: {
      url,
    },
  });
};

export const googleAuthController = async (req, res) => {
  const { code } = req.query;

  const session = await loginOrRegisterWithGoogle(code);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    message: 'Usder logged in successfully and session created with Google',
    status: 200,
    data: {
      accessToken: session.accessToken,
    },
  });
};
