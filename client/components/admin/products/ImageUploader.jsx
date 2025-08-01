'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

// This is the final, correct version of the ImageUploader.
export default function ImageUploader({ value = [], onChange, multiple = true }) {
  const [isUploading, setIsUploading] = useState(false);

  // This onDrop function uses the robust "batch update" pattern.
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    const token = useAuthStore.getState().token;

    if (!token) {
      toast.error('Authentication error. Please log in again.');
      setIsUploading(false);
      return;
    }

    try {
      // 1. Get a single signature for the entire batch.
      const signatureResponse = await axios.post('/api/admin/upload/signature', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { timestamp, signature, apiKey, cloudName, folder, eager } = signatureResponse.data;

      // 2. Create an array of upload promises to run in parallel.
      const uploadPromises = acceptedFiles.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('eager', eager);
        formData.append('folder', folder);
        
        return axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
      });
      
      // 3. Wait for ALL uploads to complete.
      const uploadResults = await Promise.all(uploadPromises);
      const newUrls = uploadResults.map(res => res.data.secure_url);

      // 4. Perform a SINGLE, ATOMIC state update.
      if (newUrls.length > 0) {
        if (multiple) {
          // If in multiple mode, APPEND all new URLs.
          onChange([...value, ...newUrls]);
        } else {
          // If in single mode, REPLACE the value with the new URL(s).
          onChange(newUrls);
        }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'One or more image uploads failed.';
      toast.error(errorMessage);
      console.error('Upload process error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, multiple]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: multiple,
    maxFiles: multiple ? undefined : 1,
  });
  
  const handleRemoveImage = (e, urlToRemove) => {
    e.stopPropagation();
    onChange(value.filter(url => url !== urlToRemove));
  };

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border'
        }`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center h-24">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
            </>
          )}
        </div>
      </div>
      
      {value?.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {[...new Set(value)].map((url) => (
            <div key={url} className="relative aspect-square rounded-md overflow-hidden group">
              <Image src={url} alt="Uploaded preview" fill sizes="10vw" className="object-cover" />
              <button
                type="button"
                onClick={(e) => handleRemoveImage(e, url)}
                className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
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