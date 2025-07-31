'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { UploadCloud, X } from 'lucide-react';

export default function ImageUploader({ value = [], onChange }) {
  const [isUploading, setIsUploading] = useState(false);

  // THIS onDrop FUNCTION IS NOW CORRECT AND ROBUST
  const onDrop = useCallback(async (acceptedFiles) => {
    setIsUploading(true);
    const token = useAuthStore.getState().token;

    if (!token) {
      toast.error('Authentication error. Please log in again.');
      setIsUploading(false);
      return;
    }

    try {
      // 1. Get a single signature for the entire batch of uploads.
      const signatureResponse = await axios.post('/api/admin/upload/signature', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    
      const { timestamp, signature, apiKey, cloudName, folder, eager } = signatureResponse.data;

      // 2. Create an array of upload promises.
      const uploadPromises = acceptedFiles.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('eager', eager);
        formData.append('folder', folder);

        return axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
      });

      // 3. Execute all uploads in parallel.
      const uploadResults = await Promise.all(uploadPromises);
      
      // 4. Collect all the new, successful URLs.
      const newUrls = uploadResults.map(res => res.data.secure_url);

      // 5. Perform a SINGLE state update with all the new URLs.
      if (newUrls.length > 0) {
        onChange((currentValue) => [...currentValue, ...newUrls]);
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'One or more image uploads failed.';
      toast.error(errorMessage);
      console.error('Upload process error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    multiple: true,
  });
  
  const handleRemoveImage = (e, urlToRemove) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(value.filter(url => url !== urlToRemove));
  };


  return (
    <div>
      <label className="block text-sm font-medium mb-2">Product Images</label>
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
          {isUploading ? <p>Uploading...</p> : isDragActive ? <p className="font-semibold text-primary">Drop files here...</p> : <p>Drag 'n' drop or click to select files</p>}
        </div>
      </div>
      
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {/* Use a Set to prevent rendering duplicates if state is momentarily inconsistent */}
          {[...new Set(value)].map((url) => (
            <div key={url} className="relative aspect-square rounded-md overflow-hidden group">
              <img src={url} alt="Uploaded product" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => handleRemoveImage(e, url)}
                className="absolute top-1 right-1 bg-red-600/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}