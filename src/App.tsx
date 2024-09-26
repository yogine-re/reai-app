// src/App.tsx
import React from 'react';
import Modal from './components/Modal';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import Documents from './components/documents/Documents';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppContext';
import { Box } from '@mui/material';
import { ThemeProvider, CssBaseline, Stack } from '@mui/material';
import { theme } from './theme';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <AuthProvider>
          <Box bgcolor={'background.default'} color={'text.primary'}>
            <Modal />
            <Stack direction='column' spacing={2} justifyContent='space-between'>
              <Nav />
              <Upload />
              <Documents />
            </Stack>
          </Box>
        </AuthProvider>
      </AppDataProvider>
    </ThemeProvider>
  );
};

export default App;
