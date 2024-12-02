export type MessageType = 'text' | 'image' | 'video' | 'audio';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  files?: File[];
  isUser: boolean;
  timestamp: Date;
}

export interface FileWithPreview extends File {
  preview?: string;
}