//see \
// https://github.com/arnabsen1729/google-drive-upload-react
// https://gist.github.com/jakekara/652e3c3bf272cd682ae39b50f1c45062
import React, { ReactElement, useEffect, useState } from 'react';
import initClientGoogleDrive from '@/gapi/gapi';
import {driveListFiles, log} from '@/gapi/gapi';


export function GDrive(): ReactElement {
  console.log('GDrive');
  const [loggedInStatus, setLoggedInStatus] = useState<boolean>(false);
  const [initiatedClient, setInitiatedClient] = useState<boolean>(false);

  useEffect(() => {
    console.log('GDrive:useEffect');
    console.log('GDrive:useEffect: calling initClientGoogleDrive');
    
    initClientGoogleDrive({
      updateLoggedInStatus: (status) => {
        console.log('Login status', status);
        setLoggedInStatus(status);
      },
    }).then((gapi) => {
      log('CAROLINA GDrive:useEffect:then:gapi', gapi);  
      console.log('CAROLINA gapi', gapi);
      driveListFiles(gapi);

    }).catch((error) => {
      console.log('Error initializing google drive client', error);
    });
    setInitiatedClient(true);
    console.log('*initiatedClient', initiatedClient);
  }, [initiatedClient])

  return (
    <div>
      <div>You are {loggedInStatus ? '' : 'not'} signed in</div>
    </div>
  );
}

