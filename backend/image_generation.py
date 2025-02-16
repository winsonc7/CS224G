import os
import time
import requests
import base64
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

BFL_API_KEY = os.getenv("BLACK_FOREST_API_KEY")
BFL_API_URL = 'https://api.us1.bfl.ai/v1/flux-pro-1.1'
REFERENCE_IMAGE_PATH = os.path.join(os.path.dirname(__file__), "assets/Therapist-F-Smile.png")

def get_emotion_details(emotion: str) -> Dict[str, str]:
    """Get detailed emotion descriptions"""
    emotion_map = {
        'sad': {
            'expression': 'gentle empathy with slightly downturned eyes, caring smile',
            'gesture': 'head tilted slightly to show understanding',
            'intensity': 'subtle'
        },
        'angry': {
            'expression': 'calm and grounding presence, steady gaze',
            'gesture': 'professional posture with slight forward lean',
            'intensity': 'moderate'
        },
        'happy': {
            'expression': 'warm smile with bright, engaged eyes',
            'gesture': 'slight head tilt with encouraging posture',
            'intensity': 'moderate'
        },
        'anxious': {
            'expression': 'calming and reassuring expression, soft gaze',
            'gesture': 'stable and grounding presence',
            'intensity': 'subtle'
        },
        'neutral': {
            'expression': 'professional warmth with attentive eyes',
            'gesture': 'welcoming and open posture',
            'intensity': 'subtle'
        }
    }
    return emotion_map.get(emotion, emotion_map['neutral'])

def poll_for_image(polling_url: str, max_attempts: int = 60, delay_ms: int = 2000) -> Optional[str]:
    """Poll for generated image"""
    headers = {
        'Content-Type': 'application/json',
        'X-Key': BFL_API_KEY
    }

    logger.info(f"Starting to poll: {polling_url}")
    
    for attempt in range(max_attempts):
        try:
            response = requests.get(polling_url, headers=headers)
            data = response.json()
            
            if attempt % 5 == 0:  # Log every 5th attempt to reduce noise
                logger.info(f"Poll attempt {attempt + 1}: {data}")

            if data.get('status') == 'Ready' and data.get('result', {}).get('sample'):
                logger.info("Successfully received generated image")
                return data['result']['sample']
            elif data.get('status') == 'Failed':
                logger.error(f"Image generation failed: {data.get('details')}")
                return None

            time.sleep(delay_ms / 1000)
        except Exception as e:
            logger.error(f"Polling error: {str(e)}")
            continue

    logger.error("Polling timed out")
    return None

def generate_therapist_image(emotion: str) -> Optional[str]:
    """Generate image based on emotional state using Black Forest Labs"""
    try:
        emotion_details = get_emotion_details(emotion)
        
        # Read and encode reference image
        try:
            with open(REFERENCE_IMAGE_PATH, 'rb') as f:
                image_bytes = f.read()
                reference_image = base64.b64encode(image_bytes).decode('utf-8')
                logger.info(f"Successfully loaded reference image from {REFERENCE_IMAGE_PATH}")
        except Exception as e:
            logger.error(f"Failed to load reference image: {str(e)}")
            return None
        
        params = {
            "prompt": f"""Create an anime-style portrait of a professional therapist, matching the reference image exactly:

            Current Emotional State ({emotion_details['intensity']}):
            Expression: {emotion_details['expression']}
            Gesture: {emotion_details['gesture']}

            Match Reference Image Exactly:
            - Brown shoulder-length bob cut with side-swept bangs
            - Large expressive blue eyes with white highlights
            - Heart-shaped face with soft features
            - Dark grey blazer over cream pleated blouse
            - Professional office with bookshelves background
            - Clean anime art style with soft shading
            
            Expression Guidelines:
            - Professional composure with emotional awareness
            - Natural facial expressions showing {emotion}
            - Gentle eye contact and authentic presence
            - Subtle head tilt matching emotional state
            """,
            "width": 1024,
            "height": 1024,
            "prompt_upsampling": False,
            "seed": 42,
            "safety_tolerance": 2,
            "output_format": "jpeg",
            "reference_image": reference_image,
            "reference_weight": 0.7  # Added reference weight
        }

        headers = {
            'Content-Type': 'application/json',
            'X-Key': BFL_API_KEY
        }

        logger.info(f"Sending request to BFL API for emotion: {emotion}")
        response = requests.post(BFL_API_URL, json=params, headers=headers)
        
        if not response.ok:
            logger.error(f"BFL API request failed: Status {response.status_code}")
            logger.error(f"Response: {response.text}")
            return None

        data = response.json()
        logger.info(f"BFL API response: {data}")

        polling_url = data.get('polling_url')
        if not polling_url:
            logger.error("No polling URL received")
            return None

        return poll_for_image(polling_url)

    except Exception as e:
        logger.error(f"Image generation error: {str(e)}")
        return None