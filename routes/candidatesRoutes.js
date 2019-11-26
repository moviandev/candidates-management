const express = require('express');
const candidatesController = require('../controllers/candidatesController');

const router = express.Router();

router
  .route('/')
  .get(candidatesController.getAllCandidates)
  .post(candidatesController.createCandidates);

router
  .route('/:id')
  .get(candidatesController.getCandidateById)
  .patch(candidatesController.updateCandidate)
  .delete(candidatesController.deleteCandidate);

module.exports = router;
