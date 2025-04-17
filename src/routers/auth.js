import { Router } from 'express';
import { validateBody } from '../middlewares/validatorBody.js';
import { createUserSchema, loginUserSchema } from '../validators/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { loginUserController, registerUserController } from '../controllers/auth.js';

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
)
export default authRouter;
