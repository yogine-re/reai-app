import { Send } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material';
import { deleteUser } from 'firebase/auth';
import { useAuth } from '../../../context/AuthContext';
import deleteUserFiles from '../../../firebase/deleteUserFiles';
import { getErrorMessage } from '@/utils';

const DeleteAccount: React.FC = () => {
  const { currentUser, setLoading, setAlert, setModal, modal } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteUserFiles('gallery', currentUser);
      if (currentUser)
        await deleteUser(currentUser);
      setModal({ ...modal, isOpen: false });
      setAlert({
        isAlert: true,
        severity: 'success',
        message: 'Your account has been deleted',
        timeout: 8000,
        location: 'main'
      });
    } catch (error: unknown) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: getErrorMessage(error),
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
        <DialogContentText>
          Are you sure you want to delete your account? This action will delete
          all of your files and records
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' endIcon={<Send />} type='submit'>
          Confirm
        </Button>
      </DialogActions>
    </form>
  );
};
export default DeleteAccount;
