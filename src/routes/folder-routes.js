const express = require('express');
const folderRouter = express.Router();
const controllers = require('../controllers/folder-controllers');

// Folder Routes and their handlers
folderRouter.get('/', controllers.createFolderGet);
folderRouter.post('/', controllers.createFolderPost);

module.exports = folderRouter;
