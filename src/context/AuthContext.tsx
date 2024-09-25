import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  // signInWithPopup,
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
import { useAppData } from '../context/AppContext';
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalType {
  isOpen: boolean;
  title: string;
  content: any;
}

// Define an interface for the context value
export interface AuthContextType {
  currentFirebaseUser: User | null;
  accessToken: string;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
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
  const { googleApi } = useAppData();

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


  const signUp = (email: string, password: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  const login = (email: string, password: string): Promise<UserCredential> => {
    const credential = signInWithEmailAndPassword(auth, email, password);
    const promiseUser = credential.then((cred) => cred.user);
    promiseUser.then((user) => {
      setCurrentFirebaseUser(user);
    });
    return credential;
  };

  const loginWithGoogle = async (): Promise<UserCredential> => {
    if (!googleApi) {
      return Promise.reject('googleApi not initialized');
    }
    // Exchange authorization code for tokens, see https://stackoverflow.com/questions/69727083/using-firebase-auth-gapi
    const googleAuth = googleApi?.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn().catch((error: any) => { console.error('Error signing in:', error); });  
    if (!googleUser) {
      return Promise.reject('googleUser not set'); 
    }
    const authResponse = googleUser.getAuthResponse();
    const access_token = authResponse.access_token;
    const id_token = authResponse.id_token;
    // Authenticate with Firebase using the ID token
    const credential = GoogleAuthProvider.credential(id_token);
    const firebaseUserCredential = await signInWithCredential(auth, credential);
    setAccessToken(access_token);
    return firebaseUserCredential;
  };

  const logout = (): Promise<void> => {
    setCurrentFirebaseUser(null);
    return signOut(auth);
  };

  const resetPassword = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentFirebaseUser(user);
    });
    return unsubscribe;
  }, []);
  const data: AuthContextType = {
    currentFirebaseUser,
    accessToken,
    signUp,
    login,
    logout,
    modal,
    setModal,
    loginWithGoogle,
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
  const result = useContext(authContext);
  return result;

};