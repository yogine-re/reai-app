import { Add } from '@mui/icons-material';
import { Fab, Input } from '@mui/material';
import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Login from '../user/Login';
type FormProps = {
  setFiles: any;
};

const Form: React.FC<FormProps> = ({ setFiles }) => {
  const { currentFirebaseUser, setModal } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (!currentFirebaseUser) {
      return setModal({ isOpen: true, title: 'Login', content: <Login /> });
    }
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...e.target.files]);
    }
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };
  return (
    <form>
      <Input
        type="file"
        inputProps={{ multiple: true }}
        sx={{ display: 'none' }}
        inputRef={fileRef}
        onChange={handleChange}
      />
      <Fab color="primary" aria-label="add" onClick={handleClick}>
        <Add fontSize="large" />
      </Fab>
    </form>
  );
};
export default Form;
