import { gapi } from 'gapi-script';

const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM';
const CLIENT_ID = '616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com';

console.log('client_id', CLIENT_ID);

const initClient = (options: {
    updateLoggedInStatus: (status: boolean) => void;
}): Promise<typeof gapi> => {
    console.log('initClient unused options ', options);
    return new Promise<typeof gapi>(async (resolve, reject) => {
        try {
            console.log('calling gapi.load(\'client:auth2\')');
            log('before calling gapi.load(\'client:auth2\') gapi', gapi);
            const gapiLoadResult = gapi.load('client:auth2', () => {
                log('gapi.load callback, gapi', gapi);
                console.log('calling gapi.client.init');
                gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES,
                })
                .then(() => {
                    log('initClientGoogleDrive:initClient then, gapi', gapi); 
                    gapi.auth2.getAuthInstance().isSignedIn.listen(options.updateLoggedInStatus);
                    options.updateLoggedInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                    driveListFiles(gapi);
                }, reject);
                return gapi;
            }
            );
            console.log('initClient gapiLoadResult ', gapiLoadResult)
            log('after gapi.load gapi', gapi);
            resolve(gapi);
        } catch (error: unknown) {
            console.log('initClient 1 error', error);
            reject(error);
        }
    });
};

const initClientGoogleDrive = (options: {
    updateLoggedInStatus: (status: boolean) => void;
}): Promise<typeof gapi> => {
    console.log('inside initClientGoogleDrive');
    return new Promise<typeof gapi>(async (resolve, reject) => {
        try {
            const gapiResult = initClient(options)
            log('after initClient gapiResult', gapiResult);
            resolve(gapiResult);
            driveListFiles(gapiResult);
        }
        catch (error: unknown) {
            reject(error);
        }
    });
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
    // console.log('LOGGING ' + message, theGapi ? 'theGapi is set' : 'theGapi is null'); 
    // console.log('LOGGING ' + message + '.client', theGapi?.client ? 'theGapi.client is set' : 'theGapi.client is null');    
    // console.log('LOGGING ' + message + '.auth2', theGapi?.auth2 ? 'theGapi.auth2 is set' : 'theGapi.auth2 is null');
    // console.log('LOGGING ' + message + '.auth2.getAuthInstance()', theGapi?.auth2?.getAuthInstance() ? 'theGapi.auth2.getAuthInstance() is  set' : 'theGapi.auth2.getAuthInstance() is null');
    console.log('LOGGING ' + message + '.client.drive', theGapi?.client?.drive ? 'theGapi.client.drive is set' : 'theGapi.client.drive is null');

}

export default initClientGoogleDrive;



