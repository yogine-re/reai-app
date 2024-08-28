import { Send } from '@mui/icons-material';
import { Button } from '@mui/material';
const SubmitButton: React.FC = () => {
  return (
    <Button variant='contained' endIcon={<Send />} type='submit'>
      Submit
    </Button>
  );
};
export default SubmitButton;
