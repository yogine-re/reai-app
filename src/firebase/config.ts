// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_apiKey,
//   authDomain: process.env.REACT_APP_authDomain,
//   projectId: process.env.REACT_APP_projectId,
//   storageBucket: process.env.REACT_APP_storageBucket,
//   messagingSenderId: process.env.REACT_APP_messagingSenderId,
//   appId: process.env.REACT_APP_appId,
// };
const firebaseConfig = {
  apiKey: 'AIzaSyDfTXCAcT90y0Dy8JzPvxsfb8l3t0HdcHc',
  authDomain: 'fir-demo-e5eec.firebaseapp.com',
  databaseURL: 'https://fir-demo-e5eec.firebaseio.com',
  projectId: 'fir-demo-e5eec',
  storageBucket: 'fir-demo-e5eec.appspot.com',
  messagingSenderId: '616954384014',
  appId: '1:616954384014:web:f604eb29d2809a18c7c3df'
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore();
export const auth = getAuth();
