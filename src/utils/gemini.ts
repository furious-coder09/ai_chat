import { GoogleGenerativeAI } from '@google/generative-ai';

export const initGemini = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

export const generateTextResponse = async (genAI: GoogleGenerativeAI, prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
};

export const generateMultimodalResponse = async (
  genAI: GoogleGenerativeAI,
  prompt: string,
  files: File[]
) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const filePromises = files.map(async (file) => {
      return new Promise<{ data: Uint8Array, mimeType: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          resolve({
            data: new Uint8Array(arrayBuffer),
            mimeType: file.type,
          });
        };
        reader.readAsArrayBuffer(file);
      });
    });

    const fileData = await Promise.all(filePromises);
    const result = await model.generateContent([prompt, ...fileData]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating multimodal response:', error);
    throw error;
  }
};