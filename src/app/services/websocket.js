class WebSocketService {
    constructor() {
      this.ws = null;
      this.url = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/chat`;
      this.eventListeners = new Map();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectTimeout = null;
      this.status = 'disconnected';
    }
  
    connect() {
      if (this.ws?.readyState === WebSocket.OPEN) return;
  
      try {
        this.ws = new WebSocket(this.url);
        this.status = 'connecting';
  
        this.ws.onopen = () => {
          this.status = 'connected';
          this.reconnectAttempts = 0;
          this.emit('connect');
        };
  
        this.ws.onclose = () => {
          this.status = 'disconnected';
          this.emit('disconnect');
          this.attemptReconnect();
        };
  
        this.ws.onerror = (error) => {
          this.status = 'error';
          this.emit('error', error);
        };
  
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        this.status = 'error';
        this.emit('error', error);
      }
    }
  
    handleMessage(data) {
      switch (data.type) {
        case 'connection_established':
          if (data.session_id) {
            localStorage.setItem('ws_session_id', data.session_id);
          }
          this.emit(data.type);
          break;
        
        case 'message_received':
          this.emit('message_received');
          break;
        
        case 'token':
          const content = data.content;
          if (content !== undefined && content !== null) {
            this.emit('token', content.toString());
          }
          break;
        
        case 'completion':
          this.emit('completion');
          break;
        
        case 'error':
          this.emit('error', data.message || 'An error occurred');
          break;
        
        default:
          console.log('Unhandled message type:', data.type);
      }
    }
  
    attemptReconnect() {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached');
        return;
      }
  
      this.reconnectAttempts++;
      this.emit('reconnecting', {
        attempt: this.reconnectAttempts,
        max: this.maxReconnectAttempts
      });
  
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
    }
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      this.status = 'disconnected';
    }
  
    send(data) {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected');
        return false;
      }
  
      try {
        this.ws.send(JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        return false;
      }
    }
  
    on(event, callback) {
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, new Set());
      }
      this.eventListeners.get(event).add(callback);
      return () => this.off(event, callback);
    }
  
    off(event, callback) {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    }
  
    emit(event, data) {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.forEach(callback => callback(data));
      }
    }
  
    getStatus() {
      return this.status;
    }
  }
  
  export const wsService = new WebSocketService();