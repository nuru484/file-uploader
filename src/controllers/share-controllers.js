const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Helper function to generate a random token
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

// Generate and share folder link with expiration
const shareFolderGet = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send('Invalid folder ID');
  }

  const token = generateToken();
  const expirationTime = Date.now() + 2 * 60000;
  const expirationDate = new Date(expirationTime);
  const url = `https://file-uploader.koyeb.app/share-folder/${id}/?token=${token}`;

  try {
    await prisma.sharedFolder.create({
      data: {
        folderId: id,
        shareLink: url,
        expiry: expirationDate,
      },
    });

    res.render('share-link', { link: url });
  } catch (error) {
    console.error('Error displaying share folder link', error);
    res.status(500).send('Internal Server Error');
  }
};

const validateSharedLink = async (req, res, next) => {
  const token = req.query.token;
  const folderId = parseInt(req.params.id, 10);

  if (!token || isNaN(folderId)) {
    return res.status(400).send('Invalid request');
  }

  try {
    const sharedFolder = await prisma.sharedFolder.findFirst({
      where: {
        folderId: folderId,
        shareLink: {
          contains: token,
        },
      },
    });

    if (!sharedFolder) {
      return res.status(404).send('Shared link not found');
    }

    const currentTime = new Date();
    if (currentTime > sharedFolder.expiry) {
      return res.status(403).send('This shared link has expired');
    }

    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        Files: true,
      },
    });

    if (!folder) {
      return res.status(404).send('Folder not found');
    }

    req.folder = folder;

    next();
  } catch (error) {
    console.error('Error validating shared link', error);
    res.status(500).send('Internal Server Error');
  }
};

const renderSharedFolder = async (req, res) => {
  const { folder } = req;
  console.log(folder);
  res.render('shared-folder', { folder });
};

// Generate and share file link with expiration
const shareFileGet = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send('Invalid file ID');
  }

  const token = generateToken();
  const expirationTime = Date.now() + 2 * 60000;
  const expirationDate = new Date(expirationTime);
  // const url = `https://file-uploader.koyeb.app/share-folder/${id}/?token=${token}`;
  const url = `http://localhost:8080/share-folder/${id}/?token=${token}`;

  try {
    await prisma.sharedFolder.create({
      data: {
        folderId: id,
        shareLink: url,
        expiry: expirationDate,
      },
    });

    res.render('share-link', { link: url });
  } catch (error) {
    console.error('Error displaying share folder link', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { shareFolderGet, validateSharedLink, renderSharedFolder };
