const Candidate = require('../models/candidatesModel');
const catchAsync = require('../utils/catchAsync');
const APIFeats = require('../utils/APIFeats');

exports.getAllCandidates = catchAsync(async (req, res, next) => {
  // Executing query
  const feats = new APIFeats(Candidate.find(), req.query).sort();

  const candidate = await feats.query;

  res.status(200).json({
    status: 'success',
    results: candidate.length,
    data: { candidate }
  });
});

exports.createCandidates = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.create(
    req.body.name,
    req.body.phone,
    req.body.mobile,
    req.body.tech,
    req.body.obs,
    req.body.lastSalary,
    req.body.benefits
  );

  res.status(201).json({
    status: 'created',
    data: { candidate }
  });
});

exports.getCandidateById = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

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

  res.status(200).json({
    status: 'up-to-date',
    data: { candidate }
  });
});

exports.deleteCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'deleted',
    message: 'Candidate has been deleted'
  });
});
