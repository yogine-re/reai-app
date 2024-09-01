import loadGapi from "./loadGapi";
import getDriveSender from "./getDriveSender";
let gApiClientPromise: Promise<any>;
const getDriveEnhancer = ({ getToken, gApiScriptId, clientId, scope, queryParams }: { getToken: any, gApiScriptId: any, clientId: any, scope: any, queryParams: any }) => {
  gApiClientPromise =
    gApiClientPromise || loadGapi({ gApiScriptId, clientId, scope, getToken });
  return uploader => {
    const sender = getDriveSender(gApiClientPromise, { queryParams });
    uploader.update({ send: sender.send });
    return uploader;
  };
};
export default getDriveEnhancer;
