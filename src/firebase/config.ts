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
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAVehAAb-VjAj9GK3N0mtjQh5pRGB3Nctk',
  authDomain: 'quickstart-1552678901710.firebaseapp.com',
  projectId: 'quickstart-1552678901710',
  storageBucket: 'quickstart-1552678901710.appspot.com',
  messagingSenderId: '644581676766',
  appId: '1:644581676766:web:d21a10bbf4360a1f41d44f'
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore();
export const auth = getAuth();
