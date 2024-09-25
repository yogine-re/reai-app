
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
            // Update the folder's name
            const updateResponse = await googleApi.client.drive.files.update({
                fileId: folderId,
                requestBody,
                fields: 'id, name',
            });

            console.log('Folder updated successfully:', updateResponse.result);
        } else {
            console.log('Folder not found:', folderName);
        }
    } catch (error) {
        console.error('Error updating folder:', error);
    }
    
}


  