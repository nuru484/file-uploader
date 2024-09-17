const express = require('express');
const signUpRouter = express.Router();
const controllers = require('../controllers/sign-up-controllers');

// Sign Up Routes and their handlers
signUpRouter.get('/', controllers.signUpGet);
signUpRouter.post('/', controllers.signUpPost);

module.exports = signUpRouter;
