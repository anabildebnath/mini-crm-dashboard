/* File: src/pages/Upload.jsx */
import React, { useState } from 'react';
import { uploadCSV } from '../api/customers';

export default function Upload() {
  const [file,setFile]=useState(null);
  const [progress,setProgress]=useState(0);
  const [summary,setSummary]=useState(null);
  const handleChange=e=>setFile(e.target.files[0]);
  const handleUpload=()=>{
    if(!file) return;
    const formData=new FormData();formData.append('file',file);
    uploadCSV(formData,e=>setProgress(Math.round((e.loaded/e.total)*100)))
      .then(res=>setSummary(res.data));
  };
  return(
    <div className="p-6 bg-gray-50 min-h-screen max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Upload Customers CSV</h1>
      <input type="file" accept=".csv" onChange={handleChange} />
      {file&&<p className="mt-2">Selected: {file.name}</p>}
      <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Upload</button>
      {progress>0&&(
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded h-4"><div className="h-4 bg-green-500" style={{width:`${progress}%`}}/></div>
          <p className="mt-2">Progress: {progress}%</p>
        </div>
      )}
      {summary&&(
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Upload Summary</h2>
          <ul className="mt-2 space-y-1">
            <li>Total: {summary.total}</li>
            <li>Processed: {summary.processed}</li>
            <li>Skipped: {summary.skipped}</li>
            <li>Failed: {summary.failed}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
