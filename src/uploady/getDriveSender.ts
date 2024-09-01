import { getXhrSend, SendResult, OnProgress } from "@rpldy/sender";
import {
  BatchItem,
  SendOptions,
} from "@rpldy/shared";
import { DRIVE_SENDER_TYPE, DRIVE_UPLOAD_URL_MULTI } from "./consts";

const validateItems = (items: any[]) => {
  if (items.length > 1) {
    throw new Error("Uploady Drive Sender - only 1 file can be uploaded per request (use concurrent = 1)");
  }
  if (!items[0].file) {
    throw new Error("Uploady Drive Sender - uploaded item must be file");
  }
};
const getUploadUrl = (queryParams: Record<string, string>): string => {
  const paramsString =
    queryParams &&
    Object.entries(queryParams)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
  return `${DRIVE_UPLOAD_URL_MULTI}${paramsString ? "&" + paramsString : ""}`;
};
const getDriveSender = (authPromise: any, queryParams: Record<string, string>) => (items: BatchItem[], url: string, options: SendOptions, onProgress: OnProgress) => {
  const signInToDrive = (tokenClient: any): Promise<void> => 
    new Promise<void>(resolve => {
      tokenClient.requestToken((response: any) => {
        if (response.access_token && response.expires_in) {
          resolve(response);
        } else {
          // eslint-disable-next-line
          console.error("Encountered Auth Error ", {
            code: response.error,
            description: response.error_description,
            uri: response.error_uri
          });
          resolve();
        }
      });
    });
  
  const xhrSend = (items: any[], url: string, options: SendOptions, onProgress: OnProgress): SendResult => {
    getXhrSend({
      getRequestData: (items: BatchItem[], options: SendOptions) => { return null; },
      preRequestHandler: (issueRequest: (requestUrl?: string, requestData?: unknown, requestOptions?: Record<string, any>) => Promise<XMLHttpRequest>) =>
        authPromise
          .then((tokenClient: any) => {
            if (!tokenClient) {
              throw new Error("Uploady Drive Sender - failed to initialize gapi");
            }
            return signInToDrive(tokenClient);
          })
          .then((authResponse: any) => {
            let result;
            if (authResponse) {
              const token = authResponse.access_token;
              const metadata = JSON.stringify({
                name: items[0].file.name,
                mimeType: items[0].file.type,
                ...options.params
              });
              const requestData = new FormData();
              requestData.append("metadata", new Blob([metadata], { type: "application/json" }));
              const fileBlob = new Blob([items[0].file]);
              requestData.append("file", fileBlob);
              //return result of issueRequest to ensure sender has the upload XHR
              result = issueRequest(getUploadUrl(queryParams), requestData, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            } else {
              throw new Error("Uploady Drive Sender - authentication failure");
            }
            return result;
          })
    });
  const send = (items: BatchItem[], url: string, sendOptions: SendOptions, onProgress: OnProgress): SendResult => {    
    validateItems(items);
    const sendResult: SendResult & { send: any } = {
      ...xhrSend(items, "dummy", sendOptions, onProgress),
      send: undefined
    };
  
    sendResult.senderType = DRIVE_SENDER_TYPE;
    return sendResult;
  };

  return {
    send,
  };
};
export default getDriveSender;
