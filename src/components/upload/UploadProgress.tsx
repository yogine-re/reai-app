// import { useState } from 'react';
// import UploadForm from './UploadForm';
import { useAppData } from '../../context/AppContext';
import ProgressList from './progressList/ProgressList';
const UploadProgress: React.FC = () => {
  const { filesToUpload } = useAppData();

  return (
    <div>
        <ProgressList files={filesToUpload} />
    </div>
  );
};
export default UploadProgress;
