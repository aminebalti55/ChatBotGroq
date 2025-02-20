'use client';

import React, { useState } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { showToast } from '@/app/utils/Toast';

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      await onSend(message);
      setMessage('');
      showToast.success('Message sent successfully!');
    } catch (error) {
      showToast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400 text-sm"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`p-2 rounded-lg transition-colors ${
            message.trim() && !isLoading
              ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
              : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendHorizontal className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;