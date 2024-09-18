const express = require('express');
const fileRouter = express.Router();
const controllers = require('../controllers/file-controller');

// Folder Routes and their handlers

// Create folders
fileRouter.get('/', controllers.createFileGet);
fileRouter.post('/', controllers.createFilePost);

// Read files
fileRouter.get('/display-files', controllers.displayFilesGet);

// Update files
fileRouter.get('/update-file/:id', controllers.updateFileGet);
fileRouter.post('/update-file/:id', controllers.updateFilePost);

// Delete files
fileRouter.get('/delete-file/:id', controllers.deleteFileGet);

module.exports = fileRouter;
