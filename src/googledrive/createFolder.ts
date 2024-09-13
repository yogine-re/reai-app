
export async function createFolder(googleApi: any, folderName: string): Promise<string | undefined> {
     console.log('createFolder: creating folder:', folderName);
    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };
    
      try {
        const listResponse = await googleApi.client.drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and trashed=false and name='" + folderName + "'",
            spaces: 'drive',
            fields: 'nextPageToken, files(id, name)',
            }).then((response: { result: { files: { name: string; id: string; }[]; }; }) => {
            console.log('createFolder: response:', response);
            console.log('createFolder: response.result.files:', response.result.files);
            const folders = response.result.files;
            if (folders && folders.length > 0) {
                console.log('createFolder: folders:', folders);
                folders.forEach((folder) => {
                console.log(`Found folder: ${folder.name}, id: ${folder.id}`);
                });
            } else {
                console.log('No folders found.');
            }   
            return response;
        });
        console.log('createFolder: listResponse:', listResponse);

        if(listResponse.result.files.length == 0) {
            const response = await googleApi.client.drive.files.create({
                resource: fileMetadata,
                fields: 'id',
              });
              console.log('createFolder response:', response);
              console.log('Folder ID:', response.result.id);
              return response.result.id;
        }
        else {
            console.log('createFolder: folder already exists');
            console.log('createFolder: folder id:', listResponse.result.files[0].id);
            return listResponse.result.files[0].id;
        }
        
      } catch (error) {
        console.error('Error creating folder:', error);
      }
};


  // const initResumable = new XMLHttpRequest();
  // initResumable.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', true);
  // initResumable.setRequestHeader('Authorization', 'Bearer ' + access_token);
  // initResumable.setRequestHeader('Content-Type', 'application/json');
  // initResumable.setRequestHeader('X-Upload-Content-Length', file.size.toString());
  // initResumable.setRequestHeader('X-Upload-Content-Type', contentType);
  // initResumable.onreadystatechange = function() {
  //   if(initResumable.readyState === XMLHttpRequest.DONE && initResumable.status === 200) {
  //     const locationUrl = initResumable.getResponseHeader('Location');
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       console.log('uploadHelloWorld: reader.onload e:', e);
  //       const uploadResumable = new XMLHttpRequest();
  //       uploadResumable.open('PUT', locationUrl!, true);
  //       uploadResumable.setRequestHeader('Content-Type', contentType);
  //       uploadResumable.setRequestHeader('X-Upload-Content-Type', contentType);
  //       uploadResumable.onreadystatechange = function() {
  //         if(uploadResumable.readyState === XMLHttpRequest.DONE && uploadResumable.status === 200) {
  //           console.log(uploadResumable.response);
  //          }
  //       };
  //       uploadResumable.send(reader.result);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };
  
  // // You need to stringify the request body containing any file metadata
  
  // initResumable.send(JSON.stringify({
  //   'name': file.name,
  //   'mimeType': contentType,
  //   'Content-Type': contentType,
  //   'Content-Length': file.size
  // }));
