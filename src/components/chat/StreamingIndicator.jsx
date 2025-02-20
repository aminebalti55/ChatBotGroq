"use client";
import React from 'react';
import { Bot, UserCircle, SendHorizontal } from 'lucide-react';

const StreamingIndicator = () => {
    return (
      <div className="flex items-center gap-2">
        <Bot className="w-6 h-6 text-emerald-400" />
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{
                animation: 'bounce 1.4s infinite',
                animationDelay: `${i * 0.2}s`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
      </div>
    );
  };

export default StreamingIndicator;