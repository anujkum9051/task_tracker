export const notFound = (req, _res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== 'test') {
    console.error(error);
  }

  res.status(statusCode).json({
    message: error.message || 'Server error',
    errors: error.errors,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
};
