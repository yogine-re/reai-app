import { TextField } from '@mui/material';
type EmailFieldProps = {
  emailRef: React.RefObject<HTMLInputElement>;
  defaultValue?: string;
};

const EmailField: React.FC<EmailFieldProps> = ({ emailRef, defaultValue = '' }) => {
  return (
    <TextField
      autoFocus
      margin='normal'
      variant='standard'
      id='email'
      label='Email Address'
      type='email'
      fullWidth
      required
      inputRef={emailRef}
      defaultValue={defaultValue}
    />
  );
};
export default EmailField;
