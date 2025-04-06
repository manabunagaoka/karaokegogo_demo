import React, { useState, useCallback } from 'react';
import { uploadFileInChunks } from '../utils/uploadUtils';

interface FileUploaderProps {
  onUploadComplete: (fileUrl: string) => void;
  onError?: (error: Error) => void;
  accept?: string;
  maxSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onError,
  accept = "audio/*",
  maxSizeMB = 50
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size validation
    if (file.size > maxSizeBytes) {
      const error = new Error(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
      onError?.(error);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Upload the file using our chunked upload utility
      const fileUrl = await uploadFileInChunks(file, (progressPercentage) => {
        setProgress(progressPercentage);
      });

      onUploadComplete(fileUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      onError?.(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
      // Reset the input value so the same file can be uploaded again if needed
      event.target.value = '';
    }
  }, [maxSizeBytes, maxSizeMB, onError, onUploadComplete]);

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        disabled={isUploading}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className={`upload-button ${isUploading ? 'uploading' : ''}`}
      >
        {isUploading ? `Uploading... ${progress}%` : 'Select Audio File'}
      </label>
      
      {isUploading && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <style jsx>{`
        .file-uploader {
          width: 100%;
          max-width: 400px;
          margin-bottom: 1rem;
        }
        
        .hidden {
          display: none;
        }
        
        .upload-button {
          display: block;
          padding: 0.75rem 1.5rem;
          background-color: #4F46E5;
          color: white;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.3s;
        }
        
        .upload-button:hover {
          background-color: #4338CA;
        }
        
        .upload-button.uploading {
          background-color: #6B7280;
          cursor: not-allowed;
        }
        
        .progress-bar-container {
          width: 100%;
          height: 6px;
          background-color: #E5E7EB;
          border-radius: 3px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #4F46E5;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default FileUploader;