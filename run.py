import openai
import os
from basic_prompts import systemprompt_v0

# Load OpenAI API Key
os.environ["OPENAI_API_KEY"] = "INSERT OPENAI_API_KEY"

# Create an OpenAI client instance 
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Crisis-related keywords
CRISIS_KEYWORDS = {
    "suicide", "kill myself", "end my life", "self-harm", "cut myself",
    "overdose", "can't go on", "jump off", "hang myself", "hurting myself", "severe distress", "can't take it anymore",
    "hurt someone", "kill someone", "nothing matters", "no way out", "take too many pills", "taking drugs to end it",
    "panic attack", "losing control", "can't breathe", "voices telling me to hurt myself", "hallucinating", "seeing things"
}

# Crisis response message
CRISIS_MESSAGE = (
    "It sounds like you're in a really tough spot right now. You're not alone. \n"
    "Please reach out to a professional for support. If you need immediate help, \n"
    "you can contact Crisis Text Line by texting HOME to 741741 or call the Suicide & Crisis Lifeline at 988."
)

def contains_crisis_keywords(message):
    """
    Checks if the user's message contains any high-risk words that indicate a crisis.
    Returns True if a crisis keyword is found, otherwise False.
    """
    message = message.lower()  # Convert to lowercase for case-insensitive matching
    return any(keyword in message for keyword in CRISIS_KEYWORDS)

def analyze_sentiment_with_ai(conversation):
    """
    Uses OpenAI's model to classify sentiment and respond accordingly.
    """
    system_prompt = systemprompt_v0()
    
    # Add system message for guidance
    conversation.insert(0, {"role": "system", "content": system_prompt})

    try:
        response = client.chat.completions.create(  
            model="gpt-3.5-turbo",
            messages=conversation
        )
        return response.choices[0].message.content

    except openai.OpenAIError as e:
        return f"An error occurred while processing your request: {e}"

def main():
    """
    Main function to run the chatbot. It continuously takes user input, 
    checks for crisis situations, and responds accordingly.
    """
    print("Hi, I'm Talk2Me! What's on your mind? Type 'exit' to quit.\n")

    # Initialize conversation history
    conversation = [{"role": "system", "content": systemprompt_v0()}]

    while True:
        # Get user input
        user_input = input("You: ")

        if user_input.lower() == "exit":
            print("Goodbye! Take care! 💙")
            break
        
        # Crisis Detection
        if contains_crisis_keywords(user_input):
            print(f"Talk2Me: {CRISIS_MESSAGE}")
            continue

        # Add user message to conversation
        conversation.append({"role": "user", "content": user_input})

        # AI Sentiment Analysis
        bot_reply = analyze_sentiment_with_ai(conversation)
        print(f"Talk2Me: {bot_reply}")

        # Add chatbot response to history
        conversation.append({"role": "assistant", "content": bot_reply})

if __name__ == "__main__":
    main()
