// src/App.tsx
import React from 'react';
import Modal from './components/Modal';
import Nav from './components/Nav';
import UploadProgress from './components/upload/UploadProgress';
import Documents from './components/documents/Documents';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppContext';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <AuthProvider>
          <Modal />
          <Nav />
          <Box sx={{ marginTop: 2 }}> {/* Add marginTop to create space */}
          <UploadProgress />
          <Documents />
          </Box>
        </AuthProvider>
      </AppDataProvider>
    </ThemeProvider>
  );
};

export default App;
