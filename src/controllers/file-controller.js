const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const app = express();

// Middleware to serve static files from 'public/' directory
app.use(express.static(path.join(__dirname, 'public')));

// GET route to render the file upload form
const createFileGet = async (req, res) => {
  try {
    res.render('file-upload-form'); // Ensure this view exists
  } catch (error) {
    console.error('Error rendering file upload form', error);
    res.status(500).send('Internal Server Error');
  }
};

// keep files in the public directory
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

//multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname) // Unique file name
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).single('file-input');

// POST route to handle file upload
const createFilePost = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      // Handle multer errors
      return res.status(400).send('File upload failed: ' + err.message);
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { originalname, size, path } = req.file;

    try {
      // Save file details to the database using Prisma
      const file = await prisma.file.create({
        data: {
          name: originalname,
          size: size,
          path: path,
        },
      });

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error creating file entry', error);
      res.status(500).send('Internal Server Error');
    }
  });
};
const displayFilesGet = async (req, res) => {
  try {
    const files = await prisma.file.findMany();

    res.render('files', { files });
  } catch (error) {
    console.error('Error displaying files', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateFileGet = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });

    res.render('update-file-form', { file });
  } catch (error) {
    console.error('Error updating folder', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateFilePost = async (req, res) => {
  try {
    const id = parseInt(req.body.id, 10);
    const { name } = req.body;

    const updateFile = await prisma.file.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating file', error);
    res.status(500).send('Internal Server Error');
  }
};

// const deleteFolderGet = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id, 10);

//     const folder = await prisma.folder.delete({
//       where: {
//         id: id,
//       },
//     });

//     res.redirect('/dashboard');
//   } catch (error) {
//     console.error('Error updating folder', error);
//     res.status(500).send('Internal Server Error');
//   }
// };

module.exports = {
  createFileGet,
  createFilePost,
  displayFilesGet,
  updateFileGet,
  updateFilePost,
};
