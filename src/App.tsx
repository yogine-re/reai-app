// src/App.tsx
import React from 'react';
import SplashScreen from './components/SplashScreen';
import Modal from './components/Modal';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import DocumentsList from './components/documents/DocumentsList';
import { AuthProvider } from './context/AuthContext';
import { Container } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container maxWidth='lg' sx={{ textAlign: 'center', mt: '3rem' }}>
      <AuthProvider>
        <SplashScreen />
        <Modal />
        <Nav />
        <Upload />
        <DocumentsList />
      </AuthProvider >
    </Container>
  );
};

export default App;
