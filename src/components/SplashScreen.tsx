import { Backdrop, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const SplashScreen: React.FC = () => {
  console.log('SplashScreen');
  const { loading } = useAuth();
  console.log('loading:', loading);
  return (
    <Backdrop
      open={loading || false}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 999 }}
    >
      <CircularProgress sx={{ color: 'white' }} />
    </Backdrop>
  );
};

export default SplashScreen;
