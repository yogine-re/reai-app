import { GOOGLE_API, GOOGLE_GSI } from './consts';
import { gapi } from 'gapi-script';
import loadScript from './loadScript';

const loadGapi = ({ gApiScriptIdPrefix = 'uploady-drive-', apiUrl = GOOGLE_API, gsiUrl = GOOGLE_GSI, clientId, access_token, scope }: { clientId: string; scope: string; access_token: string; gApiScriptIdPrefix?: string; apiUrl?: string; gsiUrl?: string }) => {
  const initAuth = () => {
    const responseCallbacks: Function[] = [];

    const tokenClient = access_token ? undefined : gapi.client.init({
      client_id: clientId,
      scope,
      callback: (response: any) => {
        responseCallbacks.forEach((cb) => cb(response));
      },
      error_callback: (result: any) => {
        //failed to authenticate/authorize
        responseCallbacks.forEach((cb) => cb({
          error: result.type,
          error_description: result.message,
        }));
      }
    });

    const requestToken = (cb: Function) => {
      if (typeof getToken === 'function') {
        //external token retriever provided, use it
        (getToken as Function)(cb);
      } else {
        //check if already has token
        const existingToken = gapi.client.getToken();
    
        if (existingToken?.expires_in) {
          //token not expired, we can re-use
          cb(existingToken);
        } else {
          //use own token client to retrieve new token
          responseCallbacks.splice(0, 1, cb);
          tokenClient.requestAccessToken({ prompt: 'consent' });
        }
      }
    };

    return Promise.resolve({ requestToken });
  };

  const loadAuth = () => new Promise((resolve) => {
    gapi.load('client', resolve);
  });

  const loadOwnGoogleApi = () => Promise.all([
    loadScript(`${gApiScriptIdPrefix}gsi`, gsiUrl),
    loadScript(`${gApiScriptIdPrefix}api`, apiUrl),
  ])
    .then(loadAuth);

    // CAROLINA HERE
   // set the authentication token
   gapi.auth.setToken(tokenObject);  

  return (getToken ?
    //dont load scripts
    Promise.resolve() :
    //load google scripts
    loadOwnGoogleApi())
    .then(initAuth);
};

export default loadGapi;
