# AI Chatbot Backend

## Setup Instructions
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file based on `.env.example`
4. Run the server: `uvicorn app.main:app --reload`

## API Documentation
After starting the server, visit http://localhost:8000/docs for the OpenAPI documentation.

## WebSocket Usage
Connect to `ws://localhost:8000/ws/chat` for real-time chat communication.
