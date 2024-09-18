const express = require('express');
const loginRouter = express.Router();
const controllers = require('../controllers/login-controllers');

// Login Routes and their handlers
loginRouter.get('/', controllers.loginPageGet);
loginRouter.post('/', controllers.loginPagePost);
loginRouter.get('/logout', controllers.logoutGet);

module.exports = loginRouter;
