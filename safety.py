"""
Safety keyword detection module for university student support triage.
Provides a deterministic first-layer safety check for immediate crisis terms.
"""

CRISIS_TERMS = [
    "kill myself",
    "hurt myself",
    "suicide",
    "end my life",
    "don't want to live",
    "dont want to live",
    "self harm",
    "self-harm",
    "end it all",
    "want to die",
    "overdose",
    "slit my wrists",
    "take my own life",
    "hanging myself",
    "jump off"
]

def detect_crisis(message: str) -> bool:
    """
    Checks if a student message contains any direct crisis indicators.
    Returns True if an immediate safety concern is detected.
    """
    if not message:
        return False
        
    text = message.lower()
    return any(term in text for term in CRISIS_TERMS)
