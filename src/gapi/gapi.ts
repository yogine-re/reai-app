import { gapi } from 'gapi-script';
import { uploadFile } from '@/googledrive/uploadFile';

const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM';
const CLIENT_ID = '616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive';

const initialize = async () => {
    const result = await new Promise((resolve, reject) => {
        try {
            console.log('initialize');
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                scope: SCOPES,
            });
            log('initialize gapi', gapi);
            resolve(gapi);
        } catch (error) {
            console.error(`Error initializing gapi client: ${error}`);
            reject();
        }
    });
    log('initialize result', result);
    return result;
};

const authenticate = async () => {
    try {
        console.log('authenticate');
        const result = await gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn: boolean) => {
            console.log('isSignedIn', isSignedIn);
            return isSignedIn;
        });
        console.log('authenticate result', result);
        console.log('authenticated');
    } catch (error) {
        throw Error(`Error authenticating gapi client: ${error}`);
    }
};

const loadGoogleDriveApi = async () => {
    gapi.client.setApiKey(API_KEY);
    try {
        console.log('loadGoogleDriveApi');
        const result = await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
        log('loadGoogleDriveApi result', result);
        log('loadGoogleDriveApi gapi', gapi);
        console.log('google drive api loaded');
        return gapi;
    } catch (error) {
        throw Error(`Error loading google drive api gapi client: ${error}`);
    }
};

export const initClientGoogleApi = async () => {
    await new Promise((resolve, reject) => {
        gapi.load('client:auth2', async () => {
            try {
                console.log('initClientGoogleDrive');
                await initialize();
                resolve(gapi);
            } catch (error) {
                console.error(`Error initializing gapi client: ${error}`);
                reject();
            }
        });
    });
    console.log('initClientGoogleApi result:')
    console.log('done with initClientGoogleDrive');
    return gapi;
};

const initClientGoogleDrive = async () => {
    await new Promise((resolve, reject) => {
        gapi.load('client:auth2', async () => {
            try {
                console.log('initClientGoogleDrive');
                const r1 = await initialize();
                const r2 = await authenticate();
                const r3 = await loadGoogleDriveApi();
                log('initClientGoogleDrive r1 ', r1);
                log('initClientGoogleDrive r2 ', r2);
                log('initClientGoogleDrive r3 ', r3);
                log('initClientGoogleDrive gapi', gapi);
                resolve(gapi);
            } catch (error) {
                console.error(`Error initializing gapi client: ${error}`);
                reject();
            }
        });
    });
    console.log('done with initClientGoogleDrive');
    return gapi;
};


/**
       * Print metadata for first 10 files.
       */
export async function driveListFiles(theGapi: typeof gapi, token: string) {
    console.log('driveListFiles');
    console.log('driveListFiles token', token);
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

export async function driveUploadFile(theGapi: typeof gapi, token: string) {
    console.log('driveUploadFile');
    log('driveUploadFile theGapi', theGapi);
    const user = theGapi.auth2.getAuthInstance()?.currentUser?.get();
    const access_token = user?.getAuthResponse()?.access_token || token;
    console.log('access_token', access_token);  
    log('driveUploadFile theGapi', theGapi);
    uploadFile(theGapi, access_token);
}

export function log(message: string, theGapi: typeof gapi) {
    console.log('LOGGING ' + message, theGapi ? ' is set' : ' is null');
    console.log('LOGGING ' + message + '.client', theGapi?.client ? ' is set' : 'theGapi.client is null');
    console.log('LOGGING ' + message + '.auth2', theGapi?.auth2 ? '.auth2 is set' : 'theGapi.auth2 is null');
    console.log('LOGGING ' + message + '.auth2.getAuthInstance()', theGapi?.auth2?.getAuthInstance() ? '.auth2.getAuthInstance() is  set' : 'theGapi.auth2.getAuthInstance() is null');
    console.log('LOGGING ' + message + '.client.drive', theGapi?.client?.drive ? '.client.drive is set' : '.client.drive is null');

}

export default initClientGoogleDrive;



