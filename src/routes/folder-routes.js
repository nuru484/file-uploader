const express = require('express');
const folderRouter = express.Router();
const controllers = require('../controllers/folder-controllers');

// Folder Routes and their handlers

// Create folders
folderRouter.get('/', controllers.createFolderGet);
folderRouter.post('/', controllers.createFolderPost);

// Read folders
folderRouter.get('/display-folders', controllers.displayFoldersGet);
folderRouter.get('/folder-contents/:id', controllers.folderContentsGet);

// Update Folders
folderRouter.get('/update-folder/:id', controllers.updateFolderGet);
folderRouter.post('/update-folder/:id', controllers.updateFolderPost);

// Delete Folders
folderRouter.get('/delete-folder/:id', controllers.deleteFolderGet);

module.exports = folderRouter;
