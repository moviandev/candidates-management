const AppError = require('../utils/appError');

const handlingCastErrorDB = err => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 400);
};

const handlingValidationErrorsDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const msg = `${errors.join('. ')}`;
  return new AppError(msg, 400);
};

const handlingDuplicateErrorsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `Duplicate field ${value}. Please try again!`;
  return new AppError(msg, 400);
};

const handlingJWTErrors = () => {
  return new AppError('Your token is not valid. Please do login again', 401);
};

const handlingJWTExpErrors = () => {
  return new AppError('Your token has expired. Please do login again', 401);
};

const sendErrorToProduction = (err, res) => {
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  else {
    global.console.log('ERROR === ===> ', err);
    res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong'
    });
  }
};

const sendErrorToDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Error';

  if (process.env.NODE_ENV === 'development') sendErrorToDevelopment(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handlingCastErrorDB(error);
    if (error.name === 'ValidationError')
      error = handlingValidationErrorsDB(error);
    if (error.code === 11000) error = handlingDuplicateErrorsDB(error);
    if (error.name === 'JsonWebTokenError') error = handlingJWTErrors();
    if (error.name === 'TokenExpiredError') error = handlingJWTExpErrors();

    sendErrorToProduction(error, res);
  }
};
