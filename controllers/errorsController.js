const AppError = require('../utils/appError');

const handlingCastErrorDB = err => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 404);
};

const sendErrorToProduction = (err, res) => {
  if (err.isOperational === true)
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

const sendErrorToDevelopement = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Error';

  if (process.env.NODE_ENV === 'development') sendErrorToDevelopement(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handlingCastErrorDB(error);
    sendErrorToProduction(error, res);
  }
};