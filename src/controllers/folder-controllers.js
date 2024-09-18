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
    const folder = await prisma.folder.create({
      data: {
        name: req.body.name,
      },
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error creating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

const displayFoldersGet = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany();
    if (!folders) {
      return res.status(404).send('Folders not found');
    }
    res.render('folders', { folders });
  } catch (error) {
    console.error('Error displaying folders', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateFolderGet = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const folder = await prisma.folder.findUnique({
      where: {
        id: id,
      },
    });

    if (!folder) {
      return res.status(404).send('Folder not found');
    }

    res.render('update-folder-form', { folder });
  } catch (error) {
    console.error('Error updating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateFolderPost = async (req, res) => {
  try {
    const id = parseInt(req.body.id, 10);
    const { name } = req.body;

    const updateFolder = await prisma.folder.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteFolderGet = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const folder = await prisma.folder.delete({
      where: {
        id: id,
      },
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  createFolderGet,
  createFolderPost,
  displayFoldersGet,
  updateFolderGet,
  updateFolderPost,
  deleteFolderGet,
};
