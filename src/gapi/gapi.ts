import { gapi } from 'gapi-script';

const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM';
const CLIENT_ID = '616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive';

const initialize = async () => {
    const result = await new Promise((resolve, reject) => {
        try {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                scope: SCOPES,
            });
            resolve(gapi);
        } catch (error) {
            console.error(`Error initializing gapi client: ${error}`);
            reject();
        }
    });
    return result;
};

const loadGoogleDriveApi = async () => {
    gapi.client.setApiKey(API_KEY);
    try {
        await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
        return gapi;
    } catch (error) {
        throw Error(`Error loading google drive api gapi client: ${error}`);
    }
};

const initClientGoogleDrive = async () => {
    await new Promise((resolve, reject) => {
        gapi.load('client:auth2', async () => {
            try {
                await initialize();
                await loadGoogleDriveApi();
                resolve(gapi);
            } catch (error) {
                console.error(`Error initializing gapi client: ${error}`);
                reject();
            }
        });
    });

    return gapi;
};


/**
       * Print metadata for first 10 files.
       */
export async function driveListFiles(googleApi: typeof gapi) {
    let response;
    if (googleApi.client?.drive == null) {
        console.error('driveListFiles: gapi client not initialized)');
        return;
    }
    try {
        response = await googleApi.client.drive.files.list({
            'pageSize': 10,
            'fields': 'files(id, name)',
        });
    } catch (err) {
        console.error('error: ' + err);
        return;
    }

    const files = response.result.files;
    if (!files || files.length == 0) {
        console.log('No files found.');
        return;
    }
    // Flatten to string to display
    const output = files.reduce(
        (str: string, file: { name: string, id: string }) => `${str}${file.name} (${file.id})\n`,
        'Files:\n');
    console.log(output);
}

export default initClientGoogleDrive;



