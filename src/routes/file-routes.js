const express = require('express');
const fileRouter = express.Router();
const controllers = require('../controllers/file-controller');

// Folder Routes and their handlers

// Create folders
fileRouter.get('/', controllers.createFileGet);
fileRouter.post('/', controllers.createFilePost);

// // Read folders
// folderRouter.get('/display-folders', controllers.displayFoldersGet);

// // Update Folders
// folderRouter.get('/update-folder/:id', controllers.updateFolderGet);
// folderRouter.post('/update-folder/:id', controllers.updateFolderPost);

// // Delete Folders
// folderRouter.get('/delete-folder/:id', controllers.deleteFolderGet);

module.exports = fileRouter;
