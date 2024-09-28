const express = require('express');
const shareRouter = express.Router();
const controllers = require('../controllers/folder-share-controller');

shareRouter.get('/generate/:id', controllers.shareFolderGet);
shareRouter.get(
  '/:id',
  controllers.validateSharedFolderLink,
  controllers.renderSharedFolder
);

module.exports = shareRouter;
