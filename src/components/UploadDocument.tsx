// src/components/UploadDocument.tsx
import React, { useState } from 'react';

const UploadDocument: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            // Implement the file upload logic here
            console.log('Uploading file:', file.name);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <div>
            <h1>Upload Document</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadDocument;