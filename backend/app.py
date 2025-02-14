from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv
from prompts import cbtprompt_v0, robust_v0, therapist_image_prompt_v0
import logging
from PIL import Image, ImageDraw
import io
from typing import List, Optional
import hashlib
import requests
from shutil import copyfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

load_dotenv()
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

# Store conversations in memory (for demo purposes)
conversations = {}

# Just keep the original image path
THERAPIST_IMAGE_PATH = os.path.join(os.path.dirname(__file__), "assets/Therapist-F-Smile.png")

# Add this constant at the top with the others
BASE_THERAPIST_DESCRIPTION = """
This exact anime therapist: professional young woman in visual novel style, 
brown shoulder-length bob cut with side-swept bangs, large gentle blue eyes with white highlights, 
heart-shaped face, dark grey blazer over cream pleated blouse, sitting in warm-lit office with bookshelves.
"""

# Add at the top with other constants
EMOTION_PROMPTS = {
    'sad': {
        'eyes': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only slightly lower eyelids.",
        'eyebrows': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only gentle eyebrow tilt.",
        'mouth': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only tiny downturn to smile."
    },
    'angry': {
        'eyes': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only narrow eyes slightly.",
        'eyebrows': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only slight eyebrow furrow.",
        'mouth': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only firm the smile slightly."
    },
    'happy': {
        'eyes': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only brighten eyes slightly.",
        'eyebrows': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only raise eyebrows gently.",
        'mouth': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only warm the smile slightly."
    },
    'anxious': {
        'eyes': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only widen eyes slightly.",
        'eyebrows': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only raise inner eyebrows slightly.",
        'mouth': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only tense smile slightly."
    },
    'neutral': {
        'eyes': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only soften eyes slightly.",
        'eyebrows': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only relax eyebrows slightly.",
        'mouth': f"{BASE_THERAPIST_DESCRIPTION} Keep identical, only gentle professional smile."
    }
}

def get_ai_response(conversation):
    """
    Generate an AI response using OpenAI's chat completion API.
    
    Args:
        conversation (list): List of message dictionaries containing the conversation history
        
    Returns:
        str: The AI's response text, or error message if the API call fails
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=conversation
        )
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Handle chat messages from the client.
    
    Expects JSON payload with:
        - sessionId (str): Unique identifier for the chat session
        - message (str): User's message
        
    Returns:
        JSON containing:
        - message (str): AI's response
        - sessionId (str): Session identifier
        - therapistImage (str): URL of the generated therapist image
    """
    logger.info("=== New Chat Request ===")
    data = request.json
    session_id = data.get('sessionId', 'default')
    user_message = data.get('message')
    
    logger.info(f"Received message: {user_message}")  # Debug log
    
    if session_id not in conversations:
        system_prompt = cbtprompt_v0() + robust_v0()
        conversations[session_id] = [{"role": "system", "content": system_prompt}]
    
    conversations[session_id].append({"role": "user", "content": user_message})
    bot_reply = get_ai_response(conversations[session_id])
    
    logger.info(f"Bot reply: {bot_reply}")  # Debug log
    
    # Generate new therapist image based on conversation
    try:
        logger.info("Attempting to generate new image...")  # Debug log
        new_image_url = generate_therapist_image(conversations[session_id])
        logger.info(f"Generated image URL: {new_image_url}")  # Debug log
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")  # Debug log
        new_image_url = None
    
    conversations[session_id].append({"role": "assistant", "content": bot_reply})
    
    response_data = {
        "message": bot_reply,
        "sessionId": session_id,
        "therapistImage": new_image_url
    }
    logger.info(f"Sending response: {response_data}")  # Debug log
    return jsonify(response_data)

