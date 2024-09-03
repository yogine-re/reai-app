//see \
// https://github.com/arnabsen1729/google-drive-upload-react
// https://gist.github.com/jakekara/652e3c3bf272cd682ae39b50f1c45062
import React, { ReactElement, useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { getErrorMessage } from '@/utils';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
           
const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM';
const CLIENT_ID = '616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com';

console.log('client_id', CLIENT_ID);

let done = false;

export const initClient = (options: {
  updateLoggedInStatus: (status: boolean) => void;
}) => {
  console.log('initClient');
  if (done) {
    console.log('initClient already done');
    return;
  }
  done = true;
  console.log('calling gapi.client.init');
  console.log('gapi.client ', gapi.client);
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(() => {
      console.log('gapi.auth2 ', gapi.auth2);
      // Listen for sign-in state changes.
      console.log('gapi.auth2', gapi.auth2);

      gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(options.updateLoggedInStatus);

      // Handle the initial sign-in state.
      options.updateLoggedInStatus(
        gapi.auth2.getAuthInstance().isSignedIn.get()
      );
      console.log('gapi loaded');
      console.log('gapi', gapi);
      console.log('gapi.client', gapi?.client);
      console.log('gapi.auth2', gapi?.auth2);
      console.log('gapi.auth2.getAuthInstance()', gapi?.auth2?.getAuthInstance());
      console.log('gapi.client.drive', gapi?.client?.drive);
      console.log('calling driveListFiles');
      driveListFiles();
    })
    .catch((err: any) => {
      console.log('Caught error', err);
      console.error('Caught error', err);
    });
};

// function LogInOutButton(options: {
//   loggedIn: boolean;
//   logIn: () => void;
//   logOut: () => void;
// }): ReactElement {
//   const { loggedIn, logIn, logOut } = options;
//   const buttonText = loggedIn ? 'Log out' : 'Log in';
//   const buttonAction = loggedIn ? logOut : logIn;

//   return <button onClick={buttonAction}>{buttonText}</button>;
// }

export function GDrive(): ReactElement {
  console.log('GDrive');
  const [loggedInStatus, setLoggedInStatus] = useState<boolean>(false);
  const [initiatedClient, setInitiatedClient] = useState<boolean>(false);

  useEffect(() => {
    console.log('GDrive:useEffect');
    console.log('GDrive:useEffect: calling gapi.load');
    gapi.load('client:auth2', () =>
      initClient({
        updateLoggedInStatus: (status) => {
          console.log('Login status', status);
          setLoggedInStatus(status);
        },
      })
    );
    setInitiatedClient(true);
    console.log('*initiatedClient', initiatedClient);
  }, [initiatedClient]);

  return (
    <div>
      <div>You are {loggedInStatus ? '' : 'not'} signed in</div>
      {/* <LogInOutButton
        loggedIn={loggedInStatus}
        logIn={() => gapi.auth2.getAuthInstance().signIn()}
        logOut={() => gapi.auth2.getAuthInstance().signOut()}
      /> */}
    </div>
  );
}

/**
       * Print metadata for first 10 files.
       */
export async function driveListFiles() {
  console.log('driveListFiles');

  // gapi.load('client:auth2', () =>
  //   initClient({
  //     updateLoggedInStatus: (status) => {
  //       console.log('driveListFiles:Login status', status);
  //     },
  //   })
  // );
  // console.log('driveListFiles:gapi loaded');
  console.log('driveListFiles:gapi', gapi);
  console.log('driveListFiles:gapi.client', gapi?.client);
  console.log('driveListFiles:gapi.auth2', gapi?.auth2);
  console.log('driveListFiles:gapi.auth2.getAuthInstance()', gapi?.auth2?.getAuthInstance());
  console.log('driveListFiles:gapi.client.drive', gapi?.client?.drive);
  let response;
  console.log('gapi?.client', gapi?.cient);
  try {
    response = await gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': 'files(id, name)',
    });
  } catch (err) {
    console.error('error: ' + getErrorMessage(err));
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