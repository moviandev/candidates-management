const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    data: [user]
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    results: user.length,
    data: [user]
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    message: 'Route not implemented'
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    message: 'Route not implemented'
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    message: 'Route not implemented'
  });
});
