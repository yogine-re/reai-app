import { gapi } from 'gapi-script';
import {initClientGoogleApi as gapiInitialize} from '@/gapi/gapi';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  // signOut,
  UserCredential,
  User
} from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { auth } from '../firebase/config';
import { googleLogout, TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { UUID } from 'crypto';
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalType {
  isOpen: boolean;
  title: string;
  content: any;
}

export declare interface UserInfo {
  readonly displayName: string | null;
  readonly email: string | null;
  readonly phoneNumber: string | null;
  readonly photoURL: string | null;
  readonly providerId: string;
  readonly uid: string;
}

export interface UserOauth {
  authToken: TokenResponse;
  providerData: UserInfo[];
  photoURL: string;
  displayName: string;
  uid: UUID;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
}

// Define an interface for the context value
export interface AuthContextType {
  currentUser: UserOauth | null;
  currentFirebaseUser: User | null;
  accessToken: string;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithOauthGoogle: () => void;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  // Add other methods or properties as needed
  loading: boolean;
  setLoading: (loading: boolean) => void;
  modal: ModalType;
  setModal: (modal: ModalType) => void;
  alert: {
    isAlert: boolean;
    severity: string;
    message: string;
    timeout: number;
    location: string;
  };
  setAlert: (alert: {
    isAlert: boolean;
    severity: string;
    message: string;
    timeout: number;
    location: string;
  }) => void;
}

const authContext: React.Context<AuthContextType> = createContext<AuthContextType>(null as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false, title: '', content: ''
  });
  const [alert, setAlert] = useState({
    isAlert: false,
    severity: 'info',
    message: '',
    timeout: 0,
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [currentFirebaseUser, setCurrentFirebaseUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<UserOauth | null>(null);

  const signUp = (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const login = (email: string, password: string): Promise<UserCredential> => {
    console.log('logging in');
    const credential = signInWithEmailAndPassword(auth, email, password);
    console.log('credential:', credential);
    const promiseUser = credential.then(cred => cred.user );
    console.log('promiseUser:', promiseUser);
    promiseUser.then(user => {
      console.log('firebase user:', user);
      setCurrentFirebaseUser(user);
    });
    return credential;
  };
  const loginWithGoogle = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    const credential = signInWithPopup(auth, provider);
    const tokenPromise = credential.then(cred => cred.user.getIdToken());
    tokenPromise.then(token => {      
      setAccessToken(token);     
    });
    return credential;
  };
  const loginWithOauthGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log('Login Success, codeResponse:', codeResponse);
      const tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'> = codeResponse;
      const user: UserOauth = {} as UserOauth;
      user.authToken = tokenResponse;
      setAccessToken(tokenResponse.access_token);

      // fetching userinfo can be done on the client or the server
      const userInfoResponse = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
      const userInfo = userInfoResponse.data;
      console.log('userInfoResponse:', userInfoResponse);
      console.log('userInfo:', userInfo);
      user.providerData = user.providerData ? [...user.providerData, userInfo] : [userInfo];
      user.displayName = userInfo.name;
      user.email = userInfo.email;
      user.emailVerified = userInfo.email_verified;
      user.phoneNumber = userInfo.phone_number;
      user.photoURL = userInfo.picture;
      user.uid = userInfo.sub;
      console.log('user oauth google:', user);
      // Exchange authorization code for tokens
      await gapiInitialize();
      console.log('calling gapi.auth2.getAuthInstance');
      const googleAuth = gapi.auth2.getAuthInstance();
      console.log('calling googleAuth.signIn');
      const googleUser = await googleAuth.signIn();
      console.log('googleUser:', googleUser);
      const id_token = googleUser.getAuthResponse().id_token;
      console.log('id_token:', id_token);
      // const id_token = userInfoResponse.getAuthResponse().id_token;
      console.log('id_token:', id_token);
      // Authenticate with Firebase using the ID token
      console.log('getting credential from GoogleAuthProvider');
      const credential = GoogleAuthProvider.credential(id_token);
      console.log('credential:', credential);
      console.log('signing in to firebase with credential');
      const firebaseUserCredential = await signInWithCredential(auth, credential);
      console.log('firebaseUserCredential:', firebaseUserCredential);
      setCurrentFirebaseUser(firebaseUserCredential.user);
      setCurrentUser(user);
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const logout = (): void => {
    setCurrentUser(null);
    return googleLogout();
  };
  const resetPassword = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };
  useEffect(() => {
    console.log('AuthContext::useEffect');
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log('user status changed:', user);
      console.log('user status changed: firebase user:', currentFirebaseUser);  
      setCurrentFirebaseUser(user);
      console.log('user status changed: firebase user:', currentFirebaseUser); 
      console.log('user status changed: user:', currentUser); 
    });
    return unsubscribe;
  }, []);
  const data: AuthContextType = {
    currentUser,
    currentFirebaseUser,
    accessToken,
    signUp,
    login,
    logout,
    modal,
    setModal,
    loginWithGoogle,
    loginWithOauthGoogle,
    alert,
    setAlert,
    loading,
    setLoading,
    resetPassword
  };
  return <authContext.Provider value={data}>{children}</authContext.Provider>;
};

export default AuthContextType;
export const useAuth = (): AuthContextType => {
  // console.log('useAuth');
  // console.log('authContext:', authContext);
  const result = useContext(authContext);
  return result;

};