import UsersCollection from '../db/models/user.js';

export const registerUser = async (userData) => {
  return await UsersCollection.create(userData);
};
