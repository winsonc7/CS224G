from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv
from basic_prompts import cbtprompt_v0, robust_v0

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

load_dotenv()
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

# Store conversations in memory (for demo purposes)
conversations = {}

def get_ai_response(conversation):
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
    data = request.json
    session_id = data.get('sessionId', 'default')
    user_message = data.get('message')
    
    if session_id not in conversations:
        system_prompt = cbtprompt_v0() + robust_v0()
        conversations[session_id] = [{"role": "developer", "content": system_prompt}]
    
    conversations[session_id].append({"role": "user", "content": user_message})
    bot_reply = get_ai_response(conversations[session_id])
    conversations[session_id].append({"role": "assistant", "content": bot_reply})
    
    return jsonify({
        "message": bot_reply,
        "sessionId": session_id
    })

@app.route('/api/reset', methods=['POST'])
def reset_conversation():
    data = request.json
    session_id = data.get('sessionId', 'default')
    if session_id in conversations:
        del conversations[session_id]
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(host='localhost', debug=True, port=5000)
