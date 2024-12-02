import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { FiSend, FiX } from 'react-icons/fi';

interface ChatInputProps {
  onSubmit: (message: string, files: File[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || files.length > 0) {
      onSubmit(message, files);
      setMessage('');
      setFiles([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-lg">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center bg-gray-200 rounded-lg">
                  <span className="text-xs text-gray-600">{file.type.split('/')[0]}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <FileUpload
        onFileSelect={(newFiles) => setFiles([...files, ...newFiles])}
        acceptedFiles={['image/*', 'video/*', 'audio/*']}
      />
      
      <div className="flex gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && files.length === 0)}
          className="bg-blue-500 text-white px-6 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
}