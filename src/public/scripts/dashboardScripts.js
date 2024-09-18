async function loadFolderContent() {
  try {
    const response = await fetch('/folder');
    const html = await response.text();
    document.getElementById('folder-content').innerHTML = html;
  } catch (error) {
    console.error('Error loading folder content:', error);
    document.getElementById('folder-content').innerHTML =
      'Error loading folder content';
  }
}

function removeFolderContent() {
  document.getElementById('folder-content').innerHTML = '';
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

async function loadFileContent() {
  try {
    const response = await fetch('/file');
    const html = await response.text();
    document.getElementById('file-content').innerHTML = html;
  } catch (error) {
    console.error('Error loading file content:', error);
    document.getElementById('file-content').innerHTML =
      'Error loading file content';
  }
}

function removeFileContent() {
  document.getElementById('file-content').innerHTML = '';
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

async function loadFolderContentUpdate(id) {
  try {
    const response = await fetch(`/folder/update-folder/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    document.getElementById('folder-content').innerHTML = html;
  } catch (error) {
    console.error('Error loading folder content:', error);
    document.getElementById('folder-content').innerHTML =
      'Error loading folder content';
  }
}

async function loadFileContentUpdate(id) {
  try {
    const response = await fetch(`/file/update-file/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    document.getElementById('file-content').innerHTML = html;
  } catch (error) {
    console.error('Error loading file content:', error);
    document.getElementById('file-content').innerHTML =
      'Error loading folder content';
  }
}
