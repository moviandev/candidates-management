const express = require('express');
const auth = require('../controllers/authController');

const Router = express.Router();

Router.post('/signup', auth.signup);
Router.post('/login', auth.login);

module.exports = Router;