def verify_image_consistency(original_image: Image.Image, generated_url: str) -> bool:
    """Verify the generated image maintains consistency with original, focusing on non-facial areas"""
    try:
        # Download generated image
        response = requests.get(generated_url)
        generated_image = Image.open(io.BytesIO(response.content))
        
        # Compare dimensions
        if original_image.size != generated_image.size:
            logger.error("Image size mismatch")
            return False
        
        # Convert images to RGB if they aren't already
        original_rgb = original_image.convert('RGB')
        generated_rgb = generated_image.convert('RGB')
        
        # Define areas to check (excluding face area and being more precise)
        regions_to_check = [
            # Check clothing only
            (400, 500, 600, 800),    # Blazer area
            (450, 450, 550, 500),    # Collar area
            # Check background only
            (0, 600, 300, 800),      # Bottom left background
            (700, 600, 1000, 800),   # Bottom right background
        ]
        
        # Compare each region
        passing_regions = 0
        for region in regions_to_check:
            orig_region = original_rgb.crop(region)
            gen_region = generated_rgb.crop(region)
            
            # Compare histograms of regions
            orig_hist = orig_region.histogram()
            gen_hist = gen_region.histogram()
            
            # Calculate similarity for this region
            region_similarity = sum(min(a, b) for a, b in zip(orig_hist, gen_hist)) / sum(orig_hist)
            
            # More lenient threshold and count passing regions
            if region_similarity > 0.80:
                passing_regions += 1
            else:
                logger.warning(f"Region similarity: {region_similarity} for region {region}")
        
        # Accept if most regions pass
        if passing_regions >= len(regions_to_check) * 0.75:  # 75% of regions must pass
            logger.info(f"Image passed consistency check with {passing_regions}/{len(regions_to_check)} regions")
            return True
        else:
            logger.error(f"Only {passing_regions}/{len(regions_to_check)} regions passed consistency check")
            return False
        
    except Exception as e:
        logger.error(f"Error verifying image consistency: {str(e)}")
        return False

def generate_therapist_image(conversation):
    """Generate subtle expression changes using only the original image"""
    try:
        if not os.path.exists(THERAPIST_IMAGE_PATH):
            logger.error(f"Original image not found at: {THERAPIST_IMAGE_PATH}")
            return None

        emotion = analyze_emotional_context(conversation)

        # Define precise feature coordinates
        features = {
            'eyes': [(447, 264, 453, 270), (547, 264, 553, 270)],
            'eyebrows': [(445, 247, 455, 252), (545, 247, 555, 252)],
            'mouth': [(495, 308, 505, 311)]
        }

        # Select feature to edit based on emotion
        feature_to_edit = 'mouth' if emotion == 'sad' else 'eyebrows' if emotion == 'angry' else 'eyes'
        
        try:
            with open(THERAPIST_IMAGE_PATH, "rb") as image_file:  # Always use original image
                mask = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
                draw = ImageDraw.Draw(mask)
                
                # Draw mask for selected feature
                for coords in features[feature_to_edit]:
                    draw.rectangle(coords, fill=(255, 255, 255, 255))
                
                mask_bytes = io.BytesIO()
                mask.save(mask_bytes, format='PNG')
                mask_bytes.seek(0)
                
                prompt = EMOTION_PROMPTS[emotion][feature_to_edit]
                
                response = client.images.edit(
                    image=image_file,
                    mask=mask_bytes,
                    prompt=prompt,
                    n=1,
                    size="1024x1024"
                )
                
                if response and response.data:
                    return response.data[0].url
                
            return None
                    
        except Exception as e:
            logger.error(f"Failed to apply {feature_to_edit} edit: {str(e)}")
            return None
                    
    except Exception as e:
        logger.error(f"Image edit failed: {str(e)}")
        return None

@app.route('/api/reset', methods=['POST'])
def reset_conversation():
    """
    Reset a conversation session.
    
    Expects JSON payload with:
        - sessionId (str): Session to reset
        
    Returns:
        JSON with status: 'success' if session was reset
    """
    data = request.json
    session_id = data.get('sessionId', 'default')
    if session_id in conversations:
        del conversations[session_id]
    return jsonify({"status": "success"})

def analyze_emotional_context(conversation) -> str:
    """Analyze conversation to determine emotional context"""
    try:
        # Get the last user message
        for message in reversed(conversation):
            if message.get('role') == 'user':
                content = message.get('content', '').lower()
                
                # Simple emotion detection
                if any(word in content for word in ['sad', 'depressed', 'unhappy', 'lonely']):
                    return 'sad'
                elif any(word in content for word in ['angry', 'mad', 'furious', 'upset']):
                    return 'angry'
                elif any(word in content for word in ['happy', 'joy', 'excited', 'glad']):
                    return 'happy'
                elif any(word in content for word in ['worried', 'anxious', 'nervous']):
                    return 'anxious'
                else:
                    return 'neutral'
                
        return 'neutral'
    except Exception as e:
        logger.error(f"Error analyzing emotional context: {str(e)}")
        return 'neutral'

# Add this near the start of your app initialization
if __name__ == '__main__':
    app.run(host='localhost', debug=True, port=5001)
