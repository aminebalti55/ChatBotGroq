'use client';

import React, { useEffect } from 'react';
import { Menu, Command, Sun, Moon, Search, Wifi, WifiOff, Radio } from 'lucide-react';
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { showToast } from '@/app/utils/Toast';

const Header = ({ onToggleSidebar, isDarkMode, onToggleTheme }) => {
  const { status, isConnected, isReconnecting } = useWebSocket();

  const getConnectionStatus = () => {
    switch (status) {
      case 'connected':
        return {
          text: 'Connected',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-700 dark:text-green-400',
          dotColor: 'bg-green-500',
          icon: <Wifi className="w-4 h-4" />,
          animate: false
        };
      case 'connecting':
        return {
          text: 'Connecting...',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-700 dark:text-yellow-400',
          dotColor: 'bg-yellow-500',
          icon: <Radio className="w-4 h-4" />,
          animate: true
        };
      case 'reconnecting':
        return {
          text: 'Reconnecting...',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-700 dark:text-yellow-400',
          dotColor: 'bg-yellow-500',
          icon: <Radio className="w-4 h-4" />,
          animate: true
        };
      case 'error':
      case 'disconnected':
      default:
        return {
          text: 'Disconnected',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-700 dark:text-red-400',
          dotColor: 'bg-red-500',
          icon: <WifiOff className="w-4 h-4" />,
          animate: false
        };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
              rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700
            rounded-lg text-sm text-gray-500 dark:text-gray-400">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="bg-transparent border-none outline-none w-48 placeholder-gray-500 
                dark:placeholder-gray-400 text-gray-900 dark:text-white"
            />
            <div className="flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 ${connectionStatus.bgColor} 
            ${connectionStatus.textColor} rounded-lg text-sm transition-all duration-200`}>
            <div className="flex items-center gap-2">
              <div className={`${connectionStatus.animate ? 'animate-spin' : ''}`}>
                {connectionStatus.icon}
              </div>
              <div className={`w-2 h-2 rounded-full ${connectionStatus.dotColor} 
                ${connectionStatus.animate ? 'animate-pulse' : ''}`} />
              <span>{connectionStatus.text}</span>
            </div>
          </div>

          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
              rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 transform hover:rotate-45 transition-transform duration-200" />
            ) : (
              <Moon className="w-5 h-5 transform hover:-rotate-45 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;