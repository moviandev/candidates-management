const express = require('express');
const userController = require('../controllers/usersController');
const auth = require('../controllers/authController');

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);

router.post('/logout', auth.logout);

router.post('/forgotPassword', auth.forgotPassword);
router.patch('/resetPassword/:token', auth.resetPassword);

router.patch('/updateMyPassword', auth.protect, auth.updateMyPassword);
router.patch('/updateMe', auth.protect, userController.updateMe);

router.patch('/deleteMe', auth.protect, userController.deleteMe);

router
  .route('/')
  .get(auth.protect, auth.restrictedTo('admin'), userController.getAllUsers)
  .post(auth.protect, auth.restrictedTo('admin'), userController.createUser);

router
  .route('/:id')
  .get(auth.protect, auth.restrictedTo('admin'), userController.getUser)
  .patch(auth.protect, auth.restrictedTo('admin'), userController.updateUser)
  .delete(auth.protect, auth.restrictedTo('admin'), userController.deleteUser);

module.exports = router;
