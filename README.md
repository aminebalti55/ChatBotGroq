# Frontend Documentation

## 🎨 Frontend Features

🎥 Demo
https://streamable.com/mu9g50

Watch the full demo video

Key features demonstrated in the video:

Real-time chat interaction
Message streaming
Dark/Light theme switching
Mobile responsiveness
WebSocket connection management
Authentication flow

- Real-time chat interface with message streaming
- JWT-based authentication with protected routes
- Dark/Light theme support
- WebSocket connection management with auto-reconnection
- Chat session management
- Message history and persistence
- Toast notifications for system messages
- Responsive design for mobile and desktop
- Custom hooks for chat and WebSocket functionality
- State management with Zustand

## 🛠️ Frontend Tech Stack

- **Next.js**: React framework for the frontend
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **Lucide React**: Icon components
- **React Hot Toast**: Toast notifications
- **ShadcnUI**: UI component library
- **WebSocket**: Real-time communication

## 🏗️ Frontend Architecture

```
src/
├── app/
│   ├── hooks/
│   │   ├── useAuth.js        # Authentication hook
│   │   ├── useChat.js        # Chat functionality
│   │   └── useWebSocket.js   # WebSocket management
│   ├── store/
│   │   ├── chatStore.js      # Chat state management
│   │   └── uiStore.js        # UI state (theme, sidebar)
│   ├── services/
│   │   └── websocket.js      # WebSocket service
│   └── utils/
│       └── Toast.js          # Toast notifications
├── components/
│   ├── chat/
│   │   ├── ChatBubble.jsx    # Message bubbles
│   │   ├── ChatInput.jsx     # Message input
│   │   ├── ChatList.jsx      # Message list
│   │   └── StreamingIndicator.jsx # Typing indicator
│   ├── shared/
│   │   ├── Header.jsx        # App header
│   │   ├── Footer.jsx        # App footer
│   │   ├── Sidebar.jsx       # Chat sessions sidebar
│   │   └── LoadingSpinner.jsx # Loading states
│   └── ui/
│       ├── alert.jsx         # Alert component
│       └── button.jsx        # Button component
```

## 🔒 Authentication Flow

The authentication system uses JWT tokens and includes:

1. Login/Signup forms with validation
2. Token storage in localStorage
3. Protected route middleware
4. Automatic token verification
5. Session management
6. Logout functionality

## 💬 WebSocket Implementation

The WebSocket service (`websocket.js`) handles:

```javascript
class WebSocketService {
  - Connection management
  - Auto-reconnection logic
  - Message handling
  - Event emission
  - Connection status tracking
  - Error handling
}
```

## 📦 State Management

Using Zustand for state management:

### Chat Store
- Messages array
- Current session management
- Stream handling
- Chat history

### UI Store
- Dark/Light mode
- Sidebar state
- Connection status

## 🎯 Custom Hooks

### useChat
- Message sending
- Stream handling
- Chat session management

### useWebSocket
- Connection handling
- Auto-reconnection
- Status management
- Message sending

### useAuth
- Authentication state
- Login/Logout
- Token management

## 🎨 UI Components

### ChatBubble
- User/AI message rendering
- Timestamp formatting
- Typing indicators
- Stream visualization

### ChatList
- Message history display
- Auto-scrolling
- Loading states
- Empty states

### ChatInput
- Message composition
- Send functionality
- Loading states
- Error handling

## 🔄 Real-time Features

1. **Message Streaming**
   - Token-by-token display
   - Typing indicators
   - Stream management

2. **Connection Management**
   - Status indicators
   - Auto-reconnection
   - Error handling

3. **Session Handling**
   - Multiple chat sessions
   - Session switching
   - History persistence

## 🎨 Styling

Using Tailwind CSS with:
- Custom theme configuration
- Dark/Light mode support
- Responsive design
- Custom animations
- UI component variants

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint management
- Touch interactions
- Adaptive layouts
- Dynamic components

## 🚀 Getting Started with Frontend

1. **Installation**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_WS_URL=ws://localhost:8000
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Building**
   ```bash
   npm run build
   npm start
   ```

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "latest",
    "react": "^18",
    "zustand": "^4",
    "lucide-react": "latest",
    "react-hot-toast": "^2",
    "tailwindcss": "^3"
  }
}
```

## 🧪 Frontend Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📝 Development Guidelines

1. **Component Structure**
   - Functional components
   - Custom hooks for logic
   - Props validation
   - Error boundaries

2. **State Management**
   - Zustand for global state
   - Local state when appropriate
   - Memoization for performance

3. **WebSocket Handling**
   - Connection management
   - Error handling
   - Reconnection logic
   - Event handling

4. **Code Style**
   - ESLint configuration
   - Prettier formatting
   - TypeScript (optional)
   - Component documentation



# 🤖 AI Chat Application Backend 

A robust FastAPI backend for an AI chat application powered by Groq's LLM API.

## ✨ Features

- 🔐 User authentication with JWT
- 💬 Real-time chat via WebSockets
- 🧠 Integration with Groq API for LLM responses
- 📊 Chat history persistence
- 🔄 Async database operations with SQLAlchemy
- 🚀 Scalable architecture with dependency injection

## 🛠️ Tech Stack

- **FastAPI**: Modern, high-performance web framework
- **SQLAlchemy**: Async ORM for database operations
- **Groq API**: State-of-the-art LLM integration
- **WebSockets**: Real-time communication
- **JWT Authentication**: Secure user sessions
- **Async I/O**: Non-blocking operations throughout

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL or SQLite
- Groq API key

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-chat-backend.git
   cd ai-chat-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root:
   ```
   DATABASE_URL=sqlite+aiosqlite:///./chatbot.db
   # For PostgreSQL: postgresql+asyncpg://user:password@localhost/dbname
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   GROQ_API_KEY=your_groq_api_key_here
   ```

### Running the Application

1. Initialize the database:
   ```bash
   python -m app.db.database
   ```

2. Start the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

3. Access the API documentation:
   ```
   http://localhost:8000/docs
   ```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Authenticate and get JWT token
- `GET /api/auth/me`: Get current user info
- `GET /api/auth/verify-token`: Verify JWT token validity

### Chat
- `GET /api/chats`: Get all chat sessions
- `GET /api/chats/{session_id}/messages`: Get messages for a specific chat session
- `WebSocket /ws/chat`: Real-time chat connection

## 🧩 Architecture

```
app/
├── api/
│   └── routes/
│       └── auth.py
├── db/
│   ├── database.py
│   └── repositories/
│       ├── chat_repository.py
│       └── user_repository.py
├── models/
│   ├── chat.py
│   └── user.py
├── services/
│   ├── auth_service.py
│   ├── chat_service.py
│   └── groq_service.py
├── utils/
│   └── security.py
└── main.py
```

## 🔒 Authentication Flow

1. User registers with email/password
2. Credentials are validated and password is hashed
3. JWT token is generated and returned
4. Subsequent requests include token in Authorization header
5. Protected routes verify token and extract user identity

## 🌐 WebSocket Communication

The application uses WebSockets for real-time chat:

1. Client establishes WebSocket connection
2. Server assigns a unique session ID
3. Messages are streamed token-by-token for real-time responses
4. All messages are persisted to the database
5. Session history can be retrieved via REST endpoints

## 🧪 Testing

Run the tests with:
```bash
pytest
```

## 📈 Scaling Considerations

- Database connections use connection pooling
- Async handlers maximize throughput
- JWT authentication is stateless for horizontal scaling
- Connection manager tracks active WebSockets

## 📄 License

MIT

## 👥 Contributors

- Balti Mohamed amine  - Initial work