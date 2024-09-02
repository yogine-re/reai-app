import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
  User,
   // Add this line
} from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { auth } from '../firebase/config';
import { /*googleLogout, */TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalType {
  isOpen: boolean;
  title: string;
  content: any;
}

export interface OauthGoogleUserType {
  authToken: TokenResponse;
  userInfo: any;
}

// Define an interface for the context value
export interface AuthContextType {
  currentUser: User | null;
  currentOauthGoogleUser: OauthGoogleUserType | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithOauthGoogle: () => void;
  logout: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentOauthGoogleUser, setCurrentOauthGoogleUser] = useState<OauthGoogleUserType | null>(null);

  const signUp = (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const login = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const loginWithGoogle = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  const loginWithOauthGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const tokenResponse: Omit<TokenResponse, 'error' | 'error_description' | 'error_uri'> = codeResponse;
      const user: OauthGoogleUserType = {} as OauthGoogleUserType;
      user.authToken = tokenResponse;
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);
      user.userInfo = userInfo;
      console.log(userInfo);
      setCurrentOauthGoogleUser(user);
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const logout = (): Promise<void> => {
    return signOut(auth);
  };
  const resetPassword = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      console.log('user status changed: ', user);
    });
    return unsubscribe;
  }, []);
  const data: AuthContextType = {
    currentUser,
    currentOauthGoogleUser,
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
  console.log('useAuth');
  console.log('authContext:', authContext);
  const result = useContext(authContext);
  console.log('result.currentUser:', result.currentUser);
  return result;

};