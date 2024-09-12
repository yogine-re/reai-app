import { gapi } from 'gapi-script';
import initClientGoogleDrive from '@/gapi/gapi';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  signOut,
  UserCredential,
  User
} from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { auth } from '../firebase/config';
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalType {
  isOpen: boolean;
  title: string;
  content: any;
}

// Define an interface for the context value
export interface AuthContextType {
  googleApiClient: typeof gapi | null;
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
    isOpen: false,
    title: '',
    content: '',
  });
  const [alert, setAlert] = useState({
    isAlert: false,
    severity: 'info',
    message: '',
    timeout: 0,
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [currentFirebaseUser, setCurrentFirebaseUser] = useState<User | null>(
    null
  );
  const [googleApiClient, setGoogleApiClient] = useState<typeof gapi | null>(
    null
  );

  const signUp = (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  const login = (email: string, password: string): Promise<UserCredential> => {
    console.log('login');
    const credential = signInWithEmailAndPassword(auth, email, password);
    console.log('credential:', credential);
    const promiseUser = credential.then((cred) => cred.user);
    console.log('promiseUser:', promiseUser);
    promiseUser.then((user) => {
      console.log('firebase user:', user);
      setCurrentFirebaseUser(user);
    });
    return credential;
  };
  const loginWithGoogle = (): Promise<UserCredential> => {
    console.log('loginWithGoogle');
    const provider = new GoogleAuthProvider();
    const credential = signInWithPopup(auth, provider);
    const tokenPromise = credential.then((cred) => cred.user.getIdToken());
    tokenPromise.then((token) => {
      setAccessToken(token);
    });
    return credential;
  };

  const loginWithOauthGoogle = async (): Promise<void> => {
    console.log('loginWithOauthGoogle');
    if (!googleApiClient) {
      console.error('googleApiClient not initialized');
      return Promise.reject('googleApiClient not initialized');
    }
    // Exchange authorization code for tokens, see https://stackoverflow.com/questions/69727083/using-firebase-auth-gapi
    console.log('calling googleApiClient.auth2.getAuthInstance');
    const googleAuth = googleApiClient?.auth2.getAuthInstance();
    console.log('calling googleAuth.signIn');
    const googleUser = await googleAuth.signIn().catch((error: any) => { console.error('Error signing in:', error); });  
    if (!googleUser) {
      return Promise.reject('googleUser not set'); 
    }
    console.log('googleUser:', googleUser);
    const authResponse = googleUser.getAuthResponse();
    console.log('authResponse:', authResponse);
    const access_token = authResponse.access_token;
    const id_token = authResponse.id_token;
    console.log('access_token:', access_token);
    // Authenticate with Firebase using the ID token
    console.log('getting credential from GoogleAuthProvider');
    const credential = GoogleAuthProvider.credential(id_token);
    console.log('credential:', credential);
    console.log('signing in to firebase with credential');
    const firebaseUserCredential = await signInWithCredential(auth, credential);
    console.log('firebaseUserCredential:', firebaseUserCredential);
    console.log('firebaseUserCredential.user:', firebaseUserCredential.user);
    setAccessToken(access_token);
  };

  const logout = (): Promise<void> => {
    setCurrentFirebaseUser(null);
    return signOut(auth);
  };

  const resetPassword = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  const initGoogleApiClient = async () => {
    console.log('initGoogleApiClient');
    initClientGoogleDrive()
      .then((googleApiClient) => {
        setGoogleApiClient(googleApiClient);
      })
      .catch((error) =>
        console.error('Error initializing gapi client:', error)
      );
  };

  useEffect(() => {
    console.log('AuthContext::useEffect');
    if (!googleApiClient) {
      console.log('AuthContext::useEffect: initializing googleApiClient');
      initGoogleApiClient();
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('user status changed:', user);
      console.log('user status changed: firebase user:', user);
      setCurrentFirebaseUser(user);
      console.log('user status changed: firebase user:', user);
    });
    return unsubscribe;
  }, []);
  const data: AuthContextType = {
    googleApiClient,
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
    resetPassword,
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