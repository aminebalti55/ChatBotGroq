import React from 'react';
import { UserCircle, Bot } from 'lucide-react';

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp || Date.now());
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 1000 / 60);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const TypingIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
          style={{
            animation: 'bounce 1.4s infinite',
            animationDelay: `${i * 0.2}s`,
            opacity: 0.7
          }}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500 dark:text-gray-400">
      AI is typing...
    </span>
  </div>
);

const ChatBubble = ({ message, isAITyping }) => {
  const isUser = message.is_user || message.role === 'user';

  return (
    <div className={`flex items-start gap-2 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
          }`}
        >
          {isAITyping ? (
            <TypingIndicator />
          ) : (
            <div>
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          )}
        </div>

        {!isAITyping && (
          <span className={`text-xs mt-1 ${
            isUser
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatMessageTime(message.timestamp || message.created_at)}
            {message.isStreaming && (
              <span className="ml-2 animate-pulse">●</span>
            )}
          </span>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;