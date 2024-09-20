import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';
import { gapi } from 'gapi-script';
import initClientGoogleDrive from '@/gapi/gapi';
import { renameFolder as GoogleDriveRenameFolder } from '@/googledrive/renameFolder';

export interface AppContextType {
  googleApi: typeof gapi | null;
  documentRoot: string;
  updateDocumentRoot: (newDocumentRoot: string) => void;
};

const AppDataContext: React.Context<AppContextType> = createContext<AppContextType>(null as any);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleApi, setGoogleApi] = useState<typeof gapi | null>(null);
  const [documentRoot, setDocumentRoot] = useState<string>('documents');

  const initClientGoogleApi = async () => {
    initClientGoogleDrive()
      .then((googleApi) => {
        setGoogleApi(googleApi);
      })
      .catch((error) =>
        console.error('Error initializing gapi client:', error)
      );
  };

  const updateDocumentRoot = (newDocumentRoot: string) => {
    try {
      GoogleDriveRenameFolder(googleApi, documentRoot, newDocumentRoot);
      setDocumentRoot(newDocumentRoot);
    } catch (error) {
      console.error('Error updating document root:', error);
    }
  };

  useEffect(() => {
    if (!googleApi) {
      initClientGoogleApi();
    }
  }, []);
  
  const appData: AppContextType = {
    googleApi,
    documentRoot,
    updateDocumentRoot,
  };

  return (
	<AppDataContext.Provider value={appData}>
	  {children}
	</AppDataContext.Provider>
  );
};

export default AppDataContext;
export const useAppData = (): AppContextType => {
    const context = useContext(AppDataContext);
    if (!context) {
      throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
  
  };