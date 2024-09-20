const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

const createFolderGet = async (req, res) => {
  try {
    res.render('create-folder-form');
  } catch (error) {
    console.error('Error creating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

// Input validation middleware
const validateFolderName = [
  // Username validation
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Folder Name is required')
    .isLength({ max: 30 })
    .withMessage('Name cannot be longer than 30 characters'),
];

// POST login handler
const createFolderPost = [
  // validation middleware
  validateFolderName,

  // main route handler
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, render them
      return res.status(400).render('create-folder-form', {
        title: 'Create Folder',
        errors: errors.array(),
      });
    }

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
  },
];

const displayFoldersGet = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany();

    res.render('folders', { folders });
  } catch (error) {
    console.error('Error displaying folders', error);
    res.status(500).send('Internal Server Error');
  }
};

const folderContentsGet = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const folder = await prisma.folder.findUnique({
      where: {
        id: id,
      },
      include: {
        Files: true,
      },
    });

    res.render('folder-contents', { folder });
  } catch (error) {
    console.error('Error displaying folder contents', error);
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
    console.error('Error deleting folder', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  createFolderGet,
  createFolderPost,
  displayFoldersGet,
  folderContentsGet,
  updateFolderGet,
  updateFolderPost,
  deleteFolderGet,
};
