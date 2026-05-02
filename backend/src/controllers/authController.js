import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { generateToken } from '../utils/generateToken.js';

const authResponse = (user) => ({
  token: generateToken(user),
  user
});

export const register = async (req, res) => {
  const { name, email, password, role = 'member' } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({ name, email, password, role });
  res.status(201).json(authResponse(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json(authResponse(user));
};
