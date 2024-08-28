import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { updateEmail } from 'firebase/auth';
import { useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import EmailField from '../inputs/EmailField';
import SubmitButton from '../inputs/SubmitButton';
import { getErrorMessage } from '@/utils';

const ChangeEmail: React.FC = () => {
  const { currentUser, setLoading, setAlert, setModal, modal } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentUser) {
        await updateEmail(currentUser, emailRef.current!.value);
      }
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'Your email has been updated',
        timeout: 8000,
        location: 'main',
      });
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
        <DialogContentText>Please Enter your new email:</DialogContentText>
        <EmailField {...{ emailRef, defaultValue: currentUser?.email }} />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default ChangeEmail;
