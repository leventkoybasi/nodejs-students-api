import { registerUser } from '../services/auth';

export const registerUserController = async (req, res) => {
  const userData = req.body;

  const newUser = await registerUser(userData);

  res.status(201).send({
    message: 'User registered successfully',
    status: 201,
    user: newUser,
  });
};
