"""
Groq LLM Student Support Triage Engine.
Analyzes natural language messages to extract structured classification, urgency, and reasoning.
"""

import json
import os
from config import GROQ_API_KEY, MODEL_NAME
from safety import detect_crisis

SYSTEM_PROMPT = """You are a student support triage assistant for a university (DHRONA Student Support).
Your task is NOT to diagnose medical or mental health conditions, and NOT to act as a therapist.
Analyze the student's message and classify what type of university support they may need.

Possible categories:
- mental_wellbeing
- academic
- financial
- housing
- disability
- harassment
- general

Possible urgency:
- low
- medium
- high

Return ONLY valid JSON matching this schema:
{
  "category": "mental_wellbeing" | "academic" | "financial" | "housing" | "disability" | "harassment" | "general",
  "urgency": "low" | "medium" | "high",
  "confidence": 0.0 to 1.0,
  "reason": "Brief 1-2 sentence explanation of why this category and urgency were chosen.",
  "recommended_action": "Brief actionable next step",
  "crisis_flag": boolean
}

If the student appears to be in immediate danger or describes self-harm, suicide, or an immediate safety concern, set crisis_flag to true and urgency to high.
Do not provide a diagnosis.
Do not claim certainty.
"""

def fallback_heuristic_triage(message: str) -> dict:
    """
    Deterministic rule-based fallback when Groq API key is not configured or fails.
    Ensures 100% demo uptime and reliability during presentations.
    """
    text = message.lower()
    
    if detect_crisis(message):
        return {
            "category": "mental_wellbeing",
            "urgency": "high",
            "confidence": 0.99,
            "reason": "Immediate crisis indicators detected in message. Prompt safety intervention triggered.",
            "recommended_action": "Connect immediately to 24/7 Campus Crisis & Emergency Care",
            "crisis_flag": True
        }
        
    if any(k in text for k in ["exam", "class", "grade", "fail", "study", "workload", "course", "professor", "gpa", "homework", "deadline", "academic"]):
        return {
            "category": "academic",
            "urgency": "medium" if any(w in text for w in ["fail", "falling behind", "overwhelmed", "deadline"]) else "low",
            "confidence": 0.92,
            "reason": "Student reports challenges managing academic workload, course preparation, or academic performance.",
            "recommended_action": "Talk to Academic Advisor at Academic Success Center",
            "crisis_flag": False
        }

    if any(k in text for k in ["sleep", "stress", "anxious", "anxiety", "depressed", "overwhelmed", "lonely", "panic", "crying", "mental", "burnout"]):
        return {
            "category": "mental_wellbeing",
            "urgency": "medium",
            "confidence": 0.94,
            "reason": "Student reports symptoms of prolonged emotional distress, elevated stress, or sleep disruption.",
            "recommended_action": "Book priority counselling appointment at Student Wellness Center",
            "crisis_flag": False
        }

    if any(k in text for k in ["rent", "money", "afford", "tuition", "aid", "scholarship", "loan", "broke", "job", "financial", "payment"]):
        return {
            "category": "financial",
            "urgency": "medium",
            "confidence": 0.90,
            "reason": "Student describes financial hardship, difficulty meeting tuition/living expenses, or aid inquiries.",
            "recommended_action": "Schedule emergency financial consultation with Financial Aid Office",
            "crisis_flag": False
        }

    if any(k in text for k in ["roommate", "dorm", "housing", "landlord", "evict", "lease", "apartment", "homeless", "residence"]):
        return {
            "category": "housing",
            "urgency": "medium",
            "confidence": 0.91,
            "reason": "Student reports living situation conflict, lease complications, or housing stability concerns.",
            "recommended_action": "Contact Student Housing Office for mediation or room reassignment",
            "crisis_flag": False
        }

    if any(k in text for k in ["disability", "accommodation", "adhd", "wheelchair", "accessible", "audio", "extra time", "chronic"]):
        return {
            "category": "disability",
            "urgency": "low",
            "confidence": 0.93,
            "reason": "Student requests educational accommodations, accessibility assistance, or physical campus access.",
            "recommended_action": "Submit accommodations intake packet with Accessibility Services",
            "crisis_flag": False
        }

    if any(k in text for k in ["harass", "stalk", "threat", "assault", "abusive", "unsafe", "title ix"]):
        return {
            "category": "harassment",
            "urgency": "high",
            "confidence": 0.95,
            "reason": "Student describes interpersonal safety concerns, harassment, or hostile environment.",
            "recommended_action": "Contact Confidential Title IX Advocate immediately",
            "crisis_flag": True
        }

    return {
        "category": "general",
        "urgency": "low",
        "confidence": 0.85,
        "reason": "General student inquiry regarding campus navigation and university resources.",
        "recommended_action": "Connect with One-Stop Student Support Desk",
        "crisis_flag": False
    }

def triage_student(message: str) -> dict:
    """
    Main triage coordinator:
    1. Runs safety keyword check.
    2. If Groq API key is available, queries Groq LLM.
    3. Falls back to deterministic rule engine if API is unavailable.
    """
    if detect_crisis(message):
        return {
            "category": "mental_wellbeing",
            "urgency": "high",
            "confidence": 0.99,
            "reason": "Safety check detected immediate crisis keywords. Emergency routing activated.",
            "recommended_action": "Immediate Crisis Intervention",
            "crisis_flag": True
        }

    if not GROQ_API_KEY:
        return fallback_heuristic_triage(message)

    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Student message:\n\n{message}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        data = json.loads(completion.choices[0].message.content)
        # Ensure required fields exist
        if "category" not in data or "urgency" not in data:
            return fallback_heuristic_triage(message)
        return data
    except Exception as e:
        print(f"[Groq Triage Warning] Falling back to heuristic classifier: {e}")
        return fallback_heuristic_triage(message)
