const Candidate = require('../models/candidatesModel');
const factory = require('./handlerFactory');

exports.userId = (req, res, next) => {
  if (req.user.id) req.body.createdBy = req.user.id;
  next();
};

exports.getAllCandidates = factory.getAll(Candidate);

exports.createCandidates = factory.createOne(Candidate);

exports.getCandidateById = factory.getOne(Candidate);

exports.updateCandidate = factory.updateOne(Candidate);

exports.deleteCandidate = factory.deleteOne(Candidate);
