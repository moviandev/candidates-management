const Candidate = require('../models/candidatesModel');
const catchAsync = require('../utils/catchAsync');
const APIFeats = require('../utils/APIFeats');
const AppError = require('../utils/appError');
const factory = require('./handlerFactoring');

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

exports.createCandidates = factory.createOne(Candidate);

exports.getCandidateById = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate)
    return next(new AppError(`Candidate not found, try again`, 404));

  res.status(200).json({
    status: 'success',
    data: { candidate }
  });
});

exports.updateCandidate = factory.updateOne(Candidate);

exports.deleteCandidate = factory.deleteOne(Candidate);
