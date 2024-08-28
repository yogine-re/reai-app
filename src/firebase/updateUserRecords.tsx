import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './config';
/* eslint-disable @typescript-eslint/no-explicit-any */
const updateUserRecords = (collectionName: string, uid: string, updatedObj: any): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    const q = query(collection(db, collectionName), where('uid', '==', uid));
    try {
      const snapshot = await getDocs(q);
      const updatePromises: Promise<void>[] = [];
      snapshot.forEach(document => {
        updatePromises.push(
          updateDoc(doc(db, collectionName, document.id), updatedObj)
        );
      });
      await Promise.all(updatePromises);
      resolve();
    } catch (error: unknown) {
      reject(error);
    }
  });
};
export default updateUserRecords;
