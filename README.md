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