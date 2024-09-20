const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET route to render file upload form
const createFileGet = async (req, res) => {
  try {
    res.render('file-upload-form');
  } catch (error) {
    console.error('Error rendering file upload form', error);
    res.status(500).send('Internal Server Error');
  }
};

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
      // Check if the error is due to file size limit
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).render('file-upload-form', {
          errors: errors.array(),
        });
      }

      // Handle other Multer errors
      return res.status(400).render('file-upload-form', {
        errors: errors.array(),
      });
    }

    if (!req.file) {
      return res.status(400).render('file-upload-form', {
        errors: errors.array(),
      });
    }

    const { filename, size, path } = req.file;
    const folderId = parseInt(req.body.folderId, 10);

    try {
      const file = await prisma.file.create({
        data: {
          name: filename,
          size: size,
          path: path,
          folderId: isNaN(folderId) ? null : folderId,
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

const deleteFileGet = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });

    if (!file) {
      return res.status(404).send('File not found to be deleted');
    }

    await prisma.file.delete({
      where: {
        id: id,
      },
    });

    const filePath = file.path;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file from disk:', err);
        return res.status(500).send('Error deleting file from disk');
      }

      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Error deleting file', error);
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
