import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';
import deleteDocument from './deleteDocument';
import deleteFile from './deleteFile';
import { User } from 'firebase/auth';

const deleteUserFiles = (collectionName: string, currentFirebaseUser: User): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    const q = query(
      collection(db, collectionName),
      where('uid', '==', currentFirebaseUser.uid)
    );
    try {
      console.log('getDocs query:', q);
      console.log('query uid == ' + currentFirebaseUser.uid);
      console.log('collectionName:', collectionName);
      const snapshot = await getDocs(q);
      const storePromises: Promise<void>[] = [];
      const storagePromises: Promise<void>[] = [];
      snapshot.forEach((document) => {
        console.log('deleting document:', document.id);
        storePromises.push(deleteDocument(collectionName, document.id));
        console.log('deleting file:', `${collectionName}/${currentFirebaseUser.uid}/${document.id}`); 
        storagePromises.push(
          deleteFile(`${collectionName}/${currentFirebaseUser.uid}/${document.id}`)
        );
      });
      await Promise.all(storePromises);
      await Promise.all(storagePromises);

      if (currentFirebaseUser?.photoURL) {
        const photoName = currentFirebaseUser?.photoURL
          ?.split(`${currentFirebaseUser.uid}%2F`)[1]
          ?.split('?')[0];
        if (photoName) {
          try {
            await deleteFile(`profile/${currentFirebaseUser.uid}/${photoName}`);
          } catch (error: unknown) {
            console.log(error);
          }
        }
      }

      resolve();
    } catch (error: unknown) {
      reject(error);
    }
  });
};

export default deleteUserFiles;
