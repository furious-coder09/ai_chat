import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import { FileWithPreview } from '../types';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedFiles?: string[];
}

export function FileUpload({ onFileSelect, acceptedFiles }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    onFileSelect(filesWithPreview);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles ? Object.fromEntries(acceptedFiles.map(type => [type, []])) : undefined
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the files here..."
          : "Drag 'n' drop files here, or click to select files"}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports images, videos, and audio files
      </p>
    </div>
  );
}