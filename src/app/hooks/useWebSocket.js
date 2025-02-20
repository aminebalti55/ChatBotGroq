import { useEffect, useCallback, useState } from 'react';
import { wsService } from '@/app/services/websocket';
import { useUIStore } from '@/app/store/uiStore';
import { showToast } from '@/app/utils/Toast';

export const useWebSocket = () => {
  const setConnectionStatus = useUIStore(state => state.setConnectionStatus);
  const [status, setStatus] = useState(wsService.getStatus());
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setStatus('connected');
      setIsReconnecting(false);
      setConnectionStatus('connected');
      showToast.success('Connected to server');
    };

    const handleDisconnect = () => {
      setStatus('disconnected');
      setConnectionStatus('disconnected');
      
      if (!isReconnecting) {
        showToast.warning('Disconnected from server');
      }
    };

    const handleError = (error) => {
      console.error('WebSocket error:', error);
      setStatus('error');
      setConnectionStatus('error');
      showToast.error('Connection error occurred');
    };

    const handleReconnecting = (data) => {
      setStatus('reconnecting');
      setIsReconnecting(true);
      setConnectionStatus('connecting');
      showToast.info(`Reconnecting... (Attempt ${data.attempt}/${data.max})`);
    };

    const unsubscribe = [
      wsService.on('connect', handleConnect),
      wsService.on('disconnect', handleDisconnect),
      wsService.on('error', handleError),
      wsService.on('reconnecting', handleReconnecting)
    ];

    const startConnection = () => {
      const currentStatus = wsService.getStatus();
      if (currentStatus === 'disconnected') {
        console.log('Initiating WebSocket connection...');
        wsService.connect();
      } else {
        console.log('Current WebSocket status:', currentStatus);
      }
    };

    startConnection();

    const statusCheck = setInterval(() => {
      const currentStatus = wsService.getStatus();
      if (currentStatus !== status) {
        setStatus(currentStatus);
      }
      if (currentStatus === 'disconnected' && !isReconnecting) {
        startConnection();
      }
    }, 5000);

    return () => {
      unsubscribe.forEach(unsub => unsub?.());
      clearInterval(statusCheck);
    };
  }, [setConnectionStatus, status, isReconnecting]);

  const connect = useCallback(() => {
    if (wsService.getStatus() === 'disconnected') {
      wsService.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsService.getStatus() !== 'connected') {
      showToast.error('Not connected to server');
      return false;
    }
    return wsService.send(message);
  }, []);

  return {
    status,
    isConnected: status === 'connected',
    isReconnecting,
    connect,
    disconnect,
    sendMessage
  };
};