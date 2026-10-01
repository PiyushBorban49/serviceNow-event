"""
DHRONA — Student Support & AI Triage
Track 01: Student Triage & Routing
Streamlit Interactive Application
"""

import streamlit as st
from triage import triage_student
from routing import get_route, ROUTES
from safety import detect_crisis

st.set_page_config(
    page_title="DHRONA — Student Support Triage",
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
    .crisis-card {
        background-color: #FF4949;
        border: 4px solid #000000;
        box-shadow: 8px 8px 0px 0px #000000;
        padding: 24px;
        color: #000000;
        font-weight: bold;
    }
    .support-card {
        background-color: #FFFFFF;
        border: 3px solid #000000;
        box-shadow: 6px 6px 0px 0px #000000;
        padding: 24px;
    }
</style>
""", unsafe_allow_html=True)

# Top Bar / Challenge problem statement
st.title("🎓 DHRONA — Student Support & AI Triage")
st.caption("Find the right university support quickly without knowing which department to contact.")

# 12 Departments challenge metric cards
col1, col2, col3 = st.columns(3)
with col1:
    st.metric(label="Fragmented University Departments", value="12 Departments", delta="Campus Maze", delta_color="inverse")
with col2:
    st.metric(label="Average Intake Wait Time", value="3 Weeks", delta="Pre-triage delay", delta_color="inverse")
with col3:
    st.metric(label="Bounced / Misdirected Referrals", value="+40%", delta="Student friction", delta_color="inverse")

st.divider()

# Sidebar: One-click demo test scenarios
with st.sidebar:
    st.header("⚡ Quick Demo Scenarios")
    st.info("Click any preset below to test with realistic student problems:")
    
    preset_1 = st.button("📚 Test 1: Academic Overload")
    preset_2 = st.button("🧠 Test 2: Stress & Sleep (Mental Health)")
    preset_3 = st.button("🏠 Test 3: Housing / Roommate Conflict")
    preset_4 = st.button("💰 Test 4: Financial Hardship & Tuition")
    preset_5 = st.button("🚨 Test 5: Immediate Safety Crisis")
    
    st.divider()
    st.subheader("🏛️ All 12 Campus Departments")
    with st.expander("View fragmented department directory"):
        for key, val in ROUTES.items():
            st.markdown(f"**{val['service']}** ({val['department']})\n📍 {val['location']}")

# Handle presets
default_text = ""
if preset_1:
    default_text = "I am struggling to keep up with my classes and I don't know how to organize my workload."
elif preset_2:
    default_text = "I haven't been sleeping properly for the last two weeks. Exams are coming up and I'm extremely stressed."
elif preset_3:
    default_text = "I don't know who to talk to. I'm having problems with my roommate and I'm worried I might lose my housing."
elif preset_4:
    default_text = "I lost my on-campus part-time job and my family cannot help with next month's tuition payment."
elif preset_5:
    default_text = "I feel like hurting myself and I don't know what to do."

# Input section
st.subheader("Tell us what's going on")
student_message = st.text_area(
    "Describe what you are struggling with in your own words:",
    value=default_text,
    height=120,
    placeholder="e.g., I've been feeling overwhelmed with my exams and can't sleep, or I'm struggling with rent..."
)

col_btn, col_info = st.columns([1, 3])
with col_btn:
    submit = st.button("🔍 Find My Support", type="primary", use_container_width=True)
with col_info:
    st.caption("🔒 *Your message is analyzed purely for routing to campus support services. AI does not diagnose medical conditions.*")

if submit and student_message.strip():
    with st.spinner("Analyzing message and consulting campus routing rules..."):
        # Layer 1 Safety check + Layer 2 AI Triage
        result = triage_student(student_message)
        category = result.get("category", "general")
        urgency = result.get("urgency", "low").upper()
        confidence = int(float(result.get("confidence", 0.90)) * 100)
        reason = result.get("reason", "")
        crisis_flag = result.get("crisis_flag", False)
        
        # Layer 3 Routing
        route = get_route(category)

    st.divider()

    # IF CRISIS / IMMEDIATE SAFETY
    if crisis_flag or urgency == "HIGH" or detect_crisis(student_message):
        st.error("### ⚠️ IMMEDIATE SUPPORT AVAILABLE")
        st.markdown("""
        **Your message suggests you may need immediate care or support.**
        Please connect with one of these confidential, 24/7 crisis resources right now:
        """)
        
        c1, c2, c3 = st.columns(3)
        with c1:
            st.warning("🚨 **Campus Emergency Support**\n\n📞 **(555) 911-HELP**\n\n*Available 24/7 on campus*")
        with c2:
            st.warning("🛡️ **988 Suicide & Crisis Lifeline**\n\n📞 Call or Text **988**\n\n*Free, confidential, 24/7 nationwide*")
        with c3:
            st.warning("👮 **Campus Security & Escort**\n\n📞 **(555) 019-SAFE**\n\n*Immediate safety dispatch*")
            
        st.info("A dedicated student wellness advocate is also on standby to assist you immediately.")
    
    # NORMAL / MEDIUM / LOW TRIAGE
    else:
        st.success("### ✅ YOUR RECOMMENDED SUPPORT PATH")
        
        # Flow diagram visualization
        path_cols = st.columns(5)
        with path_cols[0]:
            st.markdown(f"**1. Input Received**\n\n*Student Message*")
        with path_cols[1]:
            st.markdown("➡️")
        with path_cols[2]:
            st.markdown(f"**2. AI Triage**\n\n`{category.replace('_', ' ').title()}`")
        with path_cols[3]:
            st.markdown("➡️")
        with path_cols[4]:
            st.markdown(f"**3. Target Service**\n\n**{route['service']}**")

        st.markdown("<br>", unsafe_allow_html=True)
        
        col_res_left, col_res_right = st.columns([2, 1])
        
        with col_res_left:
            st.markdown(f"#### 🏛️ {route['service']}")
            st.markdown(f"**Department:** {route['department']}")
            st.markdown(f"**Location:** 📍 `{route['location']}`")
            st.markdown(f"**Operating Hours:** 🕒 {route['hours']}")
            st.markdown(f"**Why we recommend this:** {reason}")
            
            st.markdown("---")
            st.markdown(f"#### 🎯 Recommended Action: `{route['action']}`")
            if route.get("priority_support"):
                st.caption(f"⚡ {route['priority_support']}")
                
            b1, b2 = st.columns(2)
            with b1:
                st.button(f"📅 {route['action']}", type="primary", key="btn_book")
            with b2:
                st.button("✉️ Contact Dedicated Advisor", key="btn_contact")

        with col_res_right:
            st.markdown("#### 📊 Triage Summary")
            st.markdown(f"**Urgency Level:** `{urgency}`")
            st.markdown(f"**Confidence Score:** `{confidence}%`")
            st.markdown(f"**Phone:** `{route['contact_phone']}`")
            st.markdown(f"**Email:** `{route['contact_email']}`")
            
            with st.expander("🔍 View Raw Structured JSON"):
                st.json({
                    "category": category,
                    "urgency": urgency.lower(),
                    "confidence": confidence / 100.0,
                    "service": route["service"],
                    "reason": reason,
                    "crisis_flag": crisis_flag
                })
