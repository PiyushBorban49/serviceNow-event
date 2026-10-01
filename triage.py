"""
Groq LLM Student Support Multi-Need Triage Engine.
Analyzes natural language messages to extract structured multi-need classification,
urgency levels, bulleted reason extraction, and handoff plan data.
"""

import json
import os
from config import GROQ_API_KEY, MODEL_NAME
from safety import detect_crisis
from routing import get_route, ROUTES

SYSTEM_PROMPT = """You are an advanced university student support triage coordinator (DHRONA Support Navigator).
Your task is NOT to diagnose medical or mental health conditions, and NOT to act as a therapist.
A student may present multiple simultaneous challenges (e.g. academic + financial + housing + mental wellbeing).

Analyze the student message and identify ALL distinct support categories needed.

Possible categories:
- mental_wellbeing
- academic
- financial
- housing
- disability
- harassment
- general

Return ONLY valid JSON with this schema:
{
  "needs": [
    {
      "category": "mental_wellbeing" | "academic" | "financial" | "housing" | "disability" | "harassment" | "general",
      "urgency": "low" | "medium" | "high",
      "confidence": 0.0 to 1.0,
      "extracted_points": ["bullet 1", "bullet 2"],
      "why_recommended": "You mentioned: ... Based on this, ... may be an appropriate place to start.",
      "recommended_action": "Actionable step"
    }
  ],
  "overall_urgency": "low" | "medium" | "high",
  "crisis_flag": boolean,
  "student_summary": "Concise 1-2 sentence handoff summary of all concerns"
}

If the student mentions self-harm or immediate crisis, set crisis_flag to true and overall_urgency to high.
"""

def fallback_multi_need_triage(message: str) -> dict:
    """
    Deterministic rule-based multi-need fallback engine.
    Detects 1 to 4 distinct student needs simultaneously with zero network dependency.
    """
    text = message.lower()
    
    if detect_crisis(message):
        return {
            "needs": [
                {
                    "category": "mental_wellbeing",
                    "urgency": "high",
                    "confidence": 0.99,
                    "extracted_points": ["Immediate crisis indicators detected", "Direct self-harm phrasing"],
                    "why_recommended": "Your message indicates an immediate safety concern. Licensed human crisis responders are standing by.",
                    "recommended_action": "Connect to 24/7 Campus Crisis Unit & 988 Lifeline"
                }
            ],
            "overall_urgency": "high",
            "crisis_flag": True,
            "student_summary": "Immediate crisis support requested."
        }

    needs = []

    # Academic
    if any(k in text for k in ["exam", "class", "grade", "fail", "study", "workload", "course", "professor", "gpa", "homework", "deadline"]):
        points = []
        if "exam" in text: points.append("Upcoming exam pressure & scheduling")
        if "fail" in text: points.append("Worry about failing classes or GPA decline")
        if "workload" in text or "overwhelm" in text: points.append("Managing cumulative coursework burden")
        if not points: points.append("Coursework organization & deadlines")
        
        needs.append({
            "category": "academic",
            "urgency": "medium" if ("fail" in text or "next week" in text) else "low",
            "confidence": 0.93,
            "extracted_points": points,
            "why_recommended": "You mentioned exam pressure and difficulties keeping pace with coursework. The Academic Success Center can coordinate workload restructuring or exam accommodations.",
            "recommended_action": "Schedule workload consultation with Academic Advisor"
        })

    # Mental Wellbeing
    if any(k in text for k in ["sleep", "stress", "anxious", "anxiety", "depress", "panic", "crying", "burnout", "exhausted", "lonely", "breakdown"]):
        points = []
        if "sleep" in text: points.append("Sleep disruption and insomnia")
        if "stress" in text: points.append("Elevated emotional and physiological stress")
        if "anxious" in text or "panic" in text: points.append("Acute anxiety symptoms or panic sensations")
        if not points: points.append("Emotional distress and mental fatigue")

        needs.append({
            "category": "mental_wellbeing",
            "urgency": "medium",
            "confidence": 0.95,
            "extracted_points": points,
            "why_recommended": "You mentioned ongoing sleep disruption and feeling overwhelmed. Speaking with a confidential counselor can help stabilize stress and prevent burnout.",
            "recommended_action": "Book priority confidential intake session with Counselling Services"
        })

    # Financial
    if any(k in text for k in ["rent", "money", "afford", "tuition", "aid", "scholarship", "loan", "broke", "job", "financial", "fee"]):
        points = []
        if "tuition" in text or "fee" in text: points.append("Tuition payment deadlines")
        if "rent" in text or "broke" in text: points.append("Emergency living expense shortage")
        if "job" in text: points.append("Loss of student employment income")
        if not points: points.append("Financial hardship or grant inquiries")

        needs.append({
            "category": "financial",
            "urgency": "medium",
            "confidence": 0.91,
            "extracted_points": points,
            "why_recommended": "You highlighted urgent tuition or living expense concerns. Financial Services provides emergency micro-grants and deferral options.",
            "recommended_action": "Apply for Student Emergency Relief Fund & installment plan"
        })

    # Housing
    if any(k in text for k in ["roommate", "dorm", "housing", "landlord", "evict", "lease", "apartment", "living situation"]):
        points = []
        if "roommate" in text: points.append("Roommate friction and living space conflict")
        if "evict" in text or "lease" in text: points.append("Housing security or lease termination risk")
        if not points: points.append("Campus residence stability concerns")

        needs.append({
            "category": "housing",
            "urgency": "medium",
            "confidence": 0.92,
            "extracted_points": points,
            "why_recommended": "You noted interpersonal living friction with a roommate and worry about housing stability. The Housing Office offers neutral mediation and emergency room swaps.",
            "recommended_action": "Request confidential roommate mediation or room reassignment"
        })

    if not needs:
        needs.append({
            "category": "general",
            "urgency": "low",
            "confidence": 0.85,
            "extracted_points": ["General campus navigation inquiry"],
            "why_recommended": "Your inquiry covers broad campus topics. The One-Stop Support Desk connects students to the appropriate staff.",
            "recommended_action": "Connect with One-Stop Support Specialist"
        })

    has_high = any(n["urgency"] == "high" for n in needs)
    has_med = any(n["urgency"] == "medium" for n in needs)
    overall_urgency = "high" if has_high else "medium" if has_med else "low"

    return {
        "needs": needs,
        "overall_urgency": overall_urgency,
        "crisis_flag": False,
        "student_summary": f"Student reports concurrent concerns across: {', '.join(n['category'].replace('_', ' ').title() for n in needs)}."
    }

def triage_student(message: str) -> dict:
    """
    Main entry point for multi-need student triage.
    """
    if detect_crisis(message):
        return fallback_multi_need_triage(message)

    if not GROQ_API_KEY:
        return fallback_multi_need_triage(message)

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
        if "needs" not in data or not data["needs"]:
            return fallback_multi_need_triage(message)
        return data
    except Exception as e:
        print(f"[Groq Multi-Need Warning] Falling back: {e}")
        return fallback_multi_need_triage(message)
