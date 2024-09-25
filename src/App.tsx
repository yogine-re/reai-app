// src/App.tsx
import React from 'react';
import Modal from './components/Modal';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import Documents from './components/documents/Documents';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppContext';
import { Container } from '@mui/material';
import { ThemeProvider, CssBaseline, Stack } from '@mui/material';
import { theme } from './theme';


const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <AuthProvider>
          <Container maxWidth='lg' sx={{ textAlign: 'left', mt: '3rem' }}>
            <Modal />
            <Stack direction="column" spacing={2} justifyContent="space-between">
            <Nav />
            <Upload />
            </Stack>
          </Container>
          <Container>
            <Documents />
          </Container>
        </AuthProvider>
      </AppDataProvider>
    </ThemeProvider>
  );
};

export default App;
