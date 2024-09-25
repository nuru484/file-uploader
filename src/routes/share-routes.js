const express = require('express');
const shareRouter = express.Router();
const controllers = require('../controllers/share-controllers');

shareRouter.get('/generate/:id', controllers.shareFolderGet);
shareRouter.get(
  '/:id',
  controllers.validateSharedLink,
  controllers.renderSharedFolder
);

module.exports = shareRouter;
