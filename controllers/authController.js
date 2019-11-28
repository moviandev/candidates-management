const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const sign = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  // Creating user
  const user = await User.create({ name, email, password, confirmPassword });

  const token = sign(user._id);

  res.status(201).json({
    status: 'created',
    token,
    data: user
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Desctruting req.body
  const { email, password } = req.body;

  // Checking if in the request exist an email and password
  if (!email || !password)
    return next(new AppError('To login is needed email and password', 401));

  // Searches to user by its email and password
  const user = await User.findOne({ email }).select('+password');

  // Checking if the email and password are correct
  if (!user || !(await user.checkingPasswords(password, user.password)))
    return next(
      new AppError(
        'Email or password invalid, please try again with valid data',
        401
      )
    );

  // Passing token
  const token = sign(user._id);

  res.status(200).json({
    status: 'logged',
    token,
    message: `Welcome ${user.name}`
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // CHecking if in the request have the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  // Checking if exist a token
  if (!token)
    return next(
      new AppError('You are not logged in. Please log in and try again', 401)
    );

  // Verifing the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // checking if the user exists
  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError(
        'The user belonging to this token does not exist anymore',
        401
      )
    );

  // Checking if user has changed its password before generating token
  if (user.checkingWhenThePasswordsChanged(decoded.iat))
    return next(
      new AppError(
        'Current user has changed password after the token was generated. Please do login again',
        401
      )
    );

  res.user = user;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('User does not have permissions enough', 403));
    next();
  };
};
