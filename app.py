"""
DHRONA — Student Support Navigator
Track 01: Multi-Need Triage, Consent Handoff & Coordinated Campus Support
Streamlit Application
"""

import streamlit as st
from triage import triage_student
from routing import get_route, ROUTES
from safety import detect_crisis

st.set_page_config(
    page_title="DHRONA — Support Navigator",
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
st.title("🎓 DHRONA — Student Support Navigator")
st.caption("Understand the student → Assess urgency → Identify multiple concurrent needs → One-click handoff.")

# 12 Departments challenge metric cards
col1, col2, col3 = st.columns(3)
with col1:
    st.metric(label="Fragmented University Departments", value="12 Silos", delta="Campus Maze", delta_color="inverse")
with col2:
    st.metric(label="Average Intake Wait Time", value="3 Weeks", delta="Pre-triage delay", delta_color="inverse")
with col3:
    st.metric(label="Bounced / Misdirected Referrals", value="+40%", delta="Student friction", delta_color="inverse")

st.divider()

# Sidebar: Quick Demo Scenarios
with st.sidebar:
    st.header("⚡ Killer Demo Scenarios")
    st.info("Test with complex multi-need student situations:")
    
    preset_multi = st.button("⭐ Test 1: Exams + Roommate + Tuition (3 Needs)")
    preset_dual = st.button("🧠 Test 2: Panic Attacks & Failing Course (2 Needs)")
    preset_housing = st.button("🏠 Test 3: Eviction Risk & Lost Job (2 Needs)")
    preset_academic = st.button("📚 Test 4: Single Need - Study Workload")
    preset_crisis = st.button("🚨 Test 5: Immediate Safety Intercept")
    
    st.divider()
    st.subheader("🏛️ 12 Campus Silos")
    with st.expander("View fragmented department directory"):
        for key, val in ROUTES.items():
            st.markdown(f"**{val['service']}** ({val['department']})\n📍 {val['location']}")

# Handle presets
default_text = ""
if preset_multi:
    default_text = "I'm struggling with exams, my roommate situation is getting worse every day, and I'm stressed about paying my tuition next month. I don't know who to talk to."
elif preset_dual:
    default_text = "I haven't slept in three days because I'm failing Organic Chemistry. I'm having panic attacks before every lab lecture."
elif preset_housing:
    default_text = "My landlord threatened to evict me and I just lost my on-campus dining hall job. I have no money for rent or food."
elif preset_academic:
    default_text = "I am having trouble organizing my study schedule and balancing four heavy project deadlines this month."
elif preset_crisis:
    default_text = "I feel like hurting myself and I don't know what to do."

# Input section
st.subheader("Tell us what's going on")
col_input, col_start_btn = st.columns([4, 1])
with col_start_btn:
    if st.button("❓ I Don't Know Where To Start", use_container_width=True):
        default_text = "I'm struggling with exams, my roommate situation is getting worse every day, and I'm stressed about paying my tuition next month. I don't know who to talk to."

student_message = st.text_area(
    "Describe everything on your plate in your own words:",
    value=default_text,
    height=120,
    placeholder="e.g. I'm struggling with exams, my roommate situation is getting worse, and I'm stressed about paying tuition..."
)

col_btn, col_info = st.columns([1, 3])
with col_btn:
    submit = st.button("🔍 Build My Support Plan", type="primary", use_container_width=True)
with col_info:
    st.caption("🔒 *Confidential • Zero medical diagnostic labeling • Support navigation recommendation only.*")

if submit and student_message.strip():
    with st.spinner("Analyzing multi-need dependencies and consulting campus routing rules..."):
        triage_data = triage_student(student_message)
        needs = triage_data.get("needs", [])
        overall_urgency = triage_data.get("overall_urgency", "low").upper()
        crisis_flag = triage_data.get("crisis_flag", False)
        student_summary = triage_data.get("student_summary", "")

    st.divider()

    # IF CRISIS / IMMEDIATE SAFETY
    if crisis_flag or detect_crisis(student_message):
        st.error("### ⚠️ IMMEDIATE SUPPORT REQUIRED")
        st.markdown("""
        **Your message suggests you may need immediate care or support.**
        Please connect with one of these confidential, 24/7 emergency responders right now:
        """)
        
        c1, c2, c3 = st.columns(3)
        with c1:
            st.warning("🚨 **Campus Emergency Support**\n\n📞 **(555) 911-HELP**\n\n*Available 24/7 on campus*")
        with c2:
            st.warning("🛡️ **988 Suicide & Crisis Lifeline**\n\n📞 Call or Text **988**\n\n*Free, confidential, 24/7 nationwide*")
        with c3:
            st.warning("👮 **Campus Security & Escort**\n\n📞 **(555) 019-SAFE**\n\n*Immediate safety dispatch*")
            
        st.info("A dedicated student wellness advocate is also on standby to assist you immediately.")
    
    # MULTI-NEED SUPPORT PLAN
    else:
        st.success(f"### ✅ COORDINATED SUPPORT PLAN: {len(needs)} CAMPUS NEEDS DETECTED")
        st.info(f"**Overall Urgency:** `{overall_urgency}` | **Coordinated Summary:** {student_summary}")

        for idx, need in enumerate(needs):
            cat = need.get("category", "general")
            route = get_route(cat)
            
            with st.container():
                st.markdown(f"#### Pathway {idx + 1}: {route['service']} ({cat.replace('_', ' ').title()})")
                
                # "Why we recommend this" (Explainable Recommendation)
                st.markdown("**Why We Recommend This:**")
                points = need.get("extracted_points", [])
                for p in points:
                    st.markdown(f"- *{p}*")
                st.caption(need.get("why_recommended", ""))

                c_info, c_action = st.columns([2, 1])
                with c_info:
                    st.markdown(f"📍 **Location:** {route['location']}\n🕒 **Hours:** {route['hours']}\n📞 **Phone:** {route['contact_phone']}")
                with c_action:
                    st.button(f"📅 {route['action']}", key=f"book_{cat}_{idx}", use_container_width=True)

                st.divider()

        # ONE-CLICK HANDOFF SLIP
        st.subheader("📄 One-Click Unified Handoff")
        st.markdown("Transmit your pre-triaged summary to the duty advisors above so you don't have to repeat your story.")

        c_consent1 = st.checkbox("Approve sharing structured concern summary & urgency", value=True)
        c_consent2 = st.checkbox("DO NOT share raw conversational transcript", value=True)

        if st.button("🚀 Approve & Generate Unified Handoff Slip", type="primary"):
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
