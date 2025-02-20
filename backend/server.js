// websocket-server.js
const WebSocket = require('ws');
const http = require('http');

class WebSocketServer {
  constructor(port = 8000) {
    // Create an HTTP server
    this.server = http.createServer();
    
    // Create WebSocket server
    this.wss = new WebSocket.Server({ 
      server: this.server 
    });

    this.port = port;
    this.clients = new Set();

    // Setup event handlers
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.wss.on('connection', (ws) => {
      console.log('New client connected');
      this.clients.add(ws);

      // Welcome message
      ws.send(JSON.stringify({
        type: 'system',
        message: 'Welcome to the WebSocket server!'
      }));

      // Handle incoming messages
      ws.on('message', (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          console.log('Received message:', parsedMessage);

          // Example of message handling
          switch(parsedMessage.type) {
            case 'chat':
              this.broadcastMessage({
                type: 'chat',
                sender: 'Server',
                message: `Received: ${parsedMessage.message}`
              }, ws);
              break;
            
            case 'ping':
              ws.send(JSON.stringify({
                type: 'pong',
                timestamp: Date.now()
              }));
              break;
            
            default:
              console.log('Unknown message type:', parsedMessage.type);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      // Handle client disconnection
      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      // Handle connection errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // Server error handling
    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  }

  // Broadcast message to all connected clients except the sender
  broadcastMessage(message, sender) {
    this.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Start the server
  start() {
    this.server.listen(this.port, () => {
      console.log(`WebSocket server running on ws://localhost:${this.port}`);
    });
  }

  // Graceful shutdown
  stop() {
    this.wss.close(() => {
      console.log('WebSocket server stopped');
    });
  }
}

// Create and start the server
const wsServer = new WebSocketServer();
wsServer.start();

// Optional: Handle process termination
process.on('SIGINT', () => {
  wsServer.stop();
  process.exit();
});