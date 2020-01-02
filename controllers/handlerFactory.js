const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeats = require('../utils/APIFeats');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'created',
      data: doc
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError('Document not found, please try again', 404));

    res.status(204).json({
      status: 'deleted',
      message: 'Document has been deleted'
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc)
      return next(new AppError('Candidate not found, please try again', 404));

    res.status(200).json({
      status: 'up-to-date',
      data: { candidate: doc }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // Executing query
    const feats = new APIFeats(Model.find(), req.query).sort().pagination(0);
    const doc = await feats.query;

    if (doc.length === 0)
      return next(new AppError('There is no documents found', 404));

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const candidate = await Model.findById(req.params.id);

    if (!candidate)
      return next(new AppError(`Document not found, try again`, 404));

    res.status(200).json({
      status: 'success',
      data: { candidate }
    });
  });
