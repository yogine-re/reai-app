import { Close } from '@mui/icons-material';
import { Alert, Box, Button, Collapse, IconButton } from '@mui/material';
import { sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '@/utils';

const Verification = () => {
  const { currentFirebaseUser, setAlert, setLoading } = useAuth();
  const [open, setOpen] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  const verify = async () => {
    setIsClicked(true);
    setLoading(true);

    try {
      await sendEmailVerification(currentFirebaseUser);
      setAlert({
        isAlert: true,
        severity: 'info',
        message: 'verification link has been sent to your email inbox',
        timeout: 8000,
        location: 'main',
      });
    } catch (error: unknown) {
      setAlert({
        isAlert: true,
        severity: 'error',
        message: getErrorMessage(error),
        timeout: 8000,
        location: 'main',
      });
      console.log(error);
    }

    setLoading(false);
  };
  return (
    currentFirebaseUser?.emailVerified === false && (
      <Box>
        <Collapse in={open}>
          <Alert
            severity="warning"
            action={
              <IconButton
                aria-label="Close"
                size="small"
                onClick={() => setOpen(false)}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 3 }}
          >
            Your email has not been verified yet!
            <Button
              size="small"
              onClick={verify}
              disabled={isClicked}
              sx={{ lineHeight: 'initial' }}
            >
              verify Now
            </Button>
          </Alert>
        </Collapse>
      </Box>
    )
  );
};

export default Verification;
