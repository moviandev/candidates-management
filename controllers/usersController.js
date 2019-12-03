const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This path is not to update password, if you want to update it, go to the right path',
        400
      )
    );

  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user)
    return next(
      new AppError("You're not logged in. Please do log in and try again", 401)
    );

  res.status(200).json({
    status: 'success',
    data: user
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
