// A catch-all for any routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// A centralized error handler
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come through with a 200 status code, so we override it
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Specific check for Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Specific check for Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }
  
  res.status(statusCode).json({
    message: message,
    // Include stack trace only in development mode for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };