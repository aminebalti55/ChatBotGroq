// src/components/chat/ChatList.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/app/store/chatStore';
import ChatBubble from '@/components/chat/ChatBubble';
import { Bot } from 'lucide-react';

const TypingIndicator = () => (
  <div className="flex justify-start animate-fadeIn">
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 
      max-w-[80%] shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Bot className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500"
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
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
    <Bot className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      Start a New Conversation
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
      Begin chatting with the AI assistant. Your conversation will appear here.
    </p>
  </div>
);

const ChatList = () => {
  const {
    messages,
    streamContent,
    isStreaming,
    isTyping,
    currentSessionId
  } = useChatStore();
  
  const bottomRef = useRef(null);

  const sessionMessages = currentSessionId 
    ? messages.filter(msg => msg.sessionId === currentSessionId)
    : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages, streamContent, isTyping]);

  if (!currentSessionId || (sessionMessages.length === 0 && !isStreaming && !isTyping)) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {sessionMessages.map((message) => (
        <div
          key={message.id}
          className="transition-all duration-200 ease-out"
          style={{
            opacity: 1,
            transform: 'translateY(0)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <ChatBubble 
            message={message}
            isAITyping={false}
          />
        </div>
      ))}

      {isTyping && !streamContent && <TypingIndicator />}

      {isStreaming && streamContent && (
        <div className="transition-all duration-200 ease-out">
          <ChatBubble
            message={{
              role: 'assistant',
              content: streamContent,
              isStreaming: true,
              sessionId: currentSessionId,
              timestamp: new Date().toISOString()
            }}
            isAITyping={false}
          />
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default ChatList;