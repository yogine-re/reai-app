import { Close } from '@mui/icons-material';
import { Alert, Box, Collapse, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertColor } from '@mui/material/Alert';
const Notify: React.FC = () => {
  const alertRef = useRef();
  const {
    alert: { isAlert, severity, message, timeout },
    setAlert
  } = useAuth();
  useEffect(
    () => {
      (alertRef.current as unknown as HTMLElement)?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
      let timer: NodeJS.Timeout;
      if (timeout) {
        timer = setTimeout(() => {
          setAlert({ ...alert, isAlert: false, severity: '', message: '', timeout: 0, location: '' });
        }, timeout);
      }
      return () => clearTimeout(timer);
    },
    [timeout]
  );
  return (
    <Box sx={{ mb: 2 }} ref={alertRef}>
      <Collapse in={isAlert}>
        <Alert
          severity={severity as AlertColor}
          action={
            <IconButton
              aria-label='Close'
              size='small'
              onClick={() => setAlert({ isAlert: false, severity, message, timeout, location: location.toString() })}
            >
              <Close fontSize='small' />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};
export default Notify;
