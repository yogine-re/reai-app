// src/App.tsx
import React from 'react';
import SplashScreen from './components/SplashScreen';
import Modal from './components/Modal';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import Documents from './components/documents/Documents';
import { AuthProvider } from './context/AuthContext';
import { Container } from '@mui/material';
import { DriveUpload } from './components/googledrive/DriveUpload';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Container maxWidth='lg' sx={{ textAlign: 'center', mt: '3rem' }}>
        <SplashScreen />
        <Modal />
        <Nav />
        <DriveUpload />
        <Upload />
    </Container>
    <Container maxWidth='lg' sx={{ textAlign: 'center', mt: '3rem' }}>
        <Documents />
    </Container>
    </AuthProvider >
  );
};

export default App;
