import React from 'react';
import DriveUploady from 'drive-uploady';
import UploadButton from '@rpldy/upload-button';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@mui/material';
import { Lock } from '@mui/icons-material';
import Login from '../user/Login';

export const DriveUpload: React.FC = () => {
    const { currentUser, setModal } = useAuth();
    const openLogin = () => {
        setModal({ isOpen: true, title: 'Login', content: <Login /> });
      };

    async function getToken() {
        console.log('getToken: getting token');
        console.log('getToken: currentUser:', currentUser);
        if (!currentUser) {
            console.error('getToken: no current user');
            return;
        }
        return currentUser?.getIdToken().then((token) => {
            console.log('getToken: token:', token);
            return token;
        })
        .catch((error) => {
            console.log('getToken: error getting token:', error);
        });
    };

    return (
        <div>
            {!currentUser ? (
          <Button startIcon={<Lock />} onClick={openLogin}>
            Login
          </Button>
        ) : (
            <DriveUploady
                getToken={() => getToken()}
                clientId='616954384014-tfficuqn6hf5ds39pkcbf6ui62ol16sa.apps.googleusercontent.com'
                scope='https://www.googleapis.com/auth/drive.file'
            >
                <UploadButton>Upload to Drive</UploadButton>
            </DriveUploady>
                    )}

        </div>

    );
};