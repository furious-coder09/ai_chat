import React from 'react';
import { Message } from '../types';
import classNames from 'classnames';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={classNames(
            "flex flex-col max-w-[80%] rounded-xl shadow-sm",
            message.isUser
              ? "bg-blue-500 text-white self-end"
              : "bg-white self-start"
          )}
        >
          {message.files && message.files.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 border-b border-opacity-20">
              {message.files.map((file, index) => {
                if (file.type.startsWith('image/')) {
                  return (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="Uploaded content"
                      className="max-w-xs rounded-lg"
                    />
                  );
                }
                if (file.type.startsWith('video/')) {
                  return (
                    <video
                      key={index}
                      controls
                      className="max-w-xs rounded-lg"
                    >
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                  );
                }
                if (file.type.startsWith('audio/')) {
                  return (
                    <audio
                      key={index}
                      controls
                      className="max-w-xs"
                    >
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the audio tag.
                    </audio>
                  );
                }
                return null;
              })}
            </div>
          )}
          <div className="p-4">
            <p className="whitespace-pre-wrap">{message.content}</p>
            <span className={classNames(
              "text-xs mt-2 block",
              message.isUser ? "text-blue-100" : "text-gray-500"
            )}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}