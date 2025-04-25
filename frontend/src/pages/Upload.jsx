import React, { useState } from 'react';
import { uploadCSV } from '../api/customers';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    await uploadCSV(formData, (e) => {
      setProgress(Math.round((100 * e.loaded) / e.total));
    });
  };

  return (
    <div>
      <h1>Upload CSV</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>Progress: {progress}%</div>
    </div>
  );
};

export default Upload;
