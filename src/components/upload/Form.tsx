import { FileUpload } from '@mui/icons-material';
// import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
// import { Fab, Input } from '@mui/material';
import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Login from '../user/Login';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: 0,
});

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
      <Button
        size='small'
        component='label'
        role={undefined}
        variant='outlined'
        tabIndex={-1}
        startIcon={<FileUpload/>}
      >
        Upload files
        <VisuallyHiddenInput type='file' onChange={handleChange} onClick={handleClick} multiple />
      </Button>
      {/* <Input
        type='file'
        inputProps={{ multiple: true }}
        sx={{ display: 'none' }}
        inputRef={fileRef}
        onChange={handleChange}
      />
      <Fab size='small' color='primary' aria-label='add' onClick={handleClick}>
        <Add fontSize='small' />
      </Fab> */}
    </form>
  );
};
export default Form;
