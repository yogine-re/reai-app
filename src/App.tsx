// src/App.tsx
import React from 'react';
import SplashScreen from './components/SplashScreen';
import Modal from './components/Modal';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import Documents from './components/documents/Documents';
import { AuthProvider } from './context/AuthContext';
import { Container } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Container maxWidth='lg' sx={{ textAlign: 'center', mt: '3rem' }}>
          <SplashScreen />
          <Modal />
          <Nav />
          <Upload />
        </Container>
        <Container>
          <Documents />
        </Container>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
