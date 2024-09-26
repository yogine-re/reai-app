import { FileUpload } from '@mui/icons-material';
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
    console.log('handleChange', e.target.files);
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
        type='file'
        inputProps={{ multiple: true }}
        sx={{ display: 'none' }}
        inputRef={fileRef}
        onChange={handleChange}
      />  
      <Fab
        variant='extended'
        size='small'
        onClick={handleClick}
        sx={{
          textTransform: 'none',
          borderRadius: '8px',
          fontSize: '0.70rem', // Smaller font size
          padding: '2px 8px', // Smaller padding
          backgroundColor: 'transparent', // No background color
          border: '1px solid', // Add border
          borderColor: 'currentColor', // Use current text color for the border
          marginLeft: '16px', // Move the button to the right
          marginTop: '16px', // Move the button down
        }}
      >        
         <FileUpload sx={{ mr: 1 }} fontSize='small'/>
            Upload Files
      </Fab>
    </form>
  );
};
export default Form;
