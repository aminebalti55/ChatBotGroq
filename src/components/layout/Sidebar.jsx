import React from 'react';
import { Plus, MessageSquare, Settings, Trash2 } from 'lucide-react';
import { useChatStore } from '@/app/store/chatStore';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 1000 / 60);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
};

const Sidebar = () => {
  const {
    sessions,
    currentSessionId,
    createNewSession,
    setCurrentSession,
    deleteSession
  } = useChatStore();

  const handleNewChat = () => {
    createNewSession();
  };

  const handleSelectChat = (sessionId) => {
    setCurrentSession(sessionId);
  };

  const handleDeleteChat = (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteSession(sessionId);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI Chat</h1>
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 
            text-white rounded-lg transition-colors mb-6"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>

        <nav className="flex-1 overflow-auto space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => handleSelectChat(session.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg
                text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors text-sm group ${
                  currentSessionId === session.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <div className="truncate text-left">
                  <div className="font-medium truncate">{session.title}</div>
                  {session.lastMessage && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.lastMessage}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {formatTime(session.timestamp)}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteChat(e, session.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 
                  dark:hover:bg-gray-600 rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;