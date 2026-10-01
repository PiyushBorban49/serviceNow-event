# DHRONA — Student Support & AI Triage (Track 01)

> **Help students reach the right support quickly without having to navigate university organizational silos.**

## The Core Problem
Universities typically operate **12+ fragmented departments** (Counselling, Academic Advising, Financial Aid, Housing, Accessibility, Title IX, Health Center, Career, etc.).
- **3-week average wait times** for students navigating queues.
- **+40% bounced or misdirected referrals** as students get referred from one office to another.

## Solution Architecture

```text
Student
   ↓
Describe their problem in plain natural language
   ↓
Safety Keyword Check (Deterministic Layer: self-harm / crisis detection)
   ├── [Crisis Detected] ──► 🚨 Immediate Emergency Protocol (988, Campus Crisis)
   └── [Standard / Safe] ──► Groq LLM (llama-3.3-70b-versatile)
                                ↓
                          AI Structured Triage (Category, Urgency, Confidence, Reason)
                                ↓
                          University Routing Engine (Deterministic routing table)
                                ↓
                          Correct Campus Department & Actionable Next Step
```

## Quick Start (Python & Streamlit)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Add your Groq API key (optional; system includes offline fallback)
echo "GROQ_API_KEY=your_key_here" >> .env

# 3. Run Streamlit
streamlit run app.py
```

## Quick Start (Interactive Web App)

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Build production bundle
npm run build
```

## Project Structure
```text
student-triage/
├── app.py              # Streamlit frontend & interactive demo screens
├── triage.py           # Groq LLM triage integration & heuristic fallback
├── routing.py          # Campus department routing table & rule engine
├── safety.py           # First-layer deterministic safety keyword detection
├── config.py           # Environment & model configuration
├── requirements.txt    # Python requirements (streamlit, groq, python-dotenv)
├── src/                # Modern React + TypeScript + Tailwind web application
│   ├── App.tsx         # Full DHRONA interactive student support interface
│   └── services/       # Triage and 12-department directory data
└── .env.example        # Environment variables template
```
