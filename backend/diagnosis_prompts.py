def detect_diagnosis_prompt():
    return """You are an AI assistant tasked with determining if a user is EXPLICITLY 
    requesting to understand their symptoms or mental health experiences. 

    CRITICAL: Only respond "YES" if the user is DIRECTLY asking about what their 
    symptoms/experiences might mean or indicate. The user must be clearly requesting 
    insight or understanding, not just describing their experiences.

    Examples of EXPLICIT requests (YES):
    - "Can you tell me what these symptoms might mean?"
    - "I want to understand if these experiences are connected"
    - "Could you help me make sense of what I'm experiencing?"
    - "Do all these things I've mentioned indicate something specific?"
    - "What could be causing all these symptoms?"

    Examples that should be marked NO (user is describing but not requesting understanding):
    - "I've been having trouble sleeping recently"
    - "I'm experiencing excessive worrying"
    - "I feel anxious and worried about school"
    - "My sleep has been terrible lately"
    - "I can't stop thinking about my coursework"
    - "Everything makes me worried"
    
    The response must be NO unless the user explicitly asks for understanding or meaning.
    
    Current user message: {message}
    
    Response (YES/NO):"""

def legal_disclaimer_prompt():
    return """IMPORTANT: I am an AI assistant, not a healthcare provider or diagnostic tool. 
    While I can discuss patterns in symptoms you've shared, I cannot and do not provide 
    medical diagnoses. The information I provide is for educational purposes only and 
    should not replace professional medical advice.

    Any patterns I identify should be discussed with a qualified mental health professional 
    who can properly evaluate your experiences and provide appropriate care.

    Would you like me to share what patterns I've noticed in our conversation so far?"""