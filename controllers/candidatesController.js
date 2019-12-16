const Candidate = require('../models/candidatesModel');
const factory = require('./handlerFactory');

exports.getAllCandidates = factory.getAll(Candidate);

exports.createCandidates = factory.createOne(Candidate);

exports.getCandidateById = factory.getOne(Candidate);

exports.updateCandidate = factory.updateOne(Candidate);

exports.deleteCandidate = factory.deleteOne(Candidate);
