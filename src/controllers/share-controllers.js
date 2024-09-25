const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const shareFolderGet = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: id,
      },
      include: {
        Files: true,
      },
    });

    console.log(folder);

    res.render('shared-folder', { folder });
  } catch (error) {
    console.error('Error displaying share folder link', error);
    res.status(500).send('Internal Server Error');
  }
};

const shareFolderPost = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const sharedFolder = await prisma.sharedFolder.create({
      data: {
        folderId: id,
        shareLink: `http://localhost:8080/share-folder/${id}`,
        expiry: new Date('2070-01-01'),
        created_at: new Date(),
      },
    });

    console.log('Shared Folder contents updated');

    // res.status(201).json(sharedFolder);
    res.status(201);
  } catch (error) {
    console.error('Error updating shared folder details', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { shareFolderGet, shareFolderPost };
