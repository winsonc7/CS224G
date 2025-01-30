import os

import openai
from openai import OpenAI
from dotenv import load_dotenv

from basic_prompts import systemprompt_v0, cbtprompt_v0, robust_v0


load_dotenv()
# Load the API key from .env file
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

def _get_therapy_mode():
    therapy_options = {
        "1": systemprompt_v0,
        "2": cbtprompt_v0
    }
    
    prompt = """Please select your preferred therapy mode:
    1. General Counseling
    2. Cognitive Behavioral Therapy (CBT)
    Enter 1 or 2 (or type 'exit'): """

    while True:
        choice = input(prompt).lower()
        if choice == "exit":
            return
        if choice in therapy_options:
            return therapy_options[choice]()
        print(f"Choice {choice} is invalid. Please try again.")

def main():
    print("Hi, I'm Talk2Me! First, let's choose your preferred therapy mode. Type 'exit' to quit.\n")

    # Request user input for therapy style - General therapy/CBT
    system_prompt = _get_therapy_mode()
    if not system_prompt:
        print("Goodbye!")
        return
    system_prompt = system_prompt + robust_v0()
    conversation = [{"role": "developer", "content": system_prompt}]
    print("Talk2Me: What's on your mind?")

    while True:
        # Get user input
        user_input = input("You: ")
        
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
        
        # Add user message to the conversation
        conversation.append({"role": "user", "content": user_input})

        # Get response from OpenAI API
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=conversation
            )

            # Extract the chatbot's response
            bot_reply = response.choices[0].message.content
            print(f"Talk2Me: {bot_reply}")
            
            # Add chatbot response to the conversation
            conversation.append({"role": "assistant", "content": bot_reply})

        except openai.error.OpenAIError as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
