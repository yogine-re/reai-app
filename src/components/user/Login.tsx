import { Google } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material';
import { useEffect, useState, useRef, RefObject } from 'react';
import { useAuth } from '../../context/AuthContext';
import EmailField from './inputs/EmailField';
import PasswordField from './inputs/PasswordField';
import SubmitButton from './inputs/SubmitButton';
import ResetPassword from './ResetPassword';
import { getErrorMessage } from '../../utils';
// import { GoogleLogin } from '@react-oauth/google';


const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>();
  const confirmPasswordRef = useRef<HTMLInputElement>();
  const [isRegister, setIsRegister] = useState(false);
  const {
    modal,
    setModal,
    signUp,
    login,
    // loginWithGoogle,
    loginWithOauthGoogle,
    setAlert,
    setLoading
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';
    if (isRegister) {
      const confirmPassword = confirmPasswordRef.current?.value;
      try {
        if (password !== confirmPassword) {
          throw new Error('Passwords don\'t match');
        }
        await signUp(email, password);
        setModal({ ...modal, isOpen: false });
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
    } else {
      try {
        await login(email, password);
        setModal({ ...modal, isOpen: false });
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
    }
    setLoading(false);
  };
  // const handleGoogleLogin = async () => {
  //   try {
  //     await loginWithGoogle();
  //     setModal({ ...modal, isOpen: false });
  //   } catch (error: unknown) {
  //     setAlert({
  //       isAlert: true,
  //       severity: 'error',
  //       message: getErrorMessage(error),
  //       timeout: 5000,
  //       location: 'modal'
  //     });
  //     console.log(error);
  //   }
  // };

  const handleOauthGoogleLogin = async () => {
    try {
      await loginWithOauthGoogle();
      setModal({ ...modal, isOpen: false });
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
  };
  useEffect(
    () => {
      if (isRegister) {
        setModal({ ...modal, title: 'Register' });
      } else {
        setModal({ ...modal, title: 'Login' });
      }
    },
    [isRegister]
  );
  return (
    <>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <DialogContentText>
            Please enter your email and your password here:
          </DialogContentText>
          <EmailField {...{ emailRef }} />
          <PasswordField {...{ passwordRef: passwordRef as RefObject<HTMLInputElement>, autoFocus: false }} />
          {isRegister && (
            <PasswordField
              {...{
                passwordRef: confirmPasswordRef as RefObject<HTMLInputElement>,
                id: 'confirmPassword',
                label: 'Confirm Password',
                autoFocus: false
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: '19px' }}>
          <Button
            size='small'
            onClick={() =>
              setModal({
                ...modal,
                title: 'Reset Password',
                content: <ResetPassword />
              })
            }
          >
            Forgot Password?
          </Button>
          <SubmitButton />
        </DialogActions>
      </form>
      <DialogActions sx={{ justifyContent: 'left', p: '5px 24px' }}>
        {isRegister
          ? 'Do you have an account? Sign in now'
          : 'Don\'t you have an account? Create one now'}
        <Button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Login' : 'Register'}
        </Button>
      </DialogActions>
      <DialogActions sx={{ justifyContent: 'center', py: '24px' }}>
        {/* <Button
          variant='outlined'
          startIcon={<Google />}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button> */}
        <Button
          variant='outlined'
          startIcon={<Google />}
          onClick={handleOauthGoogleLogin}
        >
          Login with Oauth Google 🚀
        </Button>
      </DialogActions>
    </>
  );
};
export default Login;
