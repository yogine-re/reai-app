// see https://cloud.google.com/docs/authentication/api-keys#gcloud
import axios from 'axios';

const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM'

// see https://stackoverflow.com/questions/46160511/how-to-upload-files-to-google-drive-using-gapi-and-resumable-uploads
// in that article it points to https://github.com/googleworkspace/drive-utils
export async function uploadHelloWorld(gapi: any, token: string) {
  console.log('uploadHelloWorld: uploading file');
  const file = new File(['Hello, world!'], 'hello world.txt', { type: 'text/plain;charset=utf-8' });
  const contentType = file.type || 'application/octet-stream';
  const user = gapi.auth2.getAuthInstance()?.currentUser?.get();
  const access_token = user?.getAuthResponse()?.access_token || token;
  const initResumable = new XMLHttpRequest();
  initResumable.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', true);
  initResumable.setRequestHeader('Authorization', 'Bearer ' + access_token);
  initResumable.setRequestHeader('Content-Type', 'application/json');
  initResumable.setRequestHeader('X-Upload-Content-Length', file.size.toString());
  initResumable.setRequestHeader('X-Upload-Content-Type', contentType);
  initResumable.onreadystatechange = function() {
    if(initResumable.readyState === XMLHttpRequest.DONE && initResumable.status === 200) {
      const locationUrl = initResumable.getResponseHeader('Location');
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('uploadHelloWorld: reader.onload e:', e);
        const uploadResumable = new XMLHttpRequest();
        uploadResumable.open('PUT', locationUrl!, true);
        uploadResumable.setRequestHeader('Content-Type', contentType);
        uploadResumable.setRequestHeader('X-Upload-Content-Type', contentType);
        uploadResumable.onreadystatechange = function() {
          if(uploadResumable.readyState === XMLHttpRequest.DONE && uploadResumable.status === 200) {
            console.log(uploadResumable.response);
           }
        };
        uploadResumable.send(reader.result);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  
  // You need to stringify the request body containing any file metadata
  
  initResumable.send(JSON.stringify({
    'name': file.name,
    'mimeType': contentType,
    'Content-Type': contentType,
    'Content-Length': file.size
  }));
  }

/**
 * Insert new file.
 * @return{obj} file Id
 * */
export async function uploadFile(file: File, token: string): Promise<void> {
  console.log('uploadBasic: uploading file' + file.name);
  console.log('uploadFile: first listing files');
  driveListFilesAxios(token);
  // console.log('now upload file, file name: ' + file.name);
  // // const fileName = file.name;
  // // const fileData = 'this is a sample data';
  // // const contentType = 'text/plain'
  // // const media = {
  // //   'name': fileName,
  // //   'mimeType': contentType
  // // };

  // // const boundary = '<ANY RANDOM STRING>'
  // // const delimiter = '\r\n--' + boundary + '\r\n';
  // // const close_delim = '\r\n--' + boundary + '--';

  // // const multipartRequestBody =
  // //   delimiter +
  // //   'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
  // //   JSON.stringify(media) +
  // //   delimiter +
  // //   'Content-Type: ' + contentType + '\r\n\r\n' +
  // //   fileData + '\r\n' +
  // //   close_delim;

  // // const response = await axios.post(
  // //   API_URL,
  // //   {
  // //     'method': 'POST',
  // //     'params': { 'uploadType': 'multipart' },
  // //     'headers': {
  // //       'Authorization': 'Bearer ' + token,
  // //       'Content-Type': String('multipart/related; boundary=' + boundary)
  // //     },
  // //     'body': multipartRequestBody
  // //   });
  // // console.log('response:', response);
  // return response.data;
}

async function driveListFilesAxios(access_token: string) {  
  console.log('driveListFilesAxios: access_token:', access_token);
  // Search all files and folders by date
  const dateFilter = new Date('January 01, 2022').toISOString();

  // see https://stackoverflow.com/questions/71123422/how-to-set-api-request-to-google-drive-api-using-axios
  // 1. Search all files and folders by date
  console.log('driveListFilesAxios: searching files by date');
  const filesFilteredByDate = await axios.get('https://www.googleapis.com/drive/v3/files', {
    params: {
     q: `createdTime >= '${dateFilter}' or modifiedTime >= '${dateFilter}'`,
     fields: 'files(id,name,modifiedTime,createdTime,mimeType,size)',
     spaces: 'drive',
    },
    headers: {
      authorization: `Bearer ${access_token}`
    }
  });
  console.log('done with driveListFilesAxios: searching files by date');


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
    // headers: {
    //   authorization: `Bearer ${access_token}`,
    // }
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
