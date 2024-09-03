// // see https://developers.google.com/drive/api/guides/manage-uploads

// import * as fs from'fs';
// // import GoogleAuth from 'google-auth-library';
// import { google } from 'googleapis'
// // import {  drive_v3 } from 'googleapis'
// // type DriveFile = drive_v3.Schema$File

// /**
//  * Insert new file.
//  * @return{obj} file Id
//  * */
// export async function uploadBasic(file: File): Promise<string | null | undefined> {
//   console.log('uploadBasic: uploading file');
//   // Get credentials and build service
//   // TODO (developer) - Use appropriate auth mechanism for your app
//   const auth = new google.auth.GoogleAuth({
//     // credentials: {credentials: {access_token: ''}}
//     keyFile: 'credentials.json',
//     scopes: 'https://www.googleapis.com/auth/drive'
//   }); 
//   const service = google.drive({ version: 'v3', auth });
//   const requestBody = {
//     name: file.name,
//     fields: 'id'
//   };
//   const media = {
//     mimeType: file.type,
//     body: fs.createReadStream(file.webkitRelativePath)
//   };
//   try {
//     const file = await service.files.create({
//       requestBody,
//       media: media
//     });
//     console.log('File Id:', file.data.id);
//     return file.data.id;
//   } catch (err) {
//     // TODO(developer) - Handle error
//     throw err;
//   }
// }
