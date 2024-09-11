import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';
import ChangeEmail from './ChangeEmail';
import DeleteAccount from './DeleteAccount';
import ReAuth from './ReAuth';
import { getErrorMessage } from '@/utils';

const AccountSettings: React.FC = () => {
  const { currentUser, currentFirebaseUser, setModal, modal, setAlert, loginWithOauthGoogle } = useAuth();
  const isPasswordProvider =
  currentFirebaseUser?.providerData[0].providerId === 'password' && !currentUser;

  const handleAction = async (action: string) => {
    console.log('AccountSettings: handleAction: issPasswordProvider: ' + isPasswordProvider);
    if (isPasswordProvider) {
      setModal({
        ...modal,
        title: 'Re-Login',
        content: <ReAuth {...{ action }} />,
      });
    } else {
      try {
        if (currentFirebaseUser)
          await reauthenticateWithPopup(currentFirebaseUser, new GoogleAuthProvider());
        if (currentUser)
          await loginWithOauthGoogle();

        switch (action) {
          case 'changeEmail':
            setModal({
              ...modal,
              title: 'Update Email',
              content: <ChangeEmail />,
            });
            break;
          case 'deleteAccount':
            setModal({
              ...modal,
              title: 'Delete Account',
              content: <DeleteAccount />,
            });
            break;
          default:
            throw new Error('No matching action');
        }
      } catch (error: unknown) {
        setAlert({
          isAlert: true,
          severity: 'error',
          message: getErrorMessage(error),
          timeout: 5000,
          location: 'modal',
        });
        console.log(error);
      }
    }
  };
  return (
    <>
      <DialogContent dividers>
        <DialogContentText>
          For security reason, you need to provide your credentials to do any of
          these actions:
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 2, my: 2 }}>
        {isPasswordProvider && (
          <Button onClick={() => handleAction('changePassword')}>
            Change Password
          </Button>
        )}
        <Button onClick={() => handleAction('changeEmail')}>
          Change Email
        </Button>
        <Button onClick={() => handleAction('deleteAccount')}>
          Delete Account
        </Button>
      </DialogActions>
    </>
  );
};

export default AccountSettings;
