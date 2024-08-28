import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PasswordField from '../inputs/PasswordField';
import SubmitButton from '../inputs/SubmitButton';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import { getErrorMessage } from '@/utils';

interface ReAuthProps {
  action: string;
}

const ReAuth: React.FC<ReAuthProps> = ({ action }) => {
  const { currentUser, setLoading, setAlert, setModal, modal } = useAuth();
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const credential = EmailAuthProvider.credential(
      currentUser?.email ?? '',
      passwordRef.current!.value
    );
    try {
      if (currentUser) {
        await reauthenticateWithCredential(currentUser, credential);
      } else {
        throw new Error('No user found');
      }

      switch (action) {
        case 'changePassword':
          setModal({
            ...modal,
            title: 'Update Password',
            content: <ChangePassword />,
          });
          break;
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
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <DialogContentText>
          Please Enter your current Password:
        </DialogContentText>
        <PasswordField {...{ passwordRef }} />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default ReAuth;
