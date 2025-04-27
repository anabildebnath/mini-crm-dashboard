import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadCSV } from '../api/customers';
import { AppSidebar } from '../components/app-sidebar.jsx';
import { SidebarInset, SidebarProvider } from '../components/ui/sidebar.jsx';
import { SiteHeader } from '../components/site-header.jsx';
import { Button } from '../components/ui/button.jsx';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => setFile(e.target.files[0]);

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    uploadCSV(formData, e => setProgress(Math.round((e.loaded / e.total) * 100)))
      .then(res => {
        setSummary(res.data);
        setTimeout(() => {
          setSummary(null);
          navigate('/customers');
        }, 10000);
      })
      .catch(console.error);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">Upload Customers CSV</h1>
          <Button className="w-100 mr-10 bg-gray-600 text-white rounded"><input type="file" accept=".csv" onChange={handleChange} />
          {file && <p className="mt-2">Selected: {file.name}</p>}</Button>
          <button
            onClick={handleUpload}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Upload
          </button>

          {progress > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                <div
                  className="h-3 bg-green-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2">Progress: {progress}%</p>
            </div>
          )}

          {summary && (
            <div className="fixed top-4 right-4 bg-white shadow-lg p-4 rounded">
              <h2 className="font-semibold mb-2">Upload Summary</h2>
              <ul className="space-y-1 text-sm">
                <li>Total: {summary.total}</li>
                <li>Processed: {summary.processed}</li>
                <li>Skipped: {summary.skipped}</li>
                <li>Failed: {summary.failed}</li>
              </ul>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}