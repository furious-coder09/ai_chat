import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initGemini, generateTextResponse, generateMultimodalResponse } from '../utils/gemini';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Message } from '../types';
import { config } from '../config/env';

export function GeminiChat() {
  const [apiKey, setApiKey] = useState(config.geminiApiKey);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (content: string, files: File[]) => {
    if (!apiKey) {
      setError('Please enter your API key');
      return;
    }

    setLoading(true);
    setError('');

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: files.length > 0 ? 'image' : 'text',
      content,
      files,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const genAI = initGemini(apiKey);
      let response: string;

      if (files.length > 0) {
        response = await generateMultimodalResponse(genAI, content, files);
      } else {
        response = await generateTextResponse(genAI, content);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('Error generating response. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Gemini AI Multimodal Chat</h1>
        <p className="text-gray-600">Chat with Gemini AI using text, images, audio, and video</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <input
            type="password"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <p className="mt-2 text-sm text-gray-600 flex items-center justify-center gap-2">
            {config.geminiApiKey ? '✓ Using API key from environment variables' : 'Get your API key from Google AI Studio'}
            {' '}
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Get API Key
            </a>
          </p>
        </div>

        <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
          <MessageList messages={messages} />
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="p-6 bg-white border-t border-gray-200">
          <ChatInput onSubmit={handleSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}