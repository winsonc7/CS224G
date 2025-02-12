import openai
import os
import re
from basic_prompts import systemprompt_v0

# Load OpenAI API Key
os.environ["OPENAI_API_KEY"] = "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"

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

# Symptom-diagnosis mapping
MENTAL_HEALTH_CONDITIONS = {
    "Anxiety Disorder": [
        "constant worry", "panic attacks", "feeling on edge", "racing thoughts",
        "difficulty concentrating", "sweaty palms", "shortness of breath", "heart pounding"
    ],
    "Depression": [
        "feeling hopeless", "lost interest in activities", "can't get out of bed",
        "lack of motivation", "fatigue", "overwhelming sadness", "worthless",
        "thoughts of death", "no energy"
    ],
    "Identity & Self-Esteem Issues": [
        "I don’t know who I am", "I feel like a failure", "I hate myself",
        "I don’t fit in", "I feel lost", "I feel worthless", "nobody likes me"
    ]
}

def match_mental_health_condition(message):
    """
    Matches user input against known mental health symptoms.
    Returns a possible diagnosis and suggestions if symptoms are detected.
    """
    matched_conditions = []
    message_lower = message.lower()

    for condition, symptoms in MENTAL_HEALTH_CONDITIONS.items():
        for symptom in symptoms:
            if re.search(r'\b' + re.escape(symptom) + r'\b', message_lower):
                matched_conditions.append(condition)
                break  # Avoid duplicate matches for the same condition

    if matched_conditions:
        response = "Based on what you’ve shared, you might be experiencing signs of:\n"
        response += "\n".join(f"- {condition}" for condition in matched_conditions)
        response += (
            "\nIt's important to remember that I'm not a doctor, but if you're struggling, "
            "consider reaching out to a mental health professional. Would you like some self-help strategies?"
        )
        return response
    return None


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

        # Check for mental health condition matches
        diagnosis_response = match_mental_health_condition(user_input)
        if diagnosis_response:
            print(f"Talk2Me: {diagnosis_response}")
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
