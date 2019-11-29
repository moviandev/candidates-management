const express = require('express');
const userController = require('../controllers/usersController');
const auth = require('../controllers/authController');

const Router = express.Router();

Router.post('/signup', auth.signup);
Router.post('/login', auth.login);

Router.post('/logout', auth.logout);

Router.route('/')
  .get(auth.protect, auth.restrictedTo('admin'), userController.getAllUsers)
  .post(auth.protect, auth.restrictedTo('admin'), userController.createUser);

Router.route('/:id')
  .get(auth.protect, auth.restrictedTo('admin'), userController.getUser)
  .patch(auth.protect, auth.restrictedTo('admin'), userController.updateUser)
  .delete(auth.protect, auth.restrictedTo('admin'), userController.deleteUser);

module.exports = Router;
