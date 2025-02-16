import os
import requests
from typing import Optional
import logging

logger = logging.getLogger(__name__)

ELEVEN_LABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
THERAPIST_VOICE_ID = os.getenv("ELEVENLABS_AGENT_ID")  # Using your existing voice ID

def generate_speech(text: str) -> Optional[bytes]:
    """Generate speech from text using ElevenLabs API"""
    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{THERAPIST_VOICE_ID}/stream"
        
        headers = {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVEN_LABS_API_KEY
        }
        
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "style": 0.5,
                "speaking_rate": 1.3
            }
        }
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.ok:
            return response.content
        else:
            logger.error(f"Speech generation failed: {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Voice generation error: {str(e)}")
        return None 