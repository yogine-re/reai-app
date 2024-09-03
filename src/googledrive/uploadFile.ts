// see https://cloud.google.com/docs/authentication/api-keys#gcloud
import axios from 'axios';

const API_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM'
/**
 * Insert new file.
 * @return{obj} file Id
 * */
export async function uploadFile(file: File, token: string): Promise<string> {
  console.log('uploadBasic: uploading file' + file.name);
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  // const auth = new GoogleAuth({
  //   scopes: 'https://www.googleapis.com/auth/drive'
  // });
  // const service = google.drive({ version: 'v3', auth });

  listFiles(token);
  const fileName = file.name;
  const fileData = 'this is a sample data';
  const contentType = 'text/plain'
  const media = {
    'name': fileName,
    'mimeType': contentType
  };

  const boundary = '<ANY RANDOM STRING>'
  const delimiter = '\r\n--' + boundary + '\r\n';
  const close_delim = '\r\n--' + boundary + '--';

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(media) +
    delimiter +
    'Content-Type: ' + contentType + '\r\n\r\n' +
    fileData + '\r\n' +
    close_delim;

  const response = await axios.post(
    API_URL,
    {
      'method': 'POST',
      'params': { 'uploadType': 'multipart' },
      'headers': {
        'Authorization': 'Bearer ' + token,
        'Content-Type': String('multipart/related; boundary=' + boundary)
      },
      'body': multipartRequestBody
    });
  console.log('response:', response);
  return response.data;
}

async function listFiles(access_token: string) {  
  // Search all files and folders by date
const dateFilter = new Date('January 01, 2022').toISOString();

// 1. Search all files and folders by date
const filesFilteredByDate = await axios.get('https://www.googleapis.com/drive/v3/files?key=' + API_KEY, {
    params: {
     q: `createdTime >= '${dateFilter}' or modifiedTime >= '${dateFilter}'`,
     fields: 'files(id,name,modifiedTime,createdTime,mimeType,size)',
     spaces: 'drive',
    },
    headers: {
      authorization: `Bearer ${access_token}`
    }
  });

// 2. Find a file by size
const sizeInBytes = 1024;
const filesFilteredBySize = filesFilteredByDate.data.files.filter((file: any) => Number(file.size || 0) >= sizeInBytes);

// 3. Find all empty folders
const emptyFoldersSearch = await axios.get('https://www.googleapis.com/drive/v3/files', {
    params: {
      q: `mimeType = 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
      spaces: 'drive',
      key: API_KEY,
    },
    headers: {
      authorization: `Bearer ${access_token}`,
    }
  });

const emptyFolders = [];

for await (const folder of emptyFoldersSearch.data.files) {
   const childrenResponse = await axios.get('https://www.googleapis.com/drive/v3/files', {
      params: {
        folderId: folder.id,
        spaces: 'drive',
        key: API_KEY,
      },
      headers: {
        authorization: `Bearer ${access_token}`
      }
    });

  if (!childrenResponse.data.files.length) {
    emptyFolders.push(folder);
  }
}

// 4. Find a file by type such as ppt, image, etc
const mimeType = 'image/jpeg';
const filesFilteredByType = await axios.get('https://www.googleapis.com/drive/v3/files', {
    params:{
      q: `mimeType:'${mimeType}'`,
      fields: 'files(id,name,mimeType,size)',
      spaces: 'drive',
      key: API_KEY,
    },
    headers: {
      authorization: `Bearer ${access_token}`
  }
});

console.log(`Found ${filesFilteredByDate.data.files.length} files/folders created or modified at ${dateFilter}`);
console.log(`Files larger than ${sizeInBytes} bytes:`, filesFilteredBySize);
console.log(`Found ${emptyFolders.length} empty folders`);
console.log(`Found ${filesFilteredByType.data.files.length} images of type ${mimeType}'`);

}
