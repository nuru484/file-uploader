const express = require('express');
const shareRouter = express.Router();
const controllers = require('../controllers/share-controllers');

shareRouter.get('/:id', controllers.shareFolderGet);
shareRouter.post('/:id', controllers.shareFolderPost);

module.exports = shareRouter;
