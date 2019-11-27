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

  console.log(user._id);

  const token = sign(user._id);

  console.log(token);

  res.status(201).json({
    status: 'created',
    token,
    data: user
  });
});
