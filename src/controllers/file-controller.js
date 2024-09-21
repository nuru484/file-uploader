const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET route to render file upload form
const createFileGet = async (req, res) => {
  try {
    res.render('file-upload-form');
  } catch (error) {
    console.error('Error rendering file upload form', error);
    res.status(500).send('Internal Server Error');
  }
};

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'gif'],
    public_id: (req, file) => file.fieldname + '-' + Date.now(),
  },
});

// Multer upload middleware using Cloudinary storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('file-input');

// POST route to handle file upload
const createFilePost = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).send('File upload failed: ' + err.message);
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { filename, size, path } = req.file;
    const folderId = parseInt(req.body.folderId, 10);

    try {
      const file = await prisma.file.create({
        data: {
          name: req.file.originalname,
          size: size,
          path: path,
          folderId: isNaN(folderId) ? null : folderId,
        },
      });

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error saving file to the database', error);
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

// DELETE route to handle file deletion from Cloudinary and database
const deleteFileGet = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const file = await prisma.file.findUnique({
      where: { id: id },
    });

    if (!file) {
      return res.status(404).send('File not found');
    }

    cloudinary.uploader.destroy(file.path, async function (err, result) {
      if (err) {
        console.error('Error deleting file from Cloudinary:', err);
        return res.status(500).send('Error deleting file from Cloudinary');
      }

      await prisma.file.delete({
        where: { id: id },
      });

      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  createFileGet,
  createFilePost,
  displayFilesGet,
  updateFileGet,
  updateFilePost,
  deleteFileGet,
};
