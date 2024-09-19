async function loadFolderForm() {
  try {
    const response = await fetch('/folder');
    const html = await response.text();
    const folderForm = document.getElementById('folder-form');
    folderForm.innerHTML = html;
    folderForm.classList.remove('hidden');
  } catch (error) {
    console.error('Error loading folder form:', error);
    document.getElementById('folder-form').innerHTML =
      'Error loading folder form';
  }
}

function removeFolderForm() {
  const folderForm = document.getElementById('folder-form');
  folderForm.innerHTML = '';
  folderForm.classList.add('hidden');
}

(async function displayFolders() {
  try {
    const response = await fetch('/folder/display-folders');
    const html = await response.text();
    document.getElementById('folders').innerHTML = html;
  } catch (error) {
    console.error('Error displaying folders:', error);
    document.getElementById('folders').innerHTML = 'Error displaying folders';
  }
})();

async function loadFileForm() {
  try {
    const response = await fetch('/file');
    const html = await response.text();
    document.getElementById('file-form').innerHTML = html;

    function getFolderIdFromMainContainer() {
      const mainContainer = document.getElementById('main-container');
      if (!mainContainer) {
        console.error('Main container not found');
        return null;
      }

      const folderElement = mainContainer.querySelector('[data-folderId]');
      return folderElement ? folderElement.getAttribute('data-folderId') : null;
    }

    const folderId = getFolderIdFromMainContainer();

    if (folderId) {
      console.log(folderId);
      document.getElementById('folderId').value = folderId;
    } else {
      console.error('Folder ID not found or main container is missing');
    }
  } catch (error) {
    console.error('Error loading file form:', error);
    document.getElementById('file-form').innerHTML = 'Error loading file form';
  }
}

function removeFileForm() {
  document.getElementById('file-form').innerHTML = '';
}

(async function displayFiles() {
  try {
    const response = await fetch('/file/display-files');
    const html = await response.text();
    document.getElementById('files').innerHTML = html;
  } catch (error) {
    console.error('Error displaying files:', error);
    document.getElementById('files').innerHTML = 'Error displaying files';
  }
})();

async function loadFolderFormUpdate(id) {
  try {
    const response = await fetch(`/folder/update-folder/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    document.getElementById('folder-form').innerHTML = html;
    console.log('helloshioghdigh');
  } catch (error) {
    console.error('Error loading folder update form:', error);
    document.getElementById('folder-form').innerHTML =
      'Error loading folder form';
  }
}

function removeFolderUpdateForm() {
  const folderForm = document.getElementById('folder-form');
  folderForm.innerHTML = '';
  folderForm.classList.add('hidden');
  window.location.href = '/dashboard';
}

async function loadFileFormUpdate(id) {
  try {
    const response = await fetch(`/file/update-file/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    document.getElementById('file-form').innerHTML = html;
  } catch (error) {
    console.error('Error loading file form:', error);
    document.getElementById('file-form').innerHTML =
      'Error loading folder form';
  }
}

async function loadFolderContents(id) {
  try {
    const response = await fetch(`/folder/folder-contents/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    document.getElementById('main-container').innerHTML = html;
  } catch (error) {
    console.error('Error loading folder contents:', error);
    document.getElementById('main-container').innerHTML =
      'Error loading folder contents';
  }
}

const usernameIcon = document.querySelector('.username-icon');
const accountDetails = document.querySelector('.profile-detail');

function toggleAccountDetails() {
  if (accountDetails.style.display === 'block') {
    accountDetails.style.display = 'none';
    usernameIcon.style.display = 'block';
  } else {
    accountDetails.style.display = 'block';
    usernameIcon.style.display = 'none';
  }
}

function handleClickOutside(event) {
  if (
    !accountDetails.contains(event.target) &&
    !usernameIcon.contains(event.target)
  ) {
    accountDetails.style.display = 'none';
    usernameIcon.style.display = 'block';
  }
}

usernameIcon.addEventListener('click', function () {
  toggleAccountDetails();
});

document.addEventListener('click', handleClickOutside);
