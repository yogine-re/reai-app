import { DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { updatePassword } from 'firebase/auth';
import { useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PasswordField from '../inputs/PasswordField';
import SubmitButton from '../inputs/SubmitButton';
const ChangePassword = () => {
  const { currentFirebaseUser, setLoading, setAlert, setModal, modal } = useAuth();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
        throw new Error('Passwords do not match');
      }
      if (currentFirebaseUser) {
        if (passwordRef.current) {
          await updatePassword(currentFirebaseUser, passwordRef.current.value);
        }
      }
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'Your password has been updated',
        timeout: 8000,
        location: 'main'
      });
    } catch (error: unknown) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: (error as Error).message,
        timeout: 5000,
        location: 'modal'
      });
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <DialogContentText>Please Enter your new Password:</DialogContentText>
        <PasswordField {...{ passwordRef }} />
        <PasswordField
          {...{
            passwordRef: confirmPasswordRef,
            id: 'confirmPassword',
            label: 'Confirm Password',
            autoFocus: false
          }}
        />
      </DialogContent>
      <DialogActions>
        <SubmitButton />
      </DialogActions>
    </form>
  );
};
export default ChangePassword;
