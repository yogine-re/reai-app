//see \
// https://github.com/arnabsen1729/google-drive-upload-react
// https://gist.github.com/jakekara/652e3c3bf272cd682ae39b50f1c45062
import React, { ReactElement, useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file';
           
const API_KEY = 'AIzaSyD_BxWI1f5Rk-4jirw5HF1Yw3P0O-6jVnM';
const CLIENT_ID = '616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com';

console.log('client_id', CLIENT_ID);

let done = false;

export const initClient = (options: {
  updateLoggedInStatus: (status: boolean) => void;
}) => {
  if (done) {
    return;
  }
  done = true;
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(() => {
      // Listen for sign-in state changes.
      console.log('gapi.auth2', gapi.auth2);

      gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(options.updateLoggedInStatus);

      // Handle the initial sign-in state.
      options.updateLoggedInStatus(
        gapi.auth2.getAuthInstance().isSignedIn.get()
      );
    })
    .catch((err: any) => {
      console.error('Caught error', err);
    });
};

function LogInOutButton(options: {
  loggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}): ReactElement {
  const { loggedIn, logIn, logOut } = options;
  const buttonText = loggedIn ? 'Log out' : 'Log in';
  const buttonAction = loggedIn ? logOut : logIn;

  return <button onClick={buttonAction}>{buttonText}</button>;
}

export function GDrive(): ReactElement {
  const [loggedInStatus, setLoggedInStatus] = useState<boolean>(false);
  const [initiatedClient, setInitiatedClient] = useState<boolean>(false);

  useEffect(() => {
    gapi.load('client:auth2', () =>
      initClient({
        updateLoggedInStatus: (status) => {
          console.log('Login status', status);
          setLoggedInStatus(status);
        },
      })
    );

    setInitiatedClient(true);
  }, [initiatedClient]);

  return (
    <div>
      <div>You are {loggedInStatus ? '' : 'not'} signed in</div>
      <LogInOutButton
        loggedIn={loggedInStatus}
        logIn={() => gapi.auth2.getAuthInstance().signIn()}
        logOut={() => gapi.auth2.getAuthInstance().signOut()}
      />
    </div>
  );
}