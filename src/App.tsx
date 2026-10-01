import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Brain, 
  BookOpen, 
  Home, 
  Coins, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowRight, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Layers, 
  Code, 
  X, 
  PhoneCall, 
  Check, 
  Compass, 
  Flame, 
  Zap, 
  HelpCircle, 
  FileText, 
  UserCheck, 
  Lock, 
  Share2, 
  ExternalLink,
  Sliders,
  BarChart3,
  Bookmark
} from 'lucide-react';
import { 
  classifyMultiNeedMessage, 
  detectCrisis, 
  getRoute, 
  ALL_12_DEPARTMENTS, 
  MultiNeedTriageResult, 
  DetectedNeed, 
  UniversityRoute 
} from './services/triage';

const DEMO_PRESETS = [
  {
    id: "preset_multi",
    title: "Multi-Need: Exams + Roommate + Tuition",
    category: "3 Needs Detected",
    badge: "⭐ Multi-Need Killer Demo",
    bg: "bg-[#FFE55C]", // vibrant yellow
    hover: "hover:bg-[#FACC15]",
    text: "I'm struggling with exams, my roommate situation is getting worse every day, and I'm stressed about paying my tuition next month. I don't know who to talk to."
  },
  {
    id: "preset_wellbeing_academic",
    title: "Dual: Panic Attacks & Failing Course",
    category: "2 Needs Detected",
    badge: "Dual Need",
    bg: "bg-[#DDD6FE]", // pastel purple
    hover: "hover:bg-[#C4B5FD]",
    text: "I haven't slept in three days because I'm failing Organic Chemistry. I'm having panic attacks before every lab lecture."
  },
  {
    id: "preset_housing_financial",
    title: "Dual: Eviction Risk & Lost Campus Job",
    category: "2 Needs Detected",
    badge: "Dual Need",
    bg: "bg-[#FED7AA]", // pastel orange
    hover: "hover:bg-[#FDBA74]",
    text: "My landlord threatened to evict me and I just lost my on-campus dining hall job. I have no money for rent or food."
  },
  {
    id: "preset_academic",
    title: "Single: Academic Workload",
    category: "1 Need",
    badge: "Single Need",
    bg: "bg-[#BAE6FD]", // pastel blue
    hover: "hover:bg-[#7DD3FC]",
    text: "I am having trouble organizing my study schedule and balancing four heavy project deadlines this month."
  },
  {
    id: "preset_crisis",
    title: "Safety: Immediate Crisis Intercept",
    category: "Emergency",
    badge: "🚨 Safety Test",
    bg: "bg-[#FECDD3]", // pastel red
    hover: "hover:bg-[#FDA4AF]",
    text: "I feel like hurting myself and I don't know what to do."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'triage' | 'departments' | 'admin' | 'architecture'>('triage');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [triageResult, setTriageResult] = useState<MultiNeedTriageResult | null>(null);

  // Student Identity Mode (Anonymous vs Authenticated)
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [studentId, setStudentId] = useState('STU-2026-8491');

  // Consent & Handoff Slip State
  const [handoffModalOpen, setHandoffModalOpen] = useState(false);
  const [handoffGenerated, setHandoffGenerated] = useState(false);
  const [consentSummary, setConsentSummary] = useState(true);
  const [consentUrgency, setConsentUrgency] = useState(true);
  const [consentDoNotShareTranscript, setConsentDoNotShareTranscript] = useState(true);

  // Follow-up System State
  const [followUpPeriod, setFollowUpPeriod] = useState<'Tomorrow' | 'In 3 days' | 'Next week' | 'None'>('In 3 days');
  const [followUpConfirmed, setFollowUpConfirmed] = useState(false);

  // Quick booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingTargetService, setBookingTargetService] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleTriage = (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setIsProcessing(true);
    setTriageResult(null);
    setHandoffGenerated(false);
    setFollowUpConfirmed(false);

    setTimeout(() => {
      const res = classifyMultiNeedMessage(text);
      setTriageResult(res);
      setIsProcessing(false);
    }, 320);
  };

  const handleSelectPreset = (presetText: string) => {
    setInputText(presetText);
    handleTriage(presetText);
  };

  const handleIDontKnowWhereToStart = () => {
    const defaultMultiSituation = "I'm struggling with exams, my roommate situation is getting worse every day, and I'm stressed about paying my tuition next month. I don't know who to talk to.";
    setInputText(defaultMultiSituation);
    handleTriage(defaultMultiSituation);
  };

  const handleCreateHandoff = () => {
    setHandoffGenerated(true);
  };

  const handleScheduleFollowUp = () => {
    setFollowUpConfirmed(true);
  };

  const openBookingFor = (serviceName: string) => {
    setBookingTargetService(serviceName);
    setBookingModalOpen(true);
    setBookingConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#111827] flex flex-col font-sans selection:bg-[#FFE55C] selection:text-black">
      {/* ======================================================== */}
      {/* HEADER: DHRONA NEOBRUTALISM BRANDING                     */}
      {/* ======================================================== */}
      <header className="border-b-[3px] border-black bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 sm:py-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#FFE55C] border-[3px] border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center rotate-[-2deg]">
              <HeartHandshake className="w-7 h-7 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-2xl tracking-tight uppercase text-black">
                  DHRONA
                </span>
                <span className="bg-[#BAE6FD] text-black text-[11px] font-black uppercase tracking-wider px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] rotate-[1deg]">
                  Support Navigator
                </span>
                <span className="bg-[#A7F3D0] text-black text-[10px] font-extrabold uppercase px-2 py-0.5 border border-black hidden md:inline-block">
                  Multi-Need Engine
                </span>
              </div>
              <p className="text-xs font-bold text-gray-700">
                Understand the student → Assess urgency → Detect multiple needs → Direct handoff
              </p>
            </div>
          </div>

          {/* Navigation Controls & Identity Mode */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {/* Anonymous / Authenticated Toggle */}
            <div className="hidden lg:flex items-center bg-[#F3F4F6] border-2 border-black px-2 py-1 space-x-2 shadow-[2px_2px_0px_0px_#000] mr-2">
              <span className="text-[10px] font-black uppercase text-gray-700">Mode:</span>
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black transition ${
                  isAnonymous ? 'bg-[#FFE55C] text-black' : 'bg-white text-gray-500'
                }`}
              >
                {isAnonymous ? '🕵️ Anonymous' : '🎓 ID: ' + studentId}
              </button>
            </div>

            <nav className="flex items-center space-x-1.5">
              <button
                onClick={() => setActiveTab('triage')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center space-x-1 ${
                  activeTab === 'triage'
                    ? 'bg-[#FFE55C] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white hover:bg-yellow-100 shadow-[3px_3px_0px_0px_#000]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Navigator</span>
              </button>

              <button
                onClick={() => setActiveTab('departments')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center space-x-1 ${
                  activeTab === 'departments'
                    ? 'bg-[#BAE6FD] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white hover:bg-blue-100 shadow-[3px_3px_0px_0px_#000]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>12 Depts</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center space-x-1 ${
                  activeTab === 'admin'
                    ? 'bg-[#FED7AA] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white hover:bg-orange-100 shadow-[3px_3px_0px_0px_#000]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Admin View</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center space-x-1 ${
                  activeTab === 'architecture'
                    ? 'bg-[#A7F3D0] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white hover:bg-green-100 shadow-[3px_3px_0px_0px_#000]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Pitch</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* PROBLEM BANNER TICKER                                    */}
      {/* ======================================================== */}
      <div className="bg-[#FEF08A] border-b-[3px] border-black py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="bg-black text-[#FFE55C] font-black text-xs px-2.5 py-1 uppercase tracking-wider">
              The Campus Silo Problem
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-black">
              Students rarely have just one problem. DHRONA maps multi-faceted situations into one unified plan.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleIDontKnowWhereToStart}
              className="bg-black hover:bg-gray-800 text-[#FFE55C] font-black text-xs uppercase px-3 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center space-x-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>"I Don't Know Where To Start" (Click Me)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN VIEW CONTENT                                        */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ======================================================== */}
        {/* TAB 1: TRIAGE & MULTI-NEED SUPPORT NAVIGATOR             */}
        {/* ======================================================== */}
        {activeTab === 'triage' && (
          <div className="space-y-8">
            
            {/* INTAKE FORM */}
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                  <div className="inline-block bg-[#FFE55C] border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
                    Universal Multi-Need Intake
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
                    Tell Us What's Going On
                  </h2>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    You don't need to know which department to contact. Describe everything on your plate.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleIDontKnowWhereToStart}
                    className="px-3.5 py-2 bg-[#BAE6FD] hover:bg-blue-300 text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] transition"
                  >
                    Load Complex Student Case
                  </button>
                </div>
              </div>

              {/* 1-Click Presets for Hackathon Pitch */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                    <span>Quick Pitch Scenarios (Click to Test Real-time Multi-Need Detection)</span>
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 font-mono">1-Click Live Tests</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.text)}
                      className={`text-left p-3.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] ${preset.bg} ${preset.hover} hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5">
                          {preset.badge}
                        </span>
                      </div>
                      <div className="text-xs font-black text-black uppercase leading-tight">
                        {preset.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your situation in plain words (e.g. 'I'm struggling with exams, my roommate situation is getting worse, and I'm stressed about paying my tuition')..."
                    className="w-full bg-[#FFFDF9] border-[3px] border-black shadow-[5px_5px_0px_0px_#000] focus:shadow-[7px_7px_0px_0px_#000] focus:outline-none p-4 text-sm font-semibold text-black placeholder:text-gray-400 leading-relaxed transition-all"
                  />
                  {inputText && (
                    <button
                      onClick={() => setInputText('')}
                      className="absolute top-3 right-3 bg-white hover:bg-gray-100 text-xs font-black uppercase px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 stroke-[2.5] shrink-0" />
                    <span>
                      {isAnonymous ? 'Anonymous Triage Active' : 'Identified as ' + studentId} • Zero Diagnostic Labeling • Support Recommendation Only
                    </span>
                  </div>

                  <button
                    onClick={() => handleTriage()}
                    disabled={isProcessing || !inputText.trim()}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#FFE55C] hover:bg-[#FACC15] text-black font-black uppercase tracking-wider text-sm border-[3px] border-black shadow-[5px_5px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_0px_#000] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin stroke-[3]" />
                        <span>Analyzing All Concurrent Needs...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>Build My Support Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TRIAGE OUTPUT: MULTI-NEED SUPPORT NAVIGATOR               */}
            {/* ======================================================== */}
            {triageResult && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* CASE 1: CRISIS SAFETY INTERCEPT */}
                {triageResult.crisis_flag ? (
                  <div className="bg-[#FF4949] border-[4px] border-black shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 space-y-6 text-black">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-[3px] border-black pb-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-9 h-9 text-red-600 stroke-[3] animate-bounce" />
                        </div>
                        <div>
                          <div className="inline-block bg-black text-white text-xs font-black uppercase tracking-wider px-3 py-1 mb-1">
                            ⚠️ IMMEDIATE HUMAN SUPPORT REQUIRED
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                            We Are Here With You Right Now.
                          </h3>
                        </div>
                      </div>

                      <div className="bg-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_#000]">
                        <span className="text-[10px] font-black uppercase text-red-600 block">Deterministic Safety Filter</span>
                        <span className="text-xs font-black text-black">Emergency Protocol Active</span>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-white max-w-3xl leading-relaxed">
                      Your message indicates an immediate safety concern. Normal automated conversation has been suspended. 
                      Please connect with one of these 24/7 free, confidential emergency responders right now:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000] p-5 space-y-3">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-red-600">
                            Campus Crisis Unit
                          </span>
                          <PhoneCall className="w-4 h-4 text-black stroke-[2.5]" />
                        </div>
                        <div className="text-2xl font-black text-black font-mono">
                          (555) 911-HELP
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          24/7 on-campus mobile crisis and mental health stabilization unit.
                        </p>
                        <button
                          onClick={() => alert("Connecting you directly to Campus Crisis Emergency Dispatch: (555) 911-HELP")}
                          className="w-full py-2.5 bg-[#FF4949] hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        >
                          Connect Now (24/7)
                        </button>
                      </div>

                      <div className="bg-[#FFE55C] border-[3px] border-black shadow-[5px_5px_0px_0px_#000] p-5 space-y-3">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-black">
                            Suicide & Crisis Lifeline
                          </span>
                          <HeartHandshake className="w-4 h-4 text-black stroke-[2.5]" />
                        </div>
                        <div className="text-2xl font-black text-black font-mono">
                          Call or Text 988
                        </div>
                        <p className="text-xs font-semibold text-gray-800">
                          National free, confidential 24/7 lifeline for anyone experiencing emotional distress.
                        </p>
                        <button
                          onClick={() => alert("Dialing 988 Suicide & Crisis Lifeline.")}
                          className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        >
                          Call / Text 988
                        </button>
                      </div>

                      <div className="bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000] p-5 space-y-3">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-black">
                            Campus Security & Escort
                          </span>
                          <ShieldAlert className="w-4 h-4 text-black stroke-[2.5]" />
                        </div>
                        <div className="text-2xl font-black text-black font-mono">
                          (555) 019-SAFE
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          24/7 student safety escorts and emergency officer response to any building.
                        </p>
                        <button
                          onClick={() => alert("Dispatching request to Campus Safety & Escort Service.")}
                          className="w-full py-2.5 bg-[#BAE6FD] hover:bg-blue-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        >
                          Request Officer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CASE 2: SMART MULTI-NEED SUPPORT PLAN */
                  <div className="space-y-8">
                    
                    {/* SUPPORT NAVIGATOR HERO HEADER (Feature 1) */}
                    <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-[#FFE55C] text-black font-black text-xs uppercase px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                              Support Navigator Result
                            </span>
                            <span className="text-xs font-bold text-gray-500">•</span>
                            <span className="text-xs font-black text-purple-700 uppercase">
                              {triageResult.needs.length} {triageResult.needs.length === 1 ? 'Need Detected' : 'Concurrent Needs Detected'}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                            Your Coordinated Campus Support Plan
                          </h3>
                        </div>

                        {/* Overall Urgency Badge */}
                        <div className="bg-[#FFFDF7] border-2 border-black p-3 shadow-[3px_3px_0px_0px_#000] text-right">
                          <span className="text-[10px] font-black uppercase text-gray-600 block">Overall Urgency Level</span>
                          <span className={`text-sm font-black uppercase px-2 py-0.5 border border-black inline-block mt-0.5 ${
                            triageResult.overallUrgency === 'high'
                              ? 'bg-[#FF4949] text-white'
                              : triageResult.overallUrgency === 'medium'
                              ? 'bg-[#FFE55C] text-black'
                              : 'bg-[#BAE6FD] text-black'
                          }`}>
                            {triageResult.overallUrgency} Urgency
                          </span>
                        </div>
                      </div>

                      {/* Visual Pipeline Flow */}
                      <div className="bg-[#F3F4F6] border-2 border-black p-4 space-y-2">
                        <div className="text-[10px] font-black uppercase text-gray-600">The Journey From 1 Input To Multi-Department Action</div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                          <span className="bg-white border border-black px-2.5 py-1">Student Inquiry</span>
                          <span className="font-mono text-base font-black">→</span>
                          <span className="bg-[#FFE55C] border border-black px-2.5 py-1">AI Triage ({triageResult.needs.length} Needs)</span>
                          <span className="font-mono text-base font-black">→</span>
                          <span className="bg-[#BAE6FD] border border-black px-2.5 py-1">Department Mapping</span>
                          <span className="font-mono text-base font-black">→</span>
                          <span className="bg-[#A7F3D0] border border-black px-2.5 py-1">One-Click Handoff</span>
                        </div>
                      </div>
                    </div>

                    {/* MULTI-NEED DEPARTMENT CARDS (Features 1, 2, 3, 9) */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black uppercase tracking-wider text-black flex items-center space-x-2">
                          <Bookmark className="w-5 h-5 text-black stroke-[2.5]" />
                          <span>Detected Support Pathways ({triageResult.needs.length})</span>
                        </h4>
                        <span className="text-xs font-bold text-gray-500 font-mono">
                          Each department receives a targeted handoff slip
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {triageResult.needs.map((need, idx) => {
                          const route = need.route;
                          const bgColors = ['bg-[#BAE6FD]', 'bg-[#DDD6FE]', 'bg-[#FED7AA]', 'bg-[#A7F3D0]'];
                          const accentBg = bgColors[idx % bgColors.length];

                          return (
                            <div
                              key={need.category}
                              className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-6 space-y-5"
                            >
                              {/* Header for this need */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-9 h-9 ${accentBg} border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-black text-base`}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                                      {need.title}
                                    </div>
                                    <div className="text-xl font-black text-black uppercase">
                                      {route.service}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold text-gray-600">Department Match:</span>
                                  <span className="bg-[#A7F3D0] text-black font-mono font-bold text-xs px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000]">
                                    {Math.round(need.confidence * 100)}%
                                  </span>
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${
                                    need.urgency === 'high' ? 'bg-[#FF4949] text-white' : need.urgency === 'medium' ? 'bg-[#FFE55C] text-black' : 'bg-gray-100 text-black'
                                  }`}>
                                    {need.urgency} Urgency
                                  </span>
                                </div>
                              </div>

                              {/* FEATURE 2: "WHY AM I BEING ROUTED HERE?" EXPLAINABLE RECOMMENDATION */}
                              <div className="bg-[#FFFDF7] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                                    <span>Why We Recommend This</span>
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-0.5 border border-black">
                                    Support Recommendation • Not A Diagnosis
                                  </span>
                                </div>

                                <div className="text-xs font-bold text-gray-800">
                                  You mentioned in your message:
                                </div>
                                <ul className="space-y-1 pl-2">
                                  {need.extractedPoints.map((point, pIdx) => (
                                    <li key={pIdx} className="text-xs font-semibold text-gray-700 flex items-start space-x-2">
                                      <span className="text-black font-bold">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>

                                <p className="text-xs font-bold text-black border-t border-gray-300 pt-2 mt-2 leading-relaxed">
                                  {need.whyRecommended}
                                </p>
                              </div>

                              {/* Department Info & Tangible Immediate Resources */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="text-[11px] font-black uppercase text-gray-700">Campus Location & Contacts</div>
                                  <div className="bg-[#F3F4F6] border-2 border-black p-3 text-xs space-y-1">
                                    <div><strong>Building:</strong> {route.building} ({route.room})</div>
                                    <div><strong>Hours:</strong> {route.hours}</div>
                                    <div><strong>Direct:</strong> <span className="font-mono">{route.phone}</span> • {route.email}</div>
                                  </div>
                                </div>

                                {/* FEATURE 9: IMMEDIATE RESOURCE RECOMMENDATIONS */}
                                <div className="space-y-2">
                                  <div className="text-[11px] font-black uppercase text-gray-700">Immediate Self-Service Resources</div>
                                  <div className="bg-[#F3F4F6] border-2 border-black p-3 text-xs space-y-1.5">
                                    {route.immediateResources.map((res, rIdx) => (
                                      <div key={rIdx} className="flex items-center justify-between text-[11px] font-semibold text-black">
                                        <span className="truncate pr-2">📄 {res.title}</span>
                                        <span className="bg-white border border-black px-1.5 py-0.5 text-[9px] font-bold shrink-0">
                                          {res.type}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Action button for this specific service */}
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-xs font-bold text-gray-600">
                                  Priority Policy: {route.priorityNote || 'Priority intake available'}
                                </span>
                                <button
                                  onClick={() => openBookingFor(route.service)}
                                  className="py-2.5 px-4 bg-[#FFE55C] hover:bg-yellow-300 text-black font-black uppercase text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center space-x-1.5"
                                >
                                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                                  <span>{route.action}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* FEATURES 3, 4, 10, 12: UNIFIED HANDOFF SLIP & FOLLOW-UP  */}
                    {/* ======================================================== */}
                    <div className="bg-[#FFE55C] border-[4px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
                        <div>
                          <span className="bg-black text-[#FFE55C] font-black text-xs uppercase px-2.5 py-1 mb-1 inline-block">
                            ⭐ Killer Demo Feature: One-Click Handoff
                          </span>
                          <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                            Unified Cross-Department Support Handoff
                          </h3>
                          <p className="text-xs font-bold text-black mt-1">
                            Save students from retelling their story 3 separate times across 3 different offices.
                          </p>
                        </div>

                        <button
                          onClick={() => setHandoffModalOpen(true)}
                          className="px-6 py-3.5 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center space-x-2 shrink-0"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Review & Approve Handoff Slip</span>
                        </button>
                      </div>

                      {/* FEATURE 12: "WHAT HAPPENS NEXT?" STEP ROADMAP */}
                      <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-5 space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>What Happens Next?</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-[#F3F4F6] border border-black p-3 space-y-1">
                            <div className="font-black text-black">1. Consent Approval</div>
                            <p className="text-gray-700 text-[11px]">You approve which concerns are transmitted to advisors.</p>
                          </div>
                          <div className="bg-[#F3F4F6] border border-black p-3 space-y-1">
                            <div className="font-black text-black">2. Handoff Dispatched</div>
                            <p className="text-gray-700 text-[11px]">Assigned duty advisors at each service review your summary.</p>
                          </div>
                          <div className="bg-[#F3F4F6] border border-black p-3 space-y-1">
                            <div className="font-black text-black">3. Coordinated Slots</div>
                            <p className="text-gray-700 text-[11px]">Fast-track intake windows open with zero duplicate paperwork.</p>
                          </div>
                          <div className="bg-[#F3F4F6] border border-black p-3 space-y-1">
                            <div className="font-black text-black">4. Check-in Journey</div>
                            <p className="text-gray-700 text-[11px]">Automated follow-up checks that you received effective care.</p>
                          </div>
                        </div>
                      </div>

                      {/* FEATURE 10: FOLLOW-UP SCHEDULER */}
                      <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-black uppercase text-black">
                              Would you like a scheduled follow-up check-in?
                            </div>
                            <p className="text-xs text-gray-700 mt-0.5">
                              We will privately check in to verify you connected with your advisors and are getting back on track.
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {(['Tomorrow', 'In 3 days', 'Next week', 'None'] as const).map((period) => (
                              <button
                                key={period}
                                onClick={() => setFollowUpPeriod(period)}
                                className={`text-xs font-black uppercase px-3 py-1.5 border-2 border-black transition ${
                                  followUpPeriod === period
                                    ? 'bg-[#FFE55C] shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5'
                                    : 'bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000]'
                                }`}
                              >
                                {period}
                              </button>
                            ))}
                            <button
                              onClick={handleScheduleFollowUp}
                              className="px-4 py-1.5 bg-[#A7F3D0] hover:bg-[#6EE7B7] text-black font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] ml-2"
                            >
                              Save
                            </button>
                          </div>
                        </div>

                        {followUpConfirmed && (
                          <div className="bg-[#A7F3D0] border-2 border-black p-3 text-xs font-bold text-black flex items-center space-x-2 animate-fadeIn">
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>
                              Follow-up check-in confirmed for <strong>{followUpPeriod}</strong>. You'll receive a discreet check-in notification.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: THE 12 CAMPUS DEPARTMENTS DIRECTORY                */}
        {/* ======================================================== */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-6">
              <div className="max-w-3xl">
                <span className="bg-[#FF4949] text-white text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-block mb-2">
                  The Problem Statement
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                  The 12-Department Campus Maze
                </h2>
                <p className="text-sm font-bold text-gray-700 mt-2 leading-relaxed">
                  Traditional universities operate 12+ separate administrative silos. Stressed students are forced to figure out which of these buildings to visit, resulting in an average 3-week intake queue and over 40% misdirected referrals.
                </p>
              </div>

              {/* Grid of the 12 fragmented departments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_12_DEPARTMENTS.map((dept, i) => {
                  const colors = ['bg-[#BAE6FD]', 'bg-[#DDD6FE]', 'bg-[#FED7AA]', 'bg-[#A7F3D0]', 'bg-[#FEF08A]', 'bg-[#FECDD3]'];
                  const cardBg = colors[i % colors.length];
                  return (
                    <div
                      key={i}
                      className={`${cardBg} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-2 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000] transition-all`}
                    >
                      <div className="flex items-center justify-between border-b-2 border-black pb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black">
                          Silo {i + 1} of 12
                        </span>
                        <span className="text-[10px] font-black uppercase bg-white px-2 py-0.5 border border-black">
                          Wait: {dept.wait}
                        </span>
                      </div>
                      <div className="text-base font-black text-black uppercase leading-snug">
                        {dept.name}
                      </div>
                      <div className="text-xs font-bold text-gray-800 flex items-center justify-between pt-1">
                        <span>Domain: {dept.category}</span>
                        <span className="bg-black text-white text-[9px] font-black uppercase px-1.5 py-0.5">
                          Friction: {dept.referrals}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#FFE55C] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black text-black uppercase">
                    How Dhrona Solves This in Seconds
                  </h4>
                  <p className="text-xs font-bold text-black mt-1 max-w-2xl leading-relaxed">
                    Instead of navigating 12 separate websites and waiting weeks, the student enters one conversation. Dhrona performs multi-need triage and coordinates a single unified handoff.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('triage')}
                  className="px-6 py-3 bg-black hover:bg-gray-800 text-[#FFE55C] text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] shrink-0 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Test Student Intake →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ADMIN DEMAND DASHBOARD (Section 13)               */}
        {/* ======================================================== */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
                <div>
                  <span className="bg-[#FED7AA] text-black font-black text-xs uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-block mb-1">
                    Operational Intelligence
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                    Campus Support Triage Operations
                  </h2>
                  <p className="text-xs font-bold text-gray-700">
                    Aggregated university-level demand analytics. Demonstrates resource optimization & queue elimination.
                  </p>
                </div>

                <div className="text-xs font-bold text-gray-500 font-mono">
                  Live Campus Aggregation (Demo Data)
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#BAE6FD] border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-gray-800">Total Student Inquiries</span>
                  <div className="text-3xl font-black text-black mt-1">128</div>
                  <div className="text-[10px] font-bold text-gray-700 mt-1">Past 7 days</div>
                </div>

                <div className="bg-[#DDD6FE] border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-gray-800">Multi-Need Inquiries</span>
                  <div className="text-3xl font-black text-black mt-1">44%</div>
                  <div className="text-[10px] font-bold text-gray-700 mt-1">Cross-department cases</div>
                </div>

                <div className="bg-[#A7F3D0] border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-gray-800">Avg. Time to Handoff</span>
                  <div className="text-3xl font-black text-black mt-1">1.8m</div>
                  <div className="text-[10px] font-bold text-gray-700 mt-1">Reduced from 21 days</div>
                </div>

                <div className="bg-[#FFE55C] border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-gray-800">Referral Bounce Rate</span>
                  <div className="text-3xl font-black text-black mt-1">&lt; 3%</div>
                  <div className="text-[10px] font-bold text-gray-700 mt-1">Reduced from +40%</div>
                </div>
              </div>

              {/* Department Demand Bars */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-black uppercase text-black">
                  Department Influx & Demand Breakdown
                </h4>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>🧠 Mental Wellbeing (Counselling)</span>
                      <span>42 requests (33%)</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black">
                      <div className="h-full bg-[#DDD6FE] border-r-2 border-black" style={{ width: '33%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>📚 Academic Success & Advising</span>
                      <span>48 requests (38%)</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black">
                      <div className="h-full bg-[#BAE6FD] border-r-2 border-black" style={{ width: '38%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>💰 Financial Aid & Emergency Grants</span>
                      <span>24 requests (19%)</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black">
                      <div className="h-full bg-[#A7F3D0] border-r-2 border-black" style={{ width: '19%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>🏠 Housing & Residence Life</span>
                      <span>14 requests (10%)</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black">
                      <div className="h-full bg-[#FED7AA] border-r-2 border-black" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ARCHITECTURE & 1-MINUTE PITCH                     */}
        {/* ======================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-4">
              <span className="bg-[#A7F3D0] text-black text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-block">
                The Pitch Strategy (Section 15)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                "Students shouldn't need to understand the university's organizational structure before they can get help."
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <div className="bg-[#BAE6FD] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-gray-800">1. Natural Language</div>
                  <div className="text-sm font-black text-black uppercase">Understand</div>
                  <p className="text-xs font-bold text-gray-800">Captures complex multi-issue stress without requiring jargon.</p>
                </div>

                <div className="bg-[#FF4949] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-yellow-300">2. Deterministic Filter</div>
                  <div className="text-sm font-black text-white uppercase">Safety First</div>
                  <p className="text-xs font-bold text-white/90">Immediate catch for self-harm keywords; suspends normal AI chat.</p>
                </div>

                <div className="bg-[#DDD6FE] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-gray-800">3. Multi-Need Triage</div>
                  <div className="text-sm font-black text-black uppercase">Structured Map</div>
                  <p className="text-xs font-bold text-gray-800">Detects concurrent academic, financial, housing, and mental needs.</p>
                </div>

                <div className="bg-[#A7F3D0] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-gray-800">4. Coordinated Action</div>
                  <div className="text-sm font-black text-black uppercase">One Handoff</div>
                  <p className="text-xs font-bold text-gray-800">Produces an approved handoff slip with scheduled follow-up.</p>
                </div>
              </div>
            </div>

            <div className="bg-black border-[4px] border-black shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                <h3 className="text-lg font-black text-[#FFE55C] uppercase tracking-wider">
                  Technical Architecture Specification
                </h3>
                <span className="text-xs font-mono font-bold text-gray-400">Streamlit / React + Groq LLM Multi-Need</span>
              </div>

              <pre className="font-mono text-xs text-[#4ADE80] bg-gray-950 p-6 border-2 border-gray-800 overflow-x-auto leading-relaxed">
{`                    ┌─────────────────────────┐
                    │      STUDENT INPUT      │
                    │  (Raw Natural Language) │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  SAFETY KEYWORD FILTER  │
                    │  (Deterministic Layer)  │
                    └──────┬────────────┬─────┘
                           │            │
                     CRISIS DETECTED   SAFE
                           │            │
                           ▼            ▼
                    ┌─────────────┐  ┌─────────────────────────┐
                    │  EMERGENCY  │  │   GROQ LLM INFERENCE    │
                    │   ROUTING   │  │ (llama-3.3-70b-versatile│
                    │ (988/Crisis)│  └──────────┬──────────────┘
                    └─────────────┘             │
                                                ▼
                                     ┌─────────────────────────┐
                                     │  MULTI-NEED PARSER      │
                                     │  [Need 1, Need 2, ...]  │
                                     └──────────┬──────────────┘
                                                │
                                                ▼
                                     ┌─────────────────────────┐
                                     │ ROUTING & EXPLANATION   │
                                     │ "You mentioned: • ...   │
                                     │  Why we recommend: ..." │
                                     └──────────┬──────────────┘
                                                │
                     ┌──────────────────────────┼─────────────────────────┐
                     ▼                          ▼                         ▼
             Academic Support          Counselling Services      Financial Aid Office
             (Library 3rd Floor)       (Wellness Center B204)    (Hall A Room 112)
                     │                          │                         │
                     └──────────────────────────┼─────────────────────────┘
                                                ▼
                                     ┌─────────────────────────┐
                                     │  STUDENT CONSENT MODAL  │
                                     │  ✓ Approve Sharing      │
                                     └──────────┬──────────────┘
                                                │
                                                ▼
                                     ┌─────────────────────────┐
                                     │ ONE-CLICK HANDOFF SLIP  │
                                     │ + SCHEDULED FOLLOW-UP   │
                                     └─────────────────────────┘`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: ONE-CLICK SUPPORT HANDOFF SLIP & CONSENT        */}
      {/* ======================================================== */}
      {handoffModalOpen && triageResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="bg-[#FFFDF7] border-[4px] border-black shadow-[12px_12px_0px_0px_#000] p-6 sm:p-8 max-w-xl w-full space-y-6">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-[#A7F3D0] px-2 py-0.5 border border-black">
                  Official Handoff Document
                </span>
                <h3 className="text-xl font-black text-black uppercase mt-1">
                  Cross-Department Support Handoff
                </h3>
              </div>
              <button
                onClick={() => setHandoffModalOpen(false)}
                className="bg-white hover:bg-gray-100 p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
              >
                <X className="w-5 h-5 text-black stroke-[3]" />
              </button>
            </div>

            {handoffGenerated ? (
              <div className="space-y-4 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                  <span className="text-sm font-black uppercase">Handoff Successfully Dispatched!</span>
                </div>

                <div className="bg-[#FFFDF7] border border-black p-3 font-mono text-xs space-y-1 text-gray-800">
                  <div><strong>Reference ID:</strong> DH-{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div><strong>Student Identity:</strong> {isAnonymous ? 'Anonymous Student (Privacy Mode)' : studentId}</div>
                  <div><strong>Target Offices:</strong> {triageResult.needs.map(n => n.route.service).join(' • ')}</div>
                  <div><strong>Urgency Flag:</strong> {triageResult.overallUrgency.toUpperCase()}</div>
                </div>

                <p className="text-xs font-bold text-gray-700">
                  Duty advisors have received your structured summary. You will not need to re-explain your situation when meeting with them.
                </p>

                <button
                  onClick={() => setHandoffModalOpen(false)}
                  className="w-full py-3 bg-black text-[#FFE55C] font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                >
                  Close & Return to Support Plan
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Handoff Preview Slip */}
                <div className="bg-white border-2 border-black p-4 space-y-3 shadow-[3px_3px_0px_0px_#000]">
                  <div className="text-[10px] font-black uppercase text-gray-500 border-b border-gray-300 pb-1 flex justify-between">
                    <span>Generated Intake Summary</span>
                    <span>Student: {isAnonymous ? 'Anonymous' : studentId}</span>
                  </div>

                  <div className="text-xs font-bold text-black leading-relaxed">
                    "{triageResult.studentSummary}"
                  </div>

                  <div className="text-xs space-y-1 pt-1">
                    <span className="font-bold text-gray-700 block">Coordinated Support Offices:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {triageResult.needs.map(n => (
                        <span key={n.category} className="bg-[#F3F4F6] text-black text-[10px] font-black uppercase px-2 py-0.5 border border-black">
                          {n.route.service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FEATURE 4: CONSENT-BASED INFORMATION SHARING */}
                <div className="bg-[#FEF08A] border-2 border-black p-4 space-y-2.5">
                  <div className="text-xs font-black uppercase text-black flex items-center space-x-1.5">
                    <Lock className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Student Privacy & Consent Confirmation</span>
                  </div>

                  <label className="flex items-center space-x-2 text-xs font-bold text-black cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentSummary}
                      onChange={(e) => setConsentSummary(e.target.checked)}
                      className="w-4 h-4 border-2 border-black"
                    />
                    <span>Share structured summary & detected concern areas</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-black cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentUrgency}
                      onChange={(e) => setConsentUrgency(e.target.checked)}
                      className="w-4 h-4 border-2 border-black"
                    />
                    <span>Share urgency assessment ({triageResult.overallUrgency})</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-black cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentDoNotShareTranscript}
                      onChange={(e) => setConsentDoNotShareTranscript(e.target.checked)}
                      className="w-4 h-4 border-2 border-black"
                    />
                    <span>DO NOT share raw conversational transcript or extraneous data</span>
                  </label>
                </div>

                <button
                  onClick={handleCreateHandoff}
                  disabled={!consentSummary}
                  className="w-full py-3.5 bg-[#A7F3D0] hover:bg-[#6EE7B7] text-black font-black uppercase tracking-wider text-xs border-[3px] border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                >
                  Approve Consent & Transmit Handoff
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PRIORITY BOOKING APPOINTMENT                     */}
      {/* ======================================================== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="bg-[#FFFDF7] border-[4px] border-black shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-[#FFE55C] px-2 py-0.5 border border-black">
                  Priority Intake Slot
                </span>
                <h3 className="text-xl font-black text-black uppercase mt-1">Book Fast-Track Slot</h3>
                <p className="text-xs font-bold text-gray-700">{bookingTargetService}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="bg-white hover:bg-gray-100 p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
              >
                <X className="w-5 h-5 text-black stroke-[3]" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-6 text-center space-y-3 bg-[#A7F3D0] border-2 border-black p-4">
                <div className="w-12 h-12 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 text-black stroke-[3]" />
                </div>
                <h4 className="text-lg font-black text-black uppercase">Slot Confirmed!</h4>
                <p className="text-xs font-bold text-gray-800 max-w-sm mx-auto">
                  Your priority intake slot with <strong>{bookingTargetService}</strong> is confirmed. A calendar invite was attached to your handoff record.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Select Available Window
                  </label>
                  <select
                    className="w-full text-xs font-bold bg-white border-2 border-black p-3 text-black shadow-[3px_3px_0px_0px_#000] focus:outline-none"
                  >
                    <option>Tomorrow, 10:00 AM (Priority Intake)</option>
                    <option>Tomorrow, 2:00 PM (Priority Intake)</option>
                    <option>In 2 Days, 11:30 AM</option>
                  </select>
                </div>

                <div className="bg-[#F3F4F6] border-2 border-black p-3 text-xs font-semibold text-gray-800 space-y-1">
                  <div className="font-black text-black uppercase">Check-in Protocol:</div>
                  <div>Handoff slip will be pre-loaded at the front desk.</div>
                  <div>Zero duplicate paperwork required.</div>
                </div>

                <button
                  onClick={() => setBookingConfirmed(true)}
                  className="w-full py-3.5 bg-[#A7F3D0] hover:bg-[#6EE7B7] text-black font-black uppercase tracking-wider text-xs border-[3px] border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Confirm Priority Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOOTER                                                   */}
      {/* ======================================================== */}
      <footer className="border-t-[3px] border-black py-6 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-black text-sm uppercase text-black">
              DHRONA / STUDENT SUPPORT NAVIGATOR
            </span>
            <span className="text-xs font-bold text-gray-600 block">
              Track 01: Multi-Need Triage, Consent Handoff & Coordinated Campus Support
            </span>
          </div>

          <div className="text-xs font-bold text-gray-500">
            Intake & Routing Assistant • Not a Clinical Diagnostic Tool
          </div>
        </div>
      </footer>
    </div>
  );
}
