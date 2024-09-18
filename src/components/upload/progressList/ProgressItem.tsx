import { CheckCircleOutline } from '@mui/icons-material';
import { Box, ImageListItem, ImageListItemBar} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { v4 as uuidv4 } from 'uuid';
import uploadFileProgress from '../../../firebase/uploadFileProgress';
import addDocument from '../../../firebase/addDocument';
import { useAuth } from '../../../context/AuthContext';
import pdfDocImage from '../../../img/pdf-doc-img.jpg';
import { uploadFile as GoogleDriveUploadFile } from '@/googledrive/uploadFile';
import { createFolder as GoogleDriveCreateFolder } from '@/googledrive/createFolder';
import { DocumentProperties } from '../../documents/types';

const ProgressItem = ({ file }: { file: File }) => {
  const [progress, setProgress] = useState(0);
  const [documentURL, setdocumentURL] = useState<null | string>(null);
  const [name, setName] = useState<string | null>(null);
  const { googleApi, currentFirebaseUser, accessToken, setAlert } = useAuth();
  useEffect(() => {
    const uploadFile = async () => {
      const fileName = uuidv4() + '.' + file.name.split('.').pop();
      console.log('uloadFile: fileName:', fileName);
      try {
        const url = await uploadFileProgress(
          file,
          `gallery/${currentFirebaseUser?.uid}`,
          fileName,
          setProgress
        ) as string;
        const galleryDoc: DocumentProperties = {
          documentURL: url,
          documentName: file.name || '',
          uid: currentFirebaseUser?.uid || '',
          uEmail: currentFirebaseUser?.email || '',
          uName: currentFirebaseUser?.displayName || '',
          uPhoto: currentFirebaseUser?.photoURL || '',
          fileType: file.type,
          fileSize: file.size.toString(),
        };
        console.log('adding document:', fileName);
        console.log('galleryDoc:', galleryDoc);
        await addDocument('gallery', galleryDoc, fileName);
        console.log('uploading to google drive');
        GoogleDriveCreateFolder(googleApi, 'REAI').then((folderId: string|undefined) => {
          if(folderId) {
            GoogleDriveUploadFile(googleApi, file, folderId, accessToken);
          }
        });
        setdocumentURL(null);
        setName(null);
      } catch (error) {
        setAlert({
          isAlert: true,
          severity: 'error',
          message: (error as Error).message,
          timeout: 8000,
          location: 'main',
        });
        console.log(error);
      }
    };
    console.log('file name:', file.name);
    setName(file.name);
    setdocumentURL(URL.createObjectURL(file));
    uploadFile();
  }, [file]);
  return (
    documentURL && (
      <ImageListItem cols={1} rows={1}>
        <img src={pdfDocImage} alt="gallery" loading="lazy" />
        <Box sx={backDrop}>
          {progress < 100 ? (
            <CircularProgressWithLabel value={progress} />
          ) : (
            <CheckCircleOutline
              sx={{ width: 60, height: 60, color: 'lightgreen' }}
            />
          )}
        </Box>
        <ImageListItemBar position="bottom" title={name} />
      </ImageListItem>
    )
  );
};

export default ProgressItem;

const backDrop = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0, .5)',
};
