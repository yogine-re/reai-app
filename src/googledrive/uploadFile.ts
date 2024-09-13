// see https://cloud.google.com/docs/authentication/api-keys#gcloud
import MediaUploader from './MediaUploader';


// see https://stackoverflow.com/questions/46160511/how-to-upload-files-to-google-drive-using-gapi-and-resumable-uploads
// in that article it points to https://github.com/googleworkspace/drive-utils
export async function uploadHelloWorld(googleApi: any, token: string) {
  console.log('uploadHelloWorld: uploading file');
  console.log('uploadHelloWorld: token:', token);
  const file = new File(['Hello, world!'], 'hello world.txt', { type: 'text/plain;charset=utf-8' });
  const contentType = file.type || 'application/octet-stream';
  const access_token = token || googleApi.auth2.getAuthInstance()?.currentUser?.get()?.getAuthResponse()?.access_token;
  console.log('uploadHelloWorld: access_token:', access_token);
  var uploader = new MediaUploader({
    file: file,
    contentType: contentType,
    token: access_token,
  });
  uploader.upload();
  }

/**
 * Insert new file.
 * @return{obj} file Id
 * */
export async function uploadFile(googleApi: any, file: File, folderId: string, token: string): Promise<void> {
  console.log('uploadFile: uploading file' + file.name);
  const access_token = token || googleApi.auth2.getAuthInstance()?.currentUser?.get()?.getAuthResponse()?.access_token;
  console.log('MediaUploader: file:', file);

  const metadata = {
    title: file.name,
    parents: [
      {
        kind: 'drive#parentReference',
        id: folderId
      }
    ]
  }

  var uploader = new MediaUploader({
    file: file,
    contentType: file.type || 'application/octet-stream',
    token: access_token,
    metadata: metadata
  });
  uploader.upload();
}