import { model, Schema } from 'mongoose';
import { USER_ROLES } from '../../constants/index.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [USER_ROLES.TEACHER, USER_ROLES.PARENT],
      default: USER_ROLES.PARENT,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    versionKey: false, // Disable the __v field
  },
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // Remove sensitive information
  delete userObject.password;

  return userObject;
};

const UsersCollection = model('User', userSchema);

export default UsersCollection;
