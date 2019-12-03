const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const sign = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  });
};

const createSendToken = (status, statusCode, user, res) => {
  const token = sign(user._id);

  res.status(statusCode).json({
    status: status,
    token,
    data: user
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  // Creating user
  const user = await User.create({
    name,
    email,
    password,
    confirmPassword
  });

  createSendToken('created', 201, user, res);
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
  createSendToken('success', 200, user, res);
});

exports.logout = (req, res, next) => {
  req.headers.authorization = null;

  res.status(200).json({
    status: 'Logged out',
    message: 'You are not logged in'
  });
};

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

  req.user = user;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('User does not have permissions enough', 403));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user by its email and check it exits
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError('Email does not exist', 404));

  // 2) Generate the random token
  const reset = user.resetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${reset}`;
  const message = `Did you forget your password? No worries, in this URL ${resetUrl} you can change your password.\nIf you didn't forget it, please ignore this email`;

  // 3) send email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Forgotten password, your token expires in 10 minutes',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Your password has been sent to you'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save({
      validateBeforeSave: false
    });

    return next(
      new AppError(`There was an error sending email. Please try again!`, 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: { $gt: Date.now() }
  });

  if (!user) return next(new AppError('Token invalid or expired', 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;

  user.save();

  const token = sign(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});
