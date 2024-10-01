import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';
import { gapi } from 'gapi-script';
import initClientGoogleDrive from '@/gapi/gapi';
import { renameFolder as GoogleDriveRenameFolder } from '@/googledrive/renameFolder';
import { DocumentProperties } from '@/components/documents/types';

export interface AppContextType {
  googleApi: typeof gapi | null;
  project: string;
  updateProject: (newProject: string) => void;
  filesToUpload: File[];
  setFilesToUpload: (newFiles: File[]) => void;
  currentDocument: DocumentProperties | null;
  setCurrentDocument: (document: DocumentProperties) => void;

};

const AppDataContext: React.Context<AppContextType> = createContext<AppContextType>(null as any);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleApi, setGoogleApi] = useState<typeof gapi | null>(null);
  const [project, setProject] = useState<string>('My Project');
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [currentDocument, setCurrentDocument] = useState<DocumentProperties | null>(null);


  const initClientGoogleApi = async () => {
    initClientGoogleDrive()
      .then((googleApi) => {
        setGoogleApi(googleApi);
      })
      .catch((error) =>
        console.error('Error initializing gapi client:', error)
      );
  };

  const updateProject = (newProject: string) => {
    try {
      GoogleDriveRenameFolder(googleApi, project, newProject);
      setProject(newProject);
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
    project,
    updateProject,
    filesToUpload,
    setFilesToUpload,
    currentDocument,
    setCurrentDocument
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