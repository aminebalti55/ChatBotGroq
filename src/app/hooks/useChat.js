// src/hooks/useChat.js
import { useCallback, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { wsService } from '../services/websocket';
import { showToast } from '../utils/Toast';

export const useChat = () => {
  const {
    addMessage,
    startStream,
    appendToStream,
    finalizeStream,
    clearStream,
    isStreaming,
    isTyping,
    setTyping,
    currentSessionId,
    createNewSession
  } = useChatStore();

  useEffect(() => {
    const handleSessionCreated = (data) => {
      // Handle new session created by the server
      if (data.session_id && !currentSessionId) {
        createNewSession(data.session_id);
      }
    };

    const handleMessageReceived = () => {
      setTyping(true);
    };

    const handleToken = (content) => {
      if (content && typeof content === 'string') {
        appendToStream(content);
      }
    };

    const handleCompletion = () => {
      finalizeStream();
    };

    const handleError = (error) => {
      clearStream();
      showToast.error(error || 'An error occurred while processing your message');
    };

    const unsubscribe = [
      wsService.on('session_created', handleSessionCreated),
      wsService.on('message_received', handleMessageReceived),
      wsService.on('token', handleToken),
      wsService.on('completion', handleCompletion),
      wsService.on('error', handleError)
    ];

    return () => {
      unsubscribe.forEach(unsub => unsub?.());
    };
  }, [appendToStream, finalizeStream, clearStream, setTyping, currentSessionId, createNewSession]);

  const sendChatMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    try {
      const userMessage = {
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      addMessage(userMessage);

      startStream();

      const sent = wsService.send({
        type: 'chat_message',
        message: content,
        session_id: currentSessionId 
      });

      if (!sent) {
        throw new Error('Failed to send message - not connected');
      }
    } catch (error) {
      clearStream();
      showToast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    }
  }, [addMessage, startStream, clearStream, currentSessionId]);

  return {
    sendChatMessage,
    isStreaming,
    isTyping
  };
};