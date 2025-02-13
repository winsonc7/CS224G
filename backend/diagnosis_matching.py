from diagnosis_prompts import detect_diagnosis_prompt
from openai import OpenAI

def detect_diagnosis_request(message: str, client: OpenAI) -> bool:
    """
    Determines if user is requesting to understand their symptoms/experiences.
    Returns True if user is requesting symptom understanding, False otherwise.
    """
    prompt = detect_diagnosis_prompt().format(message=message)
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return "YES" in response.choices[0].message.content.upper()

def get_user_confirmation(user_input: str, client: OpenAI) -> bool:
    """
    Determines if user wants to proceed with symptom pattern discussion
    after seeing legal disclaimer.
    """
    confirmation_prompt = """Determine if the user is agreeing to proceed with 
    discussing symptom patterns after seeing the legal disclaimer.
    
    Respond only with 'YES' if user clearly agrees/wants to proceed, or 'NO' if unclear or declines.
    
    User response: {message}"""
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": confirmation_prompt.format(message=user_input)}]
    )
    
    return "YES" in response.choices[0].message.content.upper()