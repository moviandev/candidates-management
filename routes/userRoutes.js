const express = require('express');
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes that don't need to be logged in

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Routes that need to be logged in

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.get('/me', userController.getMe, userController.getUser);

// Routes Restricted to admins

router.use(authController.restrictedTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
