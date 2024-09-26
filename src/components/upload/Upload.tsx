import { useState } from 'react';
import Form from './Form';
import ProgressList from './progressList/ProgressList';
import Stack from '@mui/material/Stack';
const Upload: React.FC = () => {
  const [files, setFiles] = useState([]);
  return (
    <div>
      <Stack direction="column" spacing={2} justifyContent="space-between">
        <Form setFiles={setFiles} />
        <ProgressList files={files} />
      </Stack>
    </div>
  );
};
export default Upload;
