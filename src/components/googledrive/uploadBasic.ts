// import { initClient } from './gapi/gapi';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import fs from 'fs'

/**
 * Insert new file.
 * @return{obj} file Id
 * */
async function uploadBasic(file: File): Promise<string> {
  console.log('uploadBasic: uploading file');
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive'
  });
  const service = google.drive({ version: 'v3', auth });

  const fileName='mychat123';
  const fileData='this is a sample data';
  const contentType='text/plain'
  const media = {
      'name': fileName,
      'mimeType': contentType
  };

  const boundary='<ANY RANDOM STRING>'
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const multipartRequestBody =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(media) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n\r\n' +
          fileData+'\r\n'+
          close_delim;

          var request = gapi.client.request({
            'path': 'https://www.googleapis.com/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/related; boundary=' + boundary + ''
            },
            'body': multipartRequestBody});
  request.execute(callback);


}
