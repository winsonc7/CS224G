import os
import signal

import openai
from openai import OpenAI
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ClientTools
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface
from dotenv import load_dotenv

from basic_prompts import systemprompt_v0, cbtprompt_v0, robust_v0

load_dotenv()

class TherapyMode:
    TEXT = "text"
    VOICE = "voice"

class TherapyStyle:
    GENERAL = "1"
    CBT = "2"

def setup_clients():
    """Initialize OpenAI and ElevenLabs clients"""
    chat_client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
    audio_client = ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])
    audio_agent_id = os.environ["ELEVENLABS_AGENT_ID"]

    return chat_client, audio_client, audio_agent_id

def setup_logging():
    """Setup logging tools"""
    def log_message(parameters):
        message = parameters.get("message")
        print(message)
        
    client_tools = ClientTools()
    client_tools.register("logMessage", log_message)
    return client_tools

def get_therapy_config():
    """Get user's preferred therapy mode and style"""
    therapy_options = {
        TherapyStyle.GENERAL: systemprompt_v0,
        TherapyStyle.CBT: cbtprompt_v0
    }
    
    prompt = """Please select your therapy preferences:

Mode:
[T] Text-based therapy
[V] Voice-based therapy

Style (for text mode):
[1] General Counseling
[2] Cognitive Behavioral Therapy (CBT)

Enter T1/T2 for text mode or V for voice mode (or 'exit'): """

    while True:
        choice = input(prompt).lower()
        if choice == "exit":
            return None, None
            
        if choice.startswith('t'):
            style = choice[1:]
            if style in therapy_options:
                return TherapyMode.TEXT, therapy_options[style]()
                
        elif choice == 'v':
            return TherapyMode.VOICE, None
            
        print("Invalid choice. Please try again.")

def handle_voice_therapy(audio_client, audio_agent_id):
    """Handle voice-based therapy session"""
    conversation = Conversation(
        audio_client,
        audio_agent_id,
        requires_auth=True,
        audio_interface=DefaultAudioInterface(),
        callback_agent_response=lambda response: print(f"Talk2Me: {response}"),
        callback_agent_response_correction=lambda original, corrected: print(f"Talk2Me: {original} -> {corrected}"),
        callback_user_transcript=lambda transcript: print(f"Me: {transcript}")
    )
    
    conversation.start_session()
    signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())
    conversation_id = conversation.wait_for_session_end()
    print(f"Conversation ID: {conversation_id}")

def handle_text_therapy(system_prompt, chat_client):
    """Handle text-based therapy session"""
    conversation = [{"role": "developer", "content": system_prompt + robust_v0()}]
    print("\nTalk2Me: What would you like to talk about?")

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
            
        conversation.append({"role": "user", "content": user_input})

        try:
            response = chat_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=conversation
            )
            bot_reply = response.choices[0].message.content
            print(f"Talk2Me: {bot_reply}")
            conversation.append({"role": "assistant", "content": bot_reply})

        except openai.error.OpenAIError as e:
            print(f"An error occurred: {e}")

def main():
    chat_client, audio_client, audio_agent_id = setup_clients()
    client_tools = setup_logging()

    print("Welcome to Talk2Me, your 24/7 AI therapist!")
    print("Please take a deep breath and ensure you're in a comfortable, private space.")
    
    mode, system_prompt = get_therapy_config()
    if not mode:
        print("Goodbye!")
        return
        
    if mode == TherapyMode.VOICE:
        handle_voice_therapy(audio_client, audio_agent_id)
    else:
        handle_text_therapy(system_prompt, chat_client)

if __name__ == "__main__":
    main()
    