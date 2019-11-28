const express = require('express');
const auth = require('../controllers/authController');
const candidatesController = require('../controllers/candidatesController');

const router = express.Router();

router
  .route('/')
  .get(
    auth.protect,
    auth.restrictedTo('admin', 'recruiter'),
    candidatesController.getAllCandidates
  )
  .post(
    auth.protect,
    auth.restrictedTo('admin', 'recruiter'),
    candidatesController.createCandidates
  );

router
  .route('/:id')
  .get(
    auth.protect,
    auth.restrictedTo('admin', 'recruiter'),
    candidatesController.getCandidateById
  )
  .patch(
    auth.protect,
    auth.restrictedTo('admin', 'recruiter'),
    candidatesController.updateCandidate
  )
  .delete(
    auth.protect,
    auth.restrictedTo('admin', 'recruiter'),
    candidatesController.deleteCandidate
  );

module.exports = router;
