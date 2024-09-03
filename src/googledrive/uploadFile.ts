import axios from 'axios';


const API_URL = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * Insert new file.
 * @return{obj} file Id
 * */
export async function uploadFile(file: File): Promise<string> {
  console.log('uploadBasic: uploading file');


  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  // const auth = new GoogleAuth({
  //   scopes: 'https://www.googleapis.com/auth/drive'
  // });
  // const service = google.drive({ version: 'v3', auth });

  const fileName = 'mychat123';
  const fileData = 'this is a sample data';
  const contentType = 'text/plain'
  const media = {
    'name': fileName,
    'mimeType': contentType
  };

  const boundary = '<ANY RANDOM STRING>'
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

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
        'Content-Type': 'multipart/related; boundary=' + boundary + ''
      },
      'body': multipartRequestBody
    });
  console.log('response:', response);
  return response.data;
}
