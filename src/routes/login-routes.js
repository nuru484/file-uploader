const express = require('express');
const loginRouter = express.Router();
const controllers = require('../controllers/login-controllers');

// Routes and their handlers
loginRouter.get('/', controllers.loginPageGet);
loginRouter.post('/', controllers.loginPagePost);

module.exports = loginRouter;
