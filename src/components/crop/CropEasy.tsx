import { Cancel } from '@mui/icons-material';
import CropIcon from '@mui/icons-material/Crop';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Slider,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { useAuth } from '../../context/AuthContext';
import getCroppedImg from './utils/cropImage';
import { getErrorMessage } from '@/utils';
type CropEasyProps = {
  photoURL: string;
  setOpenCrop: Function;
  setPhotoURL: Function;
  setFile: Function;
};

const CropEasy: React.FC<CropEasyProps> = ({ photoURL, setOpenCrop, setPhotoURL, setFile }) => {
  const { setAlert, setLoading } = useAuth();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const cropImage = async () => {
    setLoading(true);
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      ) as { file: File, url: string };
      setPhotoURL(url);
      setFile(file);
      setOpenCrop(false);
    } catch (error: unknown) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: getErrorMessage(error),
        timeout: 5000,
        location: 'modal'
      });
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <>
      <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: 400,
          width: 'auto',
          minWidth: { sm: 500 }
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay='auto'
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, zoom) => setZoom(zoom as number)}
            />
          </Box>
          <Box>
            <Typography>Rotation: {rotation + '°'}</Typography>
            <Slider
              valueLabelDisplay='auto'
              min={0}
              max={360}
              value={rotation}
              onChange={(e, rotation) => setRotation(rotation as number)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Button
            variant='outlined'
            startIcon={<Cancel />}
            onClick={() => setOpenCrop(false)}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            startIcon={<CropIcon />}
            onClick={cropImage}
          >
            Crop
          </Button>
        </Box>
      </DialogActions>
    </>
  );
};
export default CropEasy;
const zoomPercent = (value: number) => {
  return `${Math.round(value * 100)}%`;
};
