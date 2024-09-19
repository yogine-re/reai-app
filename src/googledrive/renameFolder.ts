
export async function renameFolder(googleApi: any, fileId: string, newfolderName: string) {
    const requestBody = {
        name: newfolderName,
    };

    googleApi.client.drive.files.update({
        fileId: fileId,
        resource: requestBody,
    }).then((response: any) => {
        console.log('File updated successfully:', response.result);
    }).catch((error: any) => {
        console.error('Error updating file:', error);
    });
}


  