from fastapi import WebSocket
from typing import Dict, List, Set

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, Set[str]] = {}  # user_id -> set of session_ids
    
    async def connect(self, websocket: WebSocket, session_id: str, user_id: str = None):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = set()
            self.user_connections[user_id].add(session_id)
    
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            
            for user_id, sessions in self.user_connections.items():
                if session_id in sessions:
                    sessions.remove(session_id)
                    break
    
    async def send_personal_message(self, message: dict, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(message)
    
    async def broadcast_to_user(self, message: dict, user_id: str):
        if user_id in self.user_connections:
            for session_id in self.user_connections[user_id]:
                if session_id in self.active_connections:
                    await self.active_connections[session_id].send_json(message)