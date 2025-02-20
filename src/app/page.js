'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Sun, Moon, Plus, MessageSquare, Settings, Github, Twitter, Loader2, SendHorizontal } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import ChatInput from '@/components/chat/ChatInput';
import ChatList from '@/components/chat/ChatList';
import { useChat } from '@/app/hooks/useChat';
import { useUIStore } from '@/app/store/uiStore';
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { useAuth } from '@/app/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner'; // You'll need to create this

export default function Home() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { isStreaming, sendChatMessage } = useChat();
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode } = useUIStore();

  useWebSocket();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <aside 
          className={`fixed inset-y-0 left-0 z-20 w-[280px] transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <Sidebar onLogout={handleLogout} userEmail={user.email} />
        </aside>

        <div 
          className={`min-h-screen transition-all duration-200 ease-in-out
            ${isSidebarOpen ? 'pl-[280px]' : 'pl-0'}`}
        >
          <div className="fixed top-0 left-0 right-0 z-10">
            <div className={`transition-all duration-200 ease-in-out
              ${isSidebarOpen ? 'pl-[280px]' : 'pl-0'}`}>
              <div className="p-4">
                <Header 
                  onToggleSidebar={toggleSidebar} 
                  isDarkMode={isDarkMode} 
                  onToggleTheme={toggleDarkMode}
                  userEmail={user.email}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-36">
            <div className="max-w-5xl mx-auto px-4">
              <ChatList isStreaming={isStreaming} />
            </div>
          </div>

          <div className="fixed bottom-16 left-0 right-0">
            <div className={`transition-all duration-200 ease-in-out
              ${isSidebarOpen ? 'pl-[280px]' : 'pl-0'}`}>
              <div className="px-4 py-2">
                <div className="max-w-5xl mx-auto">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <ChatInput 
                      onSend={sendChatMessage} 
                      isLoading={isStreaming}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0">
            <div className={`transition-all duration-200 ease-in-out
              ${isSidebarOpen ? 'pl-[280px]' : 'pl-0'}`}>
              <Footer />
            </div>
          </div>
        </div>

        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 z-10"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
}