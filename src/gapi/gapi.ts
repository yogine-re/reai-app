import { gapi } from 'gapi-script';

const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM';
const CLIENT_ID = '616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com';

const initialize = async () => {
    await new Promise((resolve, reject) => {
        try {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
            });
            resolve(gapi);
        } catch (error) {
            console.error(`Error initializing gapi client: ${error}`);
            reject();
        }
    });
};

const authenticate = async () => {
    try {
        await gapi.auth2.getAuthInstance();
        console.log('authenticated');
    } catch (error) {
        throw Error(`Error authenticating gapi client: ${error}`);
    }
};

const loadGoogleDriveApi = async () => {
    console.log('loadGoogleDriveApi');
    gapi.client.setApiKey(API_KEY);
    try {
        await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
        console.log('google drive api loaded');
    } catch (error) {
        throw Error(`Error loading google drive api gapi client: ${error}`);
    }
};


const initClientGoogleDrive = async () => {
    await new Promise((resolve, reject) => {
        gapi.load('client:auth2', async () => {
            try {
                await initialize();
                await authenticate();
                await loadGoogleDriveApi();
                resolve(gapi);
            } catch (error) {
                console.error(`Error initializing gapi client: ${error}`);
                reject();
            }
        });
    });
    return true;
};


/**
       * Print metadata for first 10 files.
       */
export async function driveListFiles(theGapi: typeof gapi) {
    console.log('driveListFiles');
    log('driveListFiles theGapi', theGapi);

    let response;
    console.log('theGapi?.client', theGapi?.cient);
    if (theGapi.client?.drive == null) {
        console.log('theGapi.client.drive is null');
        return;
    }
    else {
        console.log('theGapi.client.drive is set in driveListFiles');
    }
    try {
        response = await theGapi.client.drive.files.list({
            'pageSize': 10,
            'fields': 'files(id, name)',
        });
    } catch (err) {
        console.error('error: ' + err);
        return;
    }
    if(response) {
        console.log('response', response);
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


export function log(message: string, theGapi: typeof gapi) {
    console.log('LOGGING ' + message, theGapi ? 'theGapi is set' : 'theGapi is null');
    console.log('LOGGING ' + message + '.client', theGapi?.client ? 'theGapi.client is set' : 'theGapi.client is null');
    console.log('LOGGING ' + message + '.auth2', theGapi?.auth2 ? 'theGapi.auth2 is set' : 'theGapi.auth2 is null');
    console.log('LOGGING ' + message + '.auth2.getAuthInstance()', theGapi?.auth2?.getAuthInstance() ? 'theGapi.auth2.getAuthInstance() is  set' : 'theGapi.auth2.getAuthInstance() is null');
    console.log('LOGGING ' + message + '.client.drive', theGapi?.client?.drive ? 'theGapi.client.drive is set' : 'theGapi.client.drive is null');

}

export default initClientGoogleDrive;



