import os
from groq import AsyncGroq
from typing import AsyncGenerator
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = AsyncGroq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile" 
        logger.info("GroqService initialized")

    async def stream_completion(self, user_message: str) -> AsyncGenerator[str, None]:
       
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": user_message
                }],
                stream=True,
                temperature=0.7,
                max_tokens=4096
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"Error in Groq streaming: {str(e)}")
            raise

    async def get_completion(self, user_message: str) -> str:
      
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": user_message
                }],
                temperature=0.7,
                max_tokens=4096
            )
            
            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Error in Groq completion: {str(e)}")
            raise