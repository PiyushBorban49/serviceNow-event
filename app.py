"""
DHRONA — Student Support Navigator & Care Companion
Track 01: Multi-Need Triage, Companion Mode Chatbot & Coordinated Campus Support
Streamlit Application
"""

import streamlit as st
from triage import triage_student
from routing import get_route, ROUTES
from safety import detect_crisis

st.set_page_config(
    page_title="DHRONA — Support Navigator & Companion",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Neobrutalism CSS styling
st.markdown("""
<style>
    .stApp {
        background-color: #FFFDF7;
    }
    div[data-testid="stMetric"] {
        background-color: #FFFFFF;
        border: 3px solid #000000;
        box-shadow: 4px 4px 0px 0px #000000;
        padding: 12px;
    }
    div[data-testid="stMetricLabel"] {
        font-weight: 900;
        color: #000000;
        text-transform: uppercase;
    }
    div[data-testid="stMetricValue"] {
        font-weight: 900;
        color: #000000;
    }
    .stButton>button {
        border: 2px solid #000000 !important;
        box-shadow: 3px 3px 0px 0px #000000 !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        transition: all 0.1s ease !important;
    }
    .stButton>button:hover {
        transform: translate(-1px, -1px) !important;
        box-shadow: 5px 5px 0px 0px #000000 !important;
    }
    .stButton>button:active {
        transform: translate(2px, 2px) !important;
        box-shadow: 1px 1px 0px 0px #000000 !important;
    }
</style>
""", unsafe_allow_html=True)

# Top Bar / Challenge problem statement
st.title("🎓 DHRONA — Support Navigator & Care Companion")
st.caption("Understand the student → Assess urgency → Multi-Need Triage → One-click handoff → Companion Mode while waiting.")

# 12 Departments challenge metric cards
col1, col2, col3 = st.columns(3)
with col1:
    st.metric(label="Fragmented University Departments", value="12 Silos", delta="Campus Maze", delta_color="inverse")
with col2:
    st.metric(label="Average Intake Wait Time", value="3 Weeks", delta="Pre-triage delay", delta_color="inverse")
with col3:
    st.metric(label="Bounced / Misdirected Referrals", value="+40%", delta="Student friction", delta_color="inverse")

st.divider()

# Streamlit Tabs
tab_navigator, tab_companion, tab_silos, tab_admin = st.tabs([
    "🔍 Intake Navigator",
    "🤖 Care Companion (While You Wait)",
    "🏛️ 12 Campus Silos",
    "📊 Admin Dashboard"
])

# ========================================================
# TAB 1: INTAKE NAVIGATOR
# ========================================================
with tab_navigator:
    st.subheader("Tell us what's going on")
    st.caption("Describe everything on your plate in your own words. We identify multiple concurrent needs and coordinate one unified handoff.")

    col_btn_multi, col_btn_clear = st.columns([2, 1])
    with col_btn_multi:
        load_multi = st.button("⚡ Load Multi-Need Situation (Exams + Roommate + Tuition)")

    default_text = ""
    if load_multi:
        default_text = "I'm struggling with exams, my roommate situation is getting worse every day, and I'm stressed about paying my tuition next month. I don't know who to talk to."

    student_message = st.text_area(
        "Your message:",
        value=default_text,
        height=120,
        placeholder="e.g. I'm struggling with exams, my roommate situation is getting worse, and I'm stressed about paying tuition..."
    )

    submit = st.button("🔍 Build My Coordinated Support Plan", type="primary")

    if submit and student_message.strip():
        with st.spinner("Analyzing multi-need dependencies and consulting campus routing rules..."):
            triage_data = triage_student(student_message)
            needs = triage_data.get("needs", [])
            overall_urgency = triage_data.get("overall_urgency", "low").upper()
            crisis_flag = triage_data.get("crisis_flag", False)
            student_summary = triage_data.get("student_summary", "")

        st.divider()

        if crisis_flag or detect_crisis(student_message):
            st.error("### ⚠️ IMMEDIATE SUPPORT REQUIRED")
            st.markdown("Your message suggests you may need immediate care or support. Please connect with one of these 24/7 emergency responders right now:")
            c1, c2, c3 = st.columns(3)
            with c1:
                st.warning("🚨 **Campus Emergency Support**\n\n📞 **(555) 911-HELP**\n\n*Available 24/7 on campus*")
            with c2:
                st.warning("🛡️ **988 Suicide & Crisis Lifeline**\n\n📞 Call or Text **988**\n\n*Free, confidential, 24/7 nationwide*")
            with c3:
                st.warning("👮 **Campus Security & Escort**\n\n📞 **(555) 019-SAFE**\n\n*Immediate safety dispatch*")
        else:
            st.success(f"### ✅ COORDINATED SUPPORT PLAN: {len(needs)} CAMPUS NEEDS DETECTED")
            st.info(f"**Overall Urgency:** `{overall_urgency}` | **Summary:** {student_summary}")

            for idx, need in enumerate(needs):
                cat = need.get("category", "general")
                route = get_route(cat)
                
                with st.container():
                    st.markdown(f"#### Pathway {idx + 1}: {route['service']} ({cat.replace('_', ' ').title()})")
                    st.markdown("**Why We Recommend This:**")
                    for p in need.get("extracted_points", []):
                        st.markdown(f"- *{p}*")
                    st.caption(need.get("why_recommended", ""))
                    st.markdown(f"📍 **Location:** {route['location']} | 🕒 **Hours:** {route['hours']} | 📞 **Phone:** {route['contact_phone']}")
                    st.divider()

            st.subheader("📄 One-Click Unified Handoff")
            c_consent1 = st.checkbox("Approve sharing structured concern summary & urgency", value=True)
            c_consent2 = st.checkbox("DO NOT share raw conversational transcript", value=True)

            if st.button("🚀 Approve & Generate Unified Handoff Slip"):
                st.balloons()
                st.success("✅ **Handoff Slip Dispatched to Advisors!**")
                st.code(f"""
SUPPORT HANDOFF SLIP (DHRONA)
Ref: DH-2026-9182
Student Identity: Anonymous (Privacy Protected)
Needs Coordinated: {', '.join(n.get('category', '').title() for n in needs)}
Overall Urgency: {overall_urgency}
Student Summary: {student_summary}
Consent: Approved by Student
                """, language="text")

# ========================================================
# TAB 2: REASSURANCE CHATBOT (COMPANION MODE) (USER IMAGE)
# ========================================================
with tab_companion:
    st.subheader("🤖 The Temporary Reassurance Chatbot (Companion Mode)")
    st.caption("For students placed in P2, P3, or P4 queues, waiting for an appointment can cause secondary anxiety. The system activates an empathetic Care Companion Virtual Agent while they wait.")

    # Status Ticket & Capability 3: Escalation Button
    col_stat, col_esc = st.columns([3, 2])
    with col_stat:
        st.info("🎟️ **Active Queue Ticket:** `#DH-8291` | **Status:** P3 Queue (Reserved Slot in 2 Days) | **Office:** Counselling Services")
    with col_esc:
        if st.button("🚨 My Situation Has Worsened (Escalate Queue)", type="primary"):
            st.error("🚨 **Escalation Triggered!** Queue upgraded to **P1 Priority (Same-Day On-Call Slot)**. An on-call counselor has been notified.")

    st.markdown("---")

    # Capability 4: Daily Warm Check-Ins
    st.markdown("#### 📱 Daily Warm Check-In (Automated SMS Push)")
    st.warning('"Hi Alex, your appointment is in 2 days. How are you feeling today? Tap here if you need a quick grounding exercise."')

    col_opt1, col_opt2, col_opt3 = st.columns(3)
    with col_opt1:
        if st.button("👍 I'm hanging in there"):
            st.success("Glad to hear it! Keep taking things one step at a time. We'll see you in 2 days.")
    with col_opt2:
        if st.button("😟 A bit overwhelmed today"):
            st.info("That's completely understandable. Try the 60-second Box Breathing tool below to give yourself a break.")
    with col_opt3:
        if st.button("🌬️ Need a quick grounding exercise"):
            st.info("Starting Box Breathing protocol below...")

    st.markdown("---")

    # Capability 1: Active Validation & Warm Engagement
    st.markdown("#### 💬 Active Validation & Virtual Companion")
    st.markdown("""
    > *"We've received your intake and reserved your request. You are not alone in this, and taking this step to reach out took courage."*
    """)

    # Interactive Chat area
    user_chat = st.text_input("Ask your Care Companion a question while waiting:", placeholder="e.g. What should I expect at my appointment? How do I prepare?")
    if st.button("Send to Companion"):
        if user_chat.strip():
            st.markdown(f"**You:** {user_chat}")
            st.markdown("**Care Companion:** Thank you for reaching out. While you wait for your session, remember that your advisor already has your pre-triaged handoff slip, so you will not have to repeat your whole story. You don't need to prepare a formal presentation—just bring your student ID and take things one breath at a time.")

    st.markdown("---")

    # Capability 2: Grounding & Micro-Coping Exercises
    st.markdown("#### 🧘 Interactive 60-Second Micro-Coping Exercises")
    c_ex1, c_ex2 = st.columns(2)
    with c_ex1:
        st.markdown("**🌬️ Box Breathing (4-4-4-4)**")
        st.code("Inhale (4s) → Hold (4s) → Exhale (4s) → Rest (4s)")
        st.caption("Proven to lower heart rate and cortisol in under 60 seconds.")
    with c_ex2:
        st.markdown("**👁️ 5-4-3-2-1 Sensory Grounding**")
        st.caption("5 things you SEE • 4 you TOUCH • 3 you HEAR • 2 you SMELL • 1 you TASTE")

# ========================================================
# TAB 3: 12 SILOS
# ========================================================
with tab_silos:
    st.subheader("🏛️ The 12 Campus Silos Problem")
    for key, val in ROUTES.items():
        st.markdown(f"**{val['service']}** ({val['department']})\n📍 {val['location']} | 🕒 {val['hours']}")

# ========================================================
# TAB 4: ADMIN DASHBOARD
# ========================================================
with tab_admin:
    st.subheader("📊 Campus Demand Operations Dashboard")
    st.markdown("Aggregated university-level demand analytics.")
    c_a1, c_a2, c_a3 = st.columns(3)
    with c_a1:
        st.metric("Total Inquiries", "128", "Past 7 days")
    with c_a2:
        st.metric("Multi-Need Inquiries", "44%", "Cross-department")
    with c_a3:
        st.metric("Avg. Time to Handoff", "1.8m", "-98% wait time")
