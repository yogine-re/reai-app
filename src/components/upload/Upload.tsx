// import { useState } from 'react';
// import UploadForm from './UploadForm';
import { useAppData } from '../../context/AppContext';
import ProgressList from './progressList/ProgressList';
import Stack from '@mui/material/Stack';
const Upload: React.FC = () => {
  const { filesToUpload } = useAppData();

  // const [files, setFiles] = useState<File[]>([]);
  return (
    <div>
      <Stack direction="column" spacing={2} justifyContent="space-between">
        {/* <UploadForm setFiles={setFiles} /> */}
        <ProgressList files={filesToUpload} />
      </Stack>
    </div>
  );
};
export default Upload;
