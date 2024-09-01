import * as fs from 'fs';
import { google, GoogleApis } from 'googleapis';

/**
 * Insert new file.
 * @return{obj} file Id
 * */
async function uploadBasic(googleDriveService: GoogleApis.Drive): Promise<string> {
  console.log('in uploadBasic');
  const requestBody = {
    name: 'photo.jpg',
    fields: 'id'
  };


  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('img/pdf-doc-img.jpg')
  };
  try {
    const file = await googleDriveService.files.create({
      requestBody,
      media: media
    });
    console.log('File Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
export default uploadBasic;
