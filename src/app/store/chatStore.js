import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useChatStore = create((set, get) => ({
  messages: [],
  currentStreamId: null,
  streamContent: '',
  isStreaming: false,
  isTyping: false,
  sessions: [],
  currentSessionId: null,

  setTyping: (typing) => set({ isTyping: typing }),
  
  clearStream: () => set({
    currentStreamId: null,
    streamContent: '',
    isStreaming: false,
    isTyping: false
  }),

  addMessage: (message) => {
    const state = get();
    let sessionId = state.currentSessionId;

    if (!sessionId) {
      sessionId = uuidv4();
      set((state) => ({
        sessions: [{
          id: sessionId,
          title: message.content.slice(0, 30) + '...',
          timestamp: new Date().toISOString(),
          lastMessage: message.content
        }, ...state.sessions],
        currentSessionId: sessionId
      }));
    }

    set((state) => ({
      messages: [...state.messages, {
        ...message,
        id: message.id || uuidv4(),
        sessionId: sessionId,
        timestamp: message.timestamp || new Date().toISOString(),
        is_user: message.role === 'user'
      }]
    }));

    if (sessionId) {
      set((state) => ({
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? {
                ...session,
                lastMessage: message.content,
                timestamp: new Date().toISOString()
              }
            : session
        )
      }));
    }
  },

  startStream: () => set({
    currentStreamId: uuidv4(),
    streamContent: '',
    isStreaming: true,
    isTyping: true
  }),

  appendToStream: (content) => set((state) => ({
    streamContent: (state.streamContent || '') + (content || '').toString(),
    isTyping: false
  })),

  finalizeStream: () => set((state) => {
    const streamContent = state.streamContent?.trim() || '';
    
    const streamMessage = {
      id: state.currentStreamId,
      role: 'assistant',
      is_user: false,
      content: streamContent,
      sessionId: state.currentSessionId,
      timestamp: new Date().toISOString()
    };

    if (!streamContent) {
      return {
        currentStreamId: null,
        streamContent: '',
        isStreaming: false,
        isTyping: false
      };
    }

    const sessions = state.sessions.map(session =>
      session.id === state.currentSessionId
        ? {
            ...session,
            lastMessage: streamMessage.content,
            timestamp: new Date().toISOString()
          }
        : session
    );

    return {
      messages: [...state.messages, streamMessage],
      currentStreamId: null,
      streamContent: '',
      isStreaming: false,
      isTyping: false,
      sessions
    };
  }),

  createNewSession: () => {
    const sessionId = uuidv4();
    set((state) => ({
      sessions: [{
        id: sessionId,
        title: 'New Chat',
        timestamp: new Date().toISOString(),
        lastMessage: ''
      }, ...state.sessions],
      currentSessionId: sessionId
    }));
    return sessionId;
  },

  setCurrentSession: (sessionId) => {
    set({
      currentSessionId: sessionId,
      currentStreamId: null,
      streamContent: '',
      isStreaming: false,
      isTyping: false
    });
  },

  deleteSession: (sessionId) => set((state) => ({
    sessions: state.sessions.filter(session => session.id !== sessionId),
    currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
    messages: state.messages.filter(msg => msg.sessionId !== sessionId)
  })),

  clearMessages: () => set({
    messages: [],
    currentStreamId: null,
    streamContent: '',
    isStreaming: false,
    isTyping: false
  })
}));