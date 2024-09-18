const express = require('express');
const dashboardRouter = express.Router();
const controllers = require('../controllers/dashboard-controllers');

// Dashboard route and it's handler
dashboardRouter.get('/', controllers.dashboardGet);

module.exports = dashboardRouter;
