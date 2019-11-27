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
