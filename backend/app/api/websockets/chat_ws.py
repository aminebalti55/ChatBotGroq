from fastapi import WebSocket, WebSocketDisconnect
from app.services.groq_service import GroqService
from app.services.chat_service import ChatService
from app.models.chat import ChatMessage
from uuid import uuid4
import json
import logging

logger = logging.getLogger(__name__)

class ChatWebSocketHandler:
    def __init__(self, groq_service: GroqService, chat_service: ChatService):
        self.groq_service = groq_service
        self.chat_service = chat_service
        self.active_connections = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        session_id = str(uuid4())
        self.active_connections[session_id] = websocket
        await websocket.send_json({
            "type": "connection_established", 
            "session_id": session_id
        })
        return session_id

    async def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def handle_chat(self, websocket: WebSocket):
        session_id = await self.connect(websocket)
        
        try:
            while True:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                user_message = message_data["message"]

                await self.chat_service.save_message(ChatMessage(
                    session_id=session_id,
                    is_user=True,
                    content=user_message
                ))

                await websocket.send_json({"type": "message_received"})

                try:
                    failed = False
                    response_text = ""
                    
                    async for token in self.groq_service.stream_completion(user_message):
                        if token.startswith("Error:"):
                            failed = True
                            break
                        
                        response_text += token
                        await websocket.send_json({
                            "type": "token",
                            "content": token
                        })
                    
                    if failed:
                        response_text = await self.groq_service.get_completion(user_message)
                        if not response_text.startswith("Error:"):
                            await websocket.send_json({
                                "type": "token",
                                "content": response_text
                            })

                    if response_text and not response_text.startswith("Error:"):
                        await self.chat_service.save_message(ChatMessage(
                            session_id=session_id,
                            is_user=False,
                            content=response_text.strip()
                        ))
                        await websocket.send_json({"type": "completion"})
                    else:
                        await websocket.send_json({
                            "type": "error",
                            "message": "Failed to generate response"
                        })

                except Exception as e:
                    logger.error(f"Error handling message: {str(e)}")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Error generating response"
                    })

        except WebSocketDisconnect:
            logger.info(f"Client disconnected: {session_id}")
            await self.disconnect(session_id)
            
        except Exception as e:
            logger.error(f"WebSocket handler error: {str(e)}")
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
            await self.disconnect(session_id)