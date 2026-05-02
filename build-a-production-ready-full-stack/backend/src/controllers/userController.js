import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const getUsers = async (_req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
};

export const inviteUser = async (req, res) => {
  const { name, email, role = 'member' } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('A user with this email already exists', 409);
  }

  const temporaryPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const user = await User.create({ name, email, role, password: temporaryPassword });

  res.status(201).json({
    user,
    temporaryPassword,
    message: 'User created. Share this temporary password securely.'
  });
};
