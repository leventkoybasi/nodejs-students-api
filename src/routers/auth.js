import { Router } from 'express';
import { validateBody } from '../middlewares/validatorBody.js';
import { createUserSchema, loginUserSchema } from '../validators/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
} from '../controllers/auth.js';

const authRouter = Router();

// Starts with '/auth' endpoint

authRouter.post(
  '/register',
  validateBody(createUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));
export default authRouter;
