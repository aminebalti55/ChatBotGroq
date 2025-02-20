// src/store/uiStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isDarkMode: false,
  isSidebarOpen: false,
  connectionStatus: 'disconnected',
  
  toggleDarkMode: () =>
    set((state) => ({ isDarkMode: !state.isDarkMode })),
    
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    
  setConnectionStatus: (status) =>
    set({ connectionStatus: status }),
}));