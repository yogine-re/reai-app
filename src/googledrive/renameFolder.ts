
export async function renameFolder(googleApi: any, folderName: string, newfolderName: string): Promise<string | undefined> {
    const fileMetadata = {
        name: newfolderName,
        mimeType: 'application/vnd.google-apps.folder',
    };

    try {
        const listResponse = await googleApi.client.drive.files.update({
            q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}'`,
            spaces: 'drive',
            fields: 'nextPageToken, files(id, name)',
        });

        const folders = listResponse?.result?.files ?? [];

        if (folders.length > 0) {
            return folders[0].id; // Return the ID of the first found folder
        } else {
            console.log('No folders found.');
        }

        if (folders.length === 0) {
            const createResponse = await googleApi.client.drive.files.create({
                resource: fileMetadata,
                fields: 'id',
            });
            return createResponse.result.id;
        }
    } catch (error) {
        console.error('Error creating folder:', error);
    }

    return undefined;
}


  