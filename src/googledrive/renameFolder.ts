
export async function renameFolder(googleApi: any, folderName: string, newfolderName: string) {
    console.log('renameFolder folderName: ', folderName);
    const requestBody = {
        name: newfolderName,
    };

    try {
        const listResponse = await googleApi.client.drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}'`,
            spaces: 'drive',
            fields: 'nextPageToken, files(id, name)',
        });

        const folders = listResponse?.result?.files ?? [];

        if (folders.length > 0) {
            const folderId = folders[0].id; // Return the ID of the first found folder
            googleApi.client.drive.files.update({
                fileId: folderId,
                resource: requestBody,
            }).then((response: any) => {
                console.log('Folder updated successfully:', response.result);
            }).catch((error: any) => {
                console.error('Error updating folder:', error);
            });
        } else {
            console.log('Folder not found:', folderName);
        }
    } catch (error) {
        console.error('Error updating folder}:', error);
    }
    
}


  