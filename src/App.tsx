// src/App.tsx
import React from 'react';
import Modal from './components/Modal';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import Documents from './components/documents/Documents';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <AuthProvider>
          <Modal />
          <Nav />
          <Upload />
          <Documents />
        </AuthProvider>
      </AppDataProvider>
    </ThemeProvider>
  );
};

export default App;
