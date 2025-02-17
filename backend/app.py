from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
from openai import OpenAI
import anthropic  # Add Anthropic import
from dotenv import load_dotenv
from prompts import cbtprompt_v0, robust_v0
import logging
import requests
from image_generation import generate_therapist_image
from voice_generation import generate_speech
import base64

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Initialize both clients
load_dotenv()
openai_client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
anthropic_client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

conversations = {}
PREVIOUS_EMOTION = 'neutral'  # Track previous emotional state

def get_ai_response(conversation, model="gpt-4"):
    try:
        if model == "gpt-4":
            response = openai_client.chat.completions.create(
                model="gpt-4",
                messages=conversation
            )
            return response.choices[0].message.content
        elif model in ["claude-3", "claude-3.5"]:  # Accept both values
            # Convert conversation format for Claude
            claude_messages = []
            system_content = None
            
            # Add logging to debug
            logger.info(f"Using Claude 3.5 with messages: {claude_messages[:2]}")  # Log first few messages
            
            # Extract system prompt if present
            for msg in conversation:
                if msg["role"] == "system":
                    system_content = msg["content"]
                else:
                    claude_messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add system content to first user message if present
            if system_content and claude_messages:
                first_msg = claude_messages[0]
                if first_msg["role"] == "user":
                    first_msg["content"] = f"System Context: {system_content}\n\nUser Message: {first_msg['content']}"
            
            response = anthropic_client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1024,
                messages=claude_messages,
                temperature=0.7
            )
            return response.content
    except Exception as e:
        logger.error(f"AI response error for model {model}: {str(e)}")
        return f"Error with {model}: {str(e)}"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        session_id = data.get('sessionId', 'default')
        user_message = data.get('message')
        voice_enabled = data.get('voiceEnabled', False)
        model = data.get('model', 'gpt-4')
        
        logger.info(f"Received request - Model: {model}, Voice: {voice_enabled}")  # This will help debug
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Initialize conversation if needed
        if session_id not in conversations:
            system_prompt = cbtprompt_v0() + robust_v0()
            conversations[session_id] = [{"role": "system", "content": system_prompt}]
        
        # Add user message to conversation
        conversations[session_id].append({"role": "user", "content": user_message})
        
        # Get AI response
        bot_reply = get_ai_response(conversations[session_id], model)
        if not bot_reply:
            return jsonify({"error": "Failed to get AI response"}), 500
        
        # Get emotional context and generate image
        emotion = analyze_emotional_context(conversations[session_id])
        new_image_url = generate_therapist_image(emotion)
        
        # Generate audio only if voice is enabled
        audio_data = None
        if voice_enabled:
            audio_data = generate_speech(bot_reply)
        
        # Add bot response to conversation
        conversations[session_id].append({"role": "assistant", "content": bot_reply})
        
        return jsonify({
            "message": bot_reply,
            "sessionId": session_id,
            "therapistImage": new_image_url,
            "audioData": base64.b64encode(audio_data).decode('utf-8') if audio_data else None
        })
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def analyze_emotional_context(conversation) -> str:
    """Analyze conversation with deeper contextual understanding"""
    recent_messages = conversation[-15:]
    current_emotion = 'neutral'
    
    # Core emotional indicators
    emotional_patterns = {
        'trauma': {
            'direct': ['trauma', 'abuse', 'assault', 'death', 'suicide'],
            'phrases': [
                'voices in my head', 'shadows', 'demons', 'haunting me',
                'cant escape', 'make it stop', 'hurting myself'
            ],
            'context': [
                'little', 'dark', 'scary', 'demean', 'control', 'trapped',
                'flashback', 'nightmare', 'memory'
            ]
        },
        'anxiety': {
            'direct': ['anxiety', 'panic', 'stress', 'worried'],
            'phrases': [
                'cant stop thinking', 'what if', 'something bad',
                'heart racing', 'overthinking', 'cant breathe'
            ],
            'context': [
                'maybe', 'probably', 'might be', 'feeling like',
                'nervous', 'shaking', 'tight chest'
            ]
        },
        'depression': {
            'direct': ['depression', 'depressed', 'hopeless'],
            'phrases': [
                'whats the point', 'no one cares', 'better off without',
                'cant feel anything', 'empty inside', 'tired of everything'
            ],
            'context': [
                'anymore', 'always', 'never', 'worthless', 'burden',
                'exhausted', 'numb'
            ]
        }
    }

    positive_streak = 0
    serious_topic_mentioned = False
    
    def check_pattern_match(content: str, patterns: dict) -> bool:
        # Check direct words
        if any(word in content for word in patterns['direct']):
            return True
        
        # Check phrases
        if any(phrase in content for phrase in patterns['phrases']):
            return True
            
        # Check contextual indicators
        context_matches = sum(1 for word in patterns['context'] if word in content)
        return context_matches >= 2  # Require multiple context matches
    
    for message in reversed(recent_messages):
        if message.get('role') == 'user':
            content = message.get('content', '').lower()
            
            # Check for complex emotional patterns
            for category, patterns in emotional_patterns.items():
                if check_pattern_match(content, patterns):
                    serious_topic_mentioned = True
                    if category == 'trauma':
                        return 'concerned_serious'
                    return 'concerned'
            
            # Look for subtle distress indicators
            distress_indicators = [
                ('i dont know', 'confused'),
                ('like', 'little', 'shadows'),  # Metaphorical description
                ('feeling', 'think', 'maybe'),  # Uncertainty markers
                ('always', 'never', 'everything'),  # Absolutist language
                ('cant', 'wont', 'shouldnt')  # Negative self-talk
            ]
            
            # Count matching indicator patterns
            indicator_matches = sum(
                1 for indicators in distress_indicators 
                if sum(1 for word in indicators if word in content) >= 2
            )
            
            if indicator_matches >= 2:
                return 'concerned'
            
            # Rest of the emotion checking logic...
            if any(word in content for word in ['sad', 'unhappy', 'lonely']):
                return 'sad'
            elif any(word in content for word in ['angry', 'mad', 'furious']):
                return 'angry'
            elif any(word in content for word in ['worried', 'anxious', 'nervous']):
                return 'anxious'
            
    return 'neutral' if not serious_topic_mentioned else 'concerned'

@app.route('/api/speech', methods=['POST'])
def generate_speech_endpoint():
    try:
        data = request.json
        if not data:
            logger.error("No data provided in speech request")
            return jsonify({"error": "No data provided"}), 400
            
        text = data.get('text')
        if not text:
            logger.error("No text provided in speech request")
            return jsonify({"error": "No text provided"}), 400
            
        logger.info(f"Generating speech for text: {text[:50]}...")
        audio_data = generate_speech(text)
        
        if not audio_data:
            logger.error("Failed to generate speech")
            return jsonify({"error": "Speech generation failed"}), 500
            
        # Convert audio data to base64 for frontend
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        return jsonify({
            "audio": audio_base64,
            "format": "audio/mpeg"
        })
        
    except Exception as e:
        logger.error(f"Speech endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(host='localhost', debug=True, port=5001)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        exit(1)
