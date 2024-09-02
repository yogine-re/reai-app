// src/App.tsx
import React from 'react';
import SplashScreen from './components/SplashScreen';
import Modal from './components/Modal';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import Documents from './components/documents/Documents';
import { AuthProvider } from './context/AuthContext';
import { Container } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { DriveUpload } from './components/googledrive/DriveUpload';


const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId='616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com'>
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
    </GoogleOAuthProvider>
  );
};

export default App;
