import { Router } from 'express';
import { validateBody } from '../middlewares/validatorBody.js';
import { createUserSchema } from '../validators/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { registerUserController } from '../controllers/auth.js';

const authRouter = Router();

// Starts with '/auth' endpoint

authRouter.post(
  '/register',
  validateBody(createUserSchema),
  ctrlWrapper(registerUserController),
);
export default authRouter;
