import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useRef, RefObject } from 'react';
import { useAuth, AuthContextType } from '../../context/AuthContext';
import EmailField from './inputs/EmailField';
import SubmitButton from './inputs/SubmitButton';

const ResetPassword: React.FC = () => {
  const { setLoading, setAlert, setModal, modal, resetPassword } = useAuth() as AuthContextType;
  const emailRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (emailRef.current && emailRef.current.value !== '') {
        await resetPassword(emailRef.current?.value);
      }
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'reset link has been sent to your email inbox',
        timeout: 8000,
        location: 'main',
      });
    } catch (error: unknown) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: (error as Error).message,
        timeout: 5000,
        location: 'modal',
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <DialogContentText>Please enter your email address:</DialogContentText>
        <EmailField {...{ emailRef }} />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};

export default ResetPassword;
