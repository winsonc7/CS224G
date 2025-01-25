import openai
import os
from basic_prompts import systemprompt_v0

# Load the API key from .env file
openai.api_key = os.getenv("OPENAI_API_KEY")

def main():
    print("Hi, I'm Talk2Me! What's on your mind? Type 'exit' to quit.\n")

    # Initialize the conversation with a system message
    conversation = [{"role": "system", "content": systemprompt_v0()}]

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
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=conversation
            )

            # Extract the chatbot's response
            bot_reply = response['choices'][0]['message']['content']
            print(f"Talk2Me: {bot_reply}")
            
            # Add chatbot response to the conversation
            conversation.append({"role": "assistant", "content": bot_reply})

        except openai.error.OpenAIError as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
