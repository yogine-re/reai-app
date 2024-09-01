import React, { useMemo } from "react";
import Uploady, { composeEnhancers } from "@rpldy/uploady";
import getDriveEnhancer from "./getDriveEnhancer";
interface DriveUploadyProps extends React.PropsWithChildren<{}> {
  enhancer?: any;
  getToken?: () => string;
  gApiScriptIdPrefix?: string;
  clientId?: string; // Add the 'clientId' property
  scope?: string; // Add the 'scope' property
  queryParams?: any; // Add the 'queryParams' property
}

const DriveUploady = (props: DriveUploadyProps) => {
  const {
    enhancer: extEnhancer,
    getToken,
    gApiScriptIdPrefix,
    clientId,
    scope,
    queryParams,
    ...uploadyProps
  } = props;
  const enhancer = useMemo(
    () => {
      const driveEnhancer = getDriveEnhancer({
        getToken,
        gApiScriptId: gApiScriptIdPrefix, // Rename 'gApiScriptIdPrefix' to 'gApiScriptId'
        clientId,
        scope,
        queryParams
      });
      return extEnhancer
        ? composeEnhancers(driveEnhancer, extEnhancer)
        : driveEnhancer;
    },
    [extEnhancer, getToken, gApiScriptIdPrefix, clientId, scope, queryParams]
  );
  return <Uploady {...uploadyProps} enhancer={enhancer} />;
};
export default DriveUploady;
