import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';
const uploadFile = (file: File, filePath: string) => {
  return new Promise(async (resolve, reject) => {
    const storageRef = ref(storage, filePath);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      resolve(url);
    } catch (error: unknown) {
      reject(error);
    }
  });
};
export default uploadFile;
