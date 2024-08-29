import { CheckCircleOutline } from '@mui/icons-material';
import { Box, ImageListItem, ImageListItemBar} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { v4 as uuidv4 } from 'uuid';
import uploadFileProgress from '../../../firebase/uploadFileProgress';
import addDocument from '../../../firebase/addDocument';
import { useAuth } from '../../../context/AuthContext';
import pdfDocImage from '../../../img/pdf-doc-img.jpg';

const ProgressItem = ({ file }: { file: File }) => {
  const [progress, setProgress] = useState(0);
  const [documentURL, setdocumentURL] = useState<null | string>(null);
  const [name, setName] = useState<string | null>(null);
  const { currentUser, setAlert } = useAuth();
  useEffect(() => {
    const uploadImage = async () => {
      const imageName = uuidv4() + '.' + file.name.split('.').pop();
      console.log('uploadImage: imageName:', imageName);
      try {
        const url = await uploadFileProgress(
          file,
          `gallery/${currentUser?.uid}`,
          imageName,
          setProgress
        );
        const galleryDoc = {
          documentURL: url,
          documentName: file.name || '',
          uid: currentUser?.uid || '',
          uEmail: currentUser?.email || '',
          uName: currentUser?.displayName || '',
          uPhoto: currentUser?.photoURL || '',
        };
        console.log('adding document:', imageName);
        console.log('galleryDoc:', galleryDoc);
        await addDocument('gallery', galleryDoc, imageName);
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
    uploadImage();
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
