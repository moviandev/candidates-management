const Candidate = require('../models/candidatesModel');
const catchAsync = require('../utils/catchAsync');
const APIFeats = require('../utils/APIFeats');
const AppError = require('../utils/appError');

exports.getAllCandidates = catchAsync(async (req, res, next) => {
  // Executing query
  const feats = new APIFeats(Candidate.find(), req.query).sort().pagination(0);

  const candidate = await feats.query;

  if (candidate.length === 0)
    return next(new AppError('There is no candidate found', 404));

  res.status(200).json({
    status: 'success',
    results: candidate.length,
    data: { candidate }
  });
});

exports.createCandidates = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.create(req.body);

  res.status(201).json({
    status: 'created',
    data: { candidate }
  });
});

exports.getCandidateById = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate)
    return next(new AppError(`Candidate not found, try again`, 404));

  res.status(200).json({
    status: 'success',
    data: { candidate }
  });
});

exports.updateCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!candidate)
    return next(new AppError('Candidate not found, please try again', 404));

  res.status(200).json({
    status: 'up-to-date',
    data: { candidate }
  });
});

exports.deleteCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);

  if (!candidate)
    return next(new AppError('Candidate not found, please try again', 404));

  res.status(204).json({
    status: 'deleted',
    message: 'Candidate has been deleted'
  });
});
