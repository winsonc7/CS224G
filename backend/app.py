from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv
from prompts import cbtprompt_v0, robust_v0
import logging
import requests
from image_generation import generate_therapist_image
from voice_generation import generate_speech

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

load_dotenv()
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

conversations = {}
PREVIOUS_EMOTION = 'neutral'  # Track previous emotional state

def get_ai_response(conversation):
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=conversation
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"AI response error: {str(e)}")
        return str(e)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        session_id = data.get('sessionId', 'default')
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Initialize conversation if needed
        if session_id not in conversations:
            system_prompt = cbtprompt_v0() + robust_v0()
            conversations[session_id] = [{"role": "system", "content": system_prompt}]
        
        # Add user message to conversation
        conversations[session_id].append({"role": "user", "content": user_message})
        
        # Get AI response
        bot_reply = get_ai_response(conversations[session_id])
        if not bot_reply:
            return jsonify({"error": "Failed to get AI response"}), 500
        
        # Get emotional context and generate image
        emotion = analyze_emotional_context(conversations[session_id])
        new_image_url = generate_therapist_image(emotion)
        audio_data = generate_speech(bot_reply)
        
        # Add bot response to conversation
        conversations[session_id].append({"role": "assistant", "content": bot_reply})
        
        return jsonify({
            "message": bot_reply,
            "sessionId": session_id,
            "therapistImage": new_image_url,
            "audioData": audio_data.decode('latin1') if audio_data else None
        })
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def analyze_emotional_context(conversation) -> str:
    for message in reversed(conversation):
        if message.get('role') == 'user':
            content = message.get('content', '').lower()
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

@app.route('/api/speech', methods=['POST'])
def generate_speech_endpoint():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        text = data.get('text')
        if not text:
            return jsonify({"error": "No text provided"}), 400
            
        audio_data = generate_speech(text)
        if not audio_data:
            return jsonify({"error": "Speech generation failed"}), 500
            
        return Response(audio_data, mimetype='audio/mpeg')
        
    except Exception as e:
        logger.error(f"Speech endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(host='localhost', debug=True, port=5001)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        exit(1)
