import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

export const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) return next();

  const error = new AppError('Validation failed', 422);
  error.errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg
  }));
  next(error);
};
