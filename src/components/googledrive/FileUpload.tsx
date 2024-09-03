import { google } from 'googleapis';
import { useAuth } from '../../context/AuthContext';

const FileUpload: React.FC = () => {
	const { currentUserOauthGoogle } = useAuth();


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
	if (!currentUserOauthGoogle) {
	  console.error('User is not authenticated');
	  return;
	}

	const file = event.target.files?.[0];
	if (!file) {
	  console.error('No file selected');
	  return;
	}

	const authToken = currentUserOauthGoogle.authToken.access_token;
	const drive = google.drive({
	  version: 'v3',
	  auth: authToken,
	});

	const formData = new FormData();
	formData.append('metadata', new Blob([JSON.stringify({ name: file.name })], { type: 'application/json' }));
	formData.append('file', file);

	try {
	  const response = await drive.files.create({
		requestBody: {
		  name: file.name,
		  mimeType: file.type,
		},
		media: {
		  mimeType: file.type,
		  body: file,
		},
		fields: 'id',
	  });

	  console.log('File uploaded successfully:', response.data);
	} catch (error) {
	  console.error('Error uploading file:', error);
	}
  };

  return (
	<div>
	  {currentUserOauthGoogle && (
		<div>
		  <input type="file" onChange={handleFileUpload} />
		</div>
	  )}
	</div>
  );
};

export default FileUpload;