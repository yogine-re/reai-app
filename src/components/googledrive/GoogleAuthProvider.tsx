import React from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

interface GoogleAuthProviderProps {
  onSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  onFailure: (response: any) => void;
}

const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ onSuccess, onFailure }) => {
  return (
	<GoogleLogin
	  clientId={CLIENT_ID}
	  buttonText="Login with Google"
	  onSuccess={onSuccess}
	  onFailure={onFailure}
	  cookiePolicy={'single_host_origin'}
	  scope="https://www.googleapis.com/auth/drive.file"
	/>
  );
};

export default GoogleAuthProvider;