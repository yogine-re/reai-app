import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';
import { gapi } from 'gapi-script';
import initClientGoogleDrive from '@/gapi/gapi';


export interface AppContextType {
    googleApi: typeof gapi | null;
    documentRoot: string;

};

const AppContext: React.Context<AppContextType> = createContext<AppContextType>(null as any);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [googleApi, setGoogleApi] = useState<typeof gapi | null>(null);
    const [documentRoot] = useState<string>('documents');

    const initClientGoogleApi = async () => {
        initClientGoogleDrive()
          .then((googleApi) => {
            setGoogleApi(googleApi);
          })
          .catch((error) =>
            console.error('Error initializing gapi client:', error)
          );
      };

  useEffect(() => {
    if (!googleApi) {
        initClientGoogleApi();
    }
  }, []);
  const appData: AppContextType = {
    googleApi,
    documentRoot,
  };

  return (
	<AppContext.Provider value={appData}>
	  {children}
	</AppContext.Provider>
  );
};

export default AppContext;
export const useAppData = (): AppContextType => {
    const result = useContext(AppContext);
    return result;
  
  };