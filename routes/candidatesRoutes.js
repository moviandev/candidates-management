const express = require('express');
const auth = require('../controllers/authController');
const candidatesController = require('../controllers/candidatesController');

const router = express.Router();

router.use(auth.protect);
router.use(auth.restrictedTo('admin', 'recruiter'));

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
