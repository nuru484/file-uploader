const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

// Create a folder
// Display a folder
// Update folder name
// Delete a folder
// Share a folder

const createFolderGet = async (req, res) => {
  try {
    res.render('create-folder-form');
  } catch (error) {
    console.error('Error creating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

const createFolderPost = async (req, res) => {
  try {
    console.log(req.body.name);
    await prisma.folder.create({
      data: {
        name: req.body.name,
      },
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error creating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createFolderGet, createFolderPost };
