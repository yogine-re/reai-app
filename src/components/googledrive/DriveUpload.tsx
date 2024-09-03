import React from 'react';
import DriveUploady from 'drive-uploady';
import UploadButton from '@rpldy/upload-button';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@mui/material';
import { Lock } from '@mui/icons-material';
import Login from '../user/Login';

export const DriveUpload: React.FC = () => {
    const { currentUserOauthGoogle, setModal } = useAuth();
    const currentUser = currentUserOauthGoogle;
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
        const accessToken = currentUser.authToken.access_token;
        return accessToken;
    };

    return (
        <div>
            {!currentUser ? (
          <Button startIcon={<Lock />} onClick={openLogin}>
            Login
          </Button>
        ) : (
            <DriveUploady
                debug
                autoUpload
                queryParams={{ keepRevisionForever: true }}
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