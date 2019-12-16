const Candidate = require('../models/candidatesModel');
// const catchAsync = require('../utils/catchAsync');
// const APIFeats = require('../utils/APIFeats');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllCandidates = factory.getAll(Candidate);

exports.createCandidates = factory.createOne(Candidate);

exports.getCandidateById = factory.getOne(Candidate);

exports.updateCandidate = factory.updateOne(Candidate);

exports.deleteCandidate = factory.deleteOne(Candidate);
