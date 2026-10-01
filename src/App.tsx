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
  ArrowUpRight,
  Flame,
  Zap,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { 
  classifyMessage, 
  detectCrisis, 
  getRoute, 
  ALL_12_DEPARTMENTS, 
  TriageResult, 
  UniversityRoute 
} from './services/triage';

const DEMO_PRESETS = [
  {
    id: "preset_academic",
    title: "Academic Overload",
    category: "Academic",
    icon: BookOpen,
    bg: "bg-[#BAE6FD]", // pastel blue
    hover: "hover:bg-[#7DD3FC]",
    text: "I am struggling to keep up with my classes and I don't know how to organize my workload. I have three exams next week and feel like I'm failing."
  },
  {
    id: "preset_mental",
    title: "Stress & Sleep",
    category: "Mental Health",
    icon: Brain,
    bg: "bg-[#DDD6FE]", // pastel purple
    hover: "hover:bg-[#C4B5FD]",
    text: "I haven't been sleeping properly for the last two weeks. Exams are coming up and I'm extremely stressed and having panic moments."
  },
  {
    id: "preset_housing",
    title: "Roommate / Housing",
    category: "Campus Housing",
    icon: Home,
    bg: "bg-[#FED7AA]", // pastel orange
    hover: "hover:bg-[#FDBA74]",
    text: "I don't know who to talk to. I'm having problems with my roommate and I'm worried I might lose my housing if things escalate."
  },
  {
    id: "preset_financial",
    title: "Tuition & Emergency Aid",
    category: "Financial Aid",
    icon: Coins,
    bg: "bg-[#A7F3D0]", // pastel green
    hover: "hover:bg-[#6EE7B7]",
    text: "I lost my on-campus part-time job this week. I don't have enough money for next month's tuition fee installment and groceries."
  },
  {
    id: "preset_crisis",
    title: "Immediate Crisis (Safety)",
    category: "Safety Intercept",
    icon: ShieldAlert,
    bg: "bg-[#FECDD3]", // pastel red/pink
    hover: "hover:bg-[#FDA4AF]",
    text: "I feel like hurting myself and I don't know what to do."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'triage' | 'departments' | 'architecture'>('triage');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [route, setRoute] = useState<UniversityRoute | null>(null);
  const [history, setHistory] = useState<Array<{ text: string; result: TriageResult; route: UniversityRoute }>>([]);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDate, setBookingDate] = useState('Tomorrow, 10:00 AM');
  
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [advisorMessage, setAdvisorMessage] = useState('');

  const handleTriage = (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setIsProcessing(true);
    setResult(null);

    // Realistic evaluation delay
    setTimeout(() => {
      const triageRes = classifyMessage(text);
      const targetRoute = getRoute(triageRes.category);
      setResult(triageRes);
      setRoute(targetRoute);
      setIsProcessing(false);

      setHistory(prev => [
        { text, result: triageRes, route: targetRoute },
        ...prev.slice(0, 4)
      ]);
    }, 280);
  };

  const handleSelectPreset = (presetText: string) => {
    setInputText(presetText);
    handleTriage(presetText);
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setBookingModalOpen(false);
    }, 1800);
  };

  const handleSendAdvisorMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactModalOpen(false);
      setAdvisorMessage('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#111827] flex flex-col font-sans selection:bg-[#FFE55C] selection:text-black">
      {/* ======================================================== */}
      {/* TOP HEADER - NEOBRUTALISM STYLE                          */}
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
                <span className="bg-[#BAE6FD] text-black text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] rotate-[1deg]">
                  Student Support
                </span>
                <span className="bg-[#A7F3D0] text-black text-[10px] font-extrabold uppercase px-2 py-0.5 border border-black hidden md:inline-block">
                  Track 01 Triage
                </span>
              </div>
              <p className="text-xs font-bold text-gray-700">
                One intelligent front-door to every university department
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Chunky Neobrutalist buttons */}
          <nav className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center space-x-1.5 ${
                activeTab === 'triage'
                  ? 'bg-[#FFE55C] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white hover:bg-yellow-100 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Intake Desk</span>
            </button>

            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center space-x-1.5 ${
                activeTab === 'departments'
                  ? 'bg-[#BAE6FD] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white hover:bg-blue-100 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>12 Departments</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center space-x-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-[#A7F3D0] translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white hover:bg-green-100 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Architecture</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CHALLENGE PROBLEM STATEMENT - BRUTALIST TICKER BANNER    */}
      {/* ======================================================== */}
      <div className="bg-[#FEF08A] border-b-[3px] border-black py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="bg-black text-[#FFE55C] font-black text-xs px-2.5 py-1 uppercase tracking-wider">
              The Campus Maze
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-black">
              Students shouldn't need to know the university hierarchy to get help.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] px-3 py-1.5 flex items-center space-x-2">
              <span className="text-lg font-black text-black">12</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-gray-800 leading-tight">
                Siloed Depts
              </span>
            </div>
            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] px-3 py-1.5 flex items-center space-x-2">
              <span className="text-lg font-black text-black">3 Wks</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-gray-800 leading-tight">
                Avg. Wait
              </span>
            </div>
            <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] px-3 py-1.5 flex items-center space-x-2">
              <span className="text-lg font-black text-black">+40%</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-gray-800 leading-tight">
                Bounced
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN CONTENT CONTAINER                                   */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ======================================================== */}
        {/* TAB 1: STUDENT TRIAGE & INTAKE                           */}
        {/* ======================================================== */}
        {activeTab === 'triage' && (
          <div className="space-y-8">
            {/* INTAKE HERO CARD */}
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                  <div className="inline-block bg-[#FFE55C] border-2 border-black shadow-[2px_2px_0px_0px_#000] px-3 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
                    Universal Intake Portal
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
                    How Can We Help You Today?
                  </h2>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    Describe your issue in your own words. Dhrona analyzes your situation safely and routes you to the exact service.
                  </p>
                </div>
                <div className="bg-[#F3F4F6] border-2 border-black p-2.5 text-center shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 block">
                    Response Speed
                  </span>
                  <span className="text-sm font-black text-black font-mono">
                    ⚡ Instant &lt; 1 sec
                  </span>
                </div>
              </div>

              {/* 1-Click Demo Scenarios (Judge quick buttons) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                    <span>Quick Demo Scenarios (1-Click Test for Judges)</span>
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 font-mono">Click to test instant triage</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {DEMO_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.text)}
                        className={`text-left p-3.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] ${preset.bg} ${preset.hover} hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex flex-col justify-between group`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="p-1.5 bg-white border border-black shadow-[1px_1px_0px_0px_#000]">
                            <Icon className="w-4 h-4 text-black stroke-[2.5]" />
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider bg-white/80 px-1.5 py-0.5 border border-black">
                            {preset.category}
                          </span>
                        </div>
                        <div className="text-xs font-black text-black uppercase leading-tight">
                          {preset.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea Input */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type what you are going through (e.g., 'I am failing my classes and overwhelmed with deadlines', 'I cannot pay next month's tuition fee', 'I feel like hurting myself')..."
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
                      Strictly Confidential • Zero Diagnostic Labeling • Deterministic Safety Layer Active
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
                        <span>Triaging Support Path...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>Find My Support</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TRIAGE RESULT DISPLAY                                    */}
            {/* ======================================================== */}
            {result && route && (
              <div className="space-y-6">
                
                {/* CASE 1: IMMEDIATE CRISIS TRIGGER (Section 4 & 5) */}
                {result.crisis_flag || result.urgency === 'high' || detectCrisis(inputText) ? (
                  <div className="bg-[#FF4949] border-[4px] border-black shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 space-y-6 text-black">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-[3px] border-black pb-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-9 h-9 text-red-600 stroke-[3] animate-bounce" />
                        </div>
                        <div>
                          <div className="inline-block bg-black text-white text-xs font-black uppercase tracking-wider px-3 py-1 mb-1">
                            ⚠️ IMMEDIATE SUPPORT REQUIRED
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                            We Are Here For You Right Now.
                          </h3>
                        </div>
                      </div>

                      <div className="bg-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_#000]">
                        <span className="text-[10px] font-black uppercase text-red-600 block">Safety Protocol</span>
                        <span className="text-xs font-black text-black">Deterministic Safety Intercept</span>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-white max-w-3xl leading-relaxed">
                      Your message indicates an immediate safety concern. Normal automated conversation has been suspended. 
                      Please connect with one of these 24/7 free, confidential emergency responders right now:
                    </p>

                    {/* Crisis Contact Cards in Neobrutalism */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Emergency Hotline */}
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
                          Direct 24/7 on-campus mobile crisis and mental health stabilization unit.
                        </p>
                        <button
                          onClick={() => alert("Connecting you directly to Campus Crisis Emergency Dispatch: (555) 911-HELP")}
                          className="w-full py-2.5 bg-[#FF4949] hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all"
                        >
                          Connect Now (24/7)
                        </button>
                      </div>

                      {/* 988 Lifeline */}
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
                          National free, confidential 24/7 support for anyone experiencing emotional distress.
                        </p>
                        <button
                          onClick={() => alert("Dialing 988 Suicide & Crisis Lifeline.")}
                          className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all"
                        >
                          Call / Text 988
                        </button>
                      </div>

                      {/* Campus Security */}
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
                          className="w-full py-2.5 bg-[#BAE6FD] hover:bg-blue-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all"
                        >
                          Request Officer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CASE 2: NORMAL / MEDIUM / LOW TRIAGED ROUTING */
                  <div className="space-y-6">
                    {/* VISUAL SUPPORT PATH BAR (Section 12) */}
                    <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-5">
                      <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                          <Compass className="w-4 h-4 text-black stroke-[2.5]" />
                          <span>Your Verified Support Path</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-gray-600">Model Confidence:</span>
                          <span className="bg-[#A7F3D0] text-black font-mono font-black text-xs px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000]">
                            {Math.round(result.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 items-center">
                        {/* Step 1 */}
                        <div className="md:col-span-2 bg-[#F3F4F6] border-2 border-black shadow-[2px_2px_0px_0px_#000] p-3">
                          <div className="text-[9px] font-black uppercase tracking-wider text-gray-600">
                            Step 1 • Student Inquiry
                          </div>
                          <div className="text-xs font-bold text-black mt-1 line-clamp-2 italic">
                            "{inputText}"
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                          <div className="w-8 h-8 bg-black text-[#FFE55C] flex items-center justify-center font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            →
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="md:col-span-2 bg-[#DDD6FE] border-2 border-black shadow-[2px_2px_0px_0px_#000] p-3">
                          <div className="text-[9px] font-black uppercase tracking-wider text-black">
                            Step 2 • AI Triage
                          </div>
                          <div className="text-sm font-black text-black mt-0.5 uppercase">
                            {result.category.replace('_', ' ')}
                          </div>
                          <div className="mt-1">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${
                              result.urgency === 'high' 
                                ? 'bg-[#FF4949] text-white' 
                                : result.urgency === 'medium'
                                ? 'bg-[#FFE55C] text-black'
                                : 'bg-[#BAE6FD] text-black'
                            }`}>
                              {result.urgency} Urgency
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center">
                          <div className="w-8 h-8 bg-black text-[#FFE55C] flex items-center justify-center font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            →
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="md:col-span-2 bg-[#A7F3D0] border-2 border-black shadow-[2px_2px_0px_0px_#000] p-3">
                          <div className="text-[9px] font-black uppercase tracking-wider text-black">
                            Step 3 • University Service
                          </div>
                          <div className="text-sm font-black text-black mt-0.5 uppercase truncate">
                            {route.service}
                          </div>
                          <div className="text-[11px] font-bold text-gray-800 truncate mt-0.5">
                            {route.action}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SERVICE CARD & STRUCTURED INSPECTOR */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Department Details (8 cols) */}
                      <div className="lg:col-span-8 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-6">
                        
                        {/* Title Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-5">
                          <div>
                            <div className="flex items-center space-x-2 mb-1.5">
                              <span className="bg-[#A7F3D0] text-black font-black text-[11px] uppercase tracking-wider px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                Recommended Service
                              </span>
                              <span className="text-xs font-bold text-gray-500">•</span>
                              <span className="text-xs font-extrabold text-gray-700">{route.department}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                              {route.service}
                            </h3>
                          </div>

                          <div className="bg-[#FFE55C] border-2 border-black p-2.5 text-center shadow-[3px_3px_0px_0px_#000] shrink-0">
                            <span className="text-[9px] font-black uppercase tracking-wider text-black block">Triage Urgency</span>
                            <span className="text-sm font-black text-black uppercase">{result.urgency}</span>
                          </div>
                        </div>

                        {/* Why We Recommend This */}
                        <div className="bg-[#FEF08A] border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-1">
                          <div className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-black stroke-[3]" />
                            <span>Why We Recommend This</span>
                          </div>
                          <p className="text-sm font-bold text-black leading-relaxed">
                            {result.reason}
                          </p>
                        </div>

                        {/* Contact & Location Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3.5 flex items-start space-x-3">
                            <div className="p-2 bg-[#BAE6FD] border border-black shadow-[1px_1px_0px_0px_#000] shrink-0">
                              <MapPin className="w-4 h-4 text-black stroke-[2.5]" />
                            </div>
                            <div className="text-xs">
                              <div className="font-black text-black uppercase">{route.building}</div>
                              <div className="font-semibold text-gray-700 mt-0.5">{route.room}</div>
                            </div>
                          </div>

                          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3.5 flex items-start space-x-3">
                            <div className="p-2 bg-[#DDD6FE] border border-black shadow-[1px_1px_0px_0px_#000] shrink-0">
                              <Clock className="w-4 h-4 text-black stroke-[2.5]" />
                            </div>
                            <div className="text-xs">
                              <div className="font-black text-black uppercase">Operating Hours</div>
                              <div className="font-semibold text-gray-700 mt-0.5">{route.hours}</div>
                            </div>
                          </div>

                          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3.5 flex items-start space-x-3">
                            <div className="p-2 bg-[#FED7AA] border border-black shadow-[1px_1px_0px_0px_#000] shrink-0">
                              <Phone className="w-4 h-4 text-black stroke-[2.5]" />
                            </div>
                            <div className="text-xs">
                              <div className="font-black text-black uppercase">Direct Telephone</div>
                              <div className="font-mono font-bold text-gray-800 mt-0.5">{route.phone}</div>
                            </div>
                          </div>

                          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3.5 flex items-start space-x-3">
                            <div className="p-2 bg-[#A7F3D0] border border-black shadow-[1px_1px_0px_0px_#000] shrink-0">
                              <Mail className="w-4 h-4 text-black stroke-[2.5]" />
                            </div>
                            <div className="text-xs">
                              <div className="font-black text-black uppercase">Official Email</div>
                              <div className="font-mono font-bold text-gray-800 mt-0.5">{route.email}</div>
                            </div>
                          </div>
                        </div>

                        {/* Priority intake notice */}
                        {route.priorityNote && (
                          <div className="bg-[#BAE6FD] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-3.5 text-xs font-bold text-black flex items-center space-x-2.5">
                            <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5] shrink-0" />
                            <span>
                              <strong>Priority Triage Guarantee:</strong> {route.priorityNote}
                            </span>
                          </div>
                        )}

                        {/* Interactive Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            onClick={() => setBookingModalOpen(true)}
                            className="w-full sm:w-1/2 py-3.5 px-4 bg-[#A7F3D0] hover:bg-[#6EE7B7] text-black font-black uppercase tracking-wider text-xs border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center space-x-2"
                          >
                            <Calendar className="w-4 h-4 stroke-[2.5]" />
                            <span>{route.action}</span>
                          </button>

                          <button
                            onClick={() => setContactModalOpen(true)}
                            className="w-full sm:w-1/2 py-3.5 px-4 bg-white hover:bg-gray-100 text-black font-black uppercase tracking-wider text-xs border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center space-x-2"
                          >
                            <Mail className="w-4 h-4 stroke-[2.5]" />
                            <span>Contact Department Advisor</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Groq JSON Output Inspector (4 cols) */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="bg-black border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-5 text-white space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                            <span className="text-xs font-black uppercase tracking-wider text-[#FFE55C] flex items-center space-x-1.5">
                              <Code className="w-3.5 h-3.5" />
                              <span>Groq LLM JSON Schema</span>
                            </span>
                            <span className="text-[10px] bg-gray-800 text-gray-300 font-mono px-2 py-0.5 border border-gray-600">
                              Structured
                            </span>
                          </div>

                          <pre className="text-[11px] font-mono text-[#4ADE80] overflow-x-auto leading-relaxed p-2 bg-gray-950 border border-gray-800">
{JSON.stringify({
  category: result.category,
  urgency: result.urgency,
  confidence: result.confidence,
  recommended_service: route.service,
  reason: result.reason,
  immediate_action: route.action,
  crisis_flag: result.crisis_flag
}, null, 2)}
                          </pre>

                          <p className="text-[11px] font-medium text-gray-400 leading-tight">
                            Deterministic routing rules consume this structured schema to guarantee accurate departmental mapping.
                          </p>
                        </div>

                        {/* Recent History */}
                        {history.length > 1 && (
                          <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-4 space-y-2">
                            <div className="text-xs font-black uppercase text-black">
                              Recent Session Inquiries
                            </div>
                            <div className="space-y-2">
                              {history.slice(1, 3).map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setInputText(item.text);
                                    setResult(item.result);
                                    setRoute(item.route);
                                  }}
                                  className="w-full text-left p-2.5 border-2 border-black bg-[#FFFDF9] hover:bg-[#FFE55C] shadow-[2px_2px_0px_0px_#000] transition-all block"
                                >
                                  <div className="font-black text-xs text-black uppercase">{item.route.service}</div>
                                  <div className="text-[10px] font-medium text-gray-600 truncate mt-0.5">{item.text}</div>
                                </button>
                              ))}
                            </div>
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
        {/* TAB 2: THE 12 DEPARTMENTS PROBLEM (Section 13)           */}
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

              {/* The Dhrona Solution Banner */}
              <div className="bg-[#FFE55C] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black text-black uppercase">
                    How Dhrona Solves This in Seconds
                  </h4>
                  <p className="text-xs font-bold text-black mt-1 max-w-2xl leading-relaxed">
                    Instead of navigating 12 separate websites and waiting weeks, the student enters one conversation. Dhrona performs dual-layer safety triage and routes them immediately to the correct desk with a priority booking.
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
        {/* TAB 3: ARCHITECTURE & PITCH DECK (Section 7, 10, 15)     */}
        {/* ======================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* The 1-Minute Pitch */}
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 space-y-4">
              <span className="bg-[#A7F3D0] text-black text-xs font-black uppercase tracking-wider px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-block">
                The Pitch Strategy (Section 15)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                "Students shouldn't need to understand the university's organizational structure before they can get help."
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <div className="bg-[#BAE6FD] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-gray-800">1. Understand</div>
                  <div className="text-sm font-black text-black uppercase">Natural Language</div>
                  <p className="text-xs font-bold text-gray-800">Student expresses raw stress or confusion without knowing jargon.</p>
                </div>

                <div className="bg-[#FF4949] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-yellow-300">2. Safety First</div>
                  <div className="text-sm font-black text-white uppercase">Keyword Intercept</div>
                  <p className="text-xs font-bold text-white/90">Instant deterministic catch for crisis and self-harm keywords.</p>
                </div>

                <div className="bg-[#DDD6FE] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-gray-800">3. AI Triage</div>
                  <div className="text-sm font-black text-black uppercase">Structured JSON</div>
                  <p className="text-xs font-bold text-gray-800">Extracts category, urgency, confidence score, and justification.</p>
                </div>

                <div className="bg-[#A7F3D0] border-2 border-black shadow-[3px_3px_0px_0px_#000] p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase text-gray-800">4. Route & Act</div>
                  <div className="text-sm font-black text-black uppercase">Actionable Outcome</div>
                  <p className="text-xs font-bold text-gray-800">Priority appointment booking, building room number, and direct advisor contact.</p>
                </div>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="bg-black border-[4px] border-black shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                <h3 className="text-lg font-black text-[#FFE55C] uppercase tracking-wider">
                  Technical Architecture Specification
                </h3>
                <span className="text-xs font-mono font-bold text-gray-400">Streamlit / React + Groq LLM</span>
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
                                     │  STRUCTURED JSON OUTPUT │
                                     │  • category             │
                                     │  • urgency              │
                                     │  • confidence           │
                                     │  • reason               │
                                     └──────────┬──────────────┘
                                                │
                                                ▼
                                     ┌─────────────────────────┐
                                     │     ROUTING ENGINE      │
                                     │  (Python / TS Dict)     │
                                     └──────────┬──────────────┘
                                                │
                     ┌──────────────────────────┼─────────────────────────┐
                     ▼                          ▼                         ▼
             Counselling Services      Academic Support          Financial Aid
             (Wellness Center B204)    (Library 3rd Floor)       (Hall A Room 112)
                     │                          │                         │
                     └──────────────────────────┼─────────────────────────┘
                                                ▼
                                     ┌─────────────────────────┐
                                     │    ACTIONABLE OUTCOME   │
                                     │  • Book Appointment     │
                                     │  • Direct Phone/Advisor │
                                     └─────────────────────────┘`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: BOOKING APPOINTMENT                             */}
      {/* ======================================================== */}
      {bookingModalOpen && route && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="bg-[#FFFDF7] border-[4px] border-black shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-[#FFE55C] px-2 py-0.5 border border-black">
                  Priority Intake
                </span>
                <h3 className="text-xl font-black text-black uppercase mt-1">Book Priority Appointment</h3>
                <p className="text-xs font-bold text-gray-700">{route.service} • {route.building}</p>
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
                <h4 className="text-lg font-black text-black uppercase">Appointment Confirmed!</h4>
                <p className="text-xs font-bold text-gray-800 max-w-sm mx-auto">
                  Your appointment with <strong>{route.service}</strong> is confirmed for <strong>{bookingDate}</strong>. Intake confirmation sent to your university ID.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Select Preferred Priority Slot
                  </label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs font-bold bg-white border-2 border-black p-3 text-black shadow-[3px_3px_0px_0px_#000] focus:outline-none"
                  >
                    <option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM (Priority Intake Slot)</option>
                    <option value="Tomorrow, 2:00 PM">Tomorrow, 2:00 PM (Priority Intake Slot)</option>
                    <option value="In 2 Days, 11:30 AM">In 2 Days, 11:30 AM</option>
                    <option value="In 3 Days, 3:00 PM">In 3 Days, 3:00 PM</option>
                  </select>
                </div>

                <div className="bg-[#F3F4F6] border-2 border-black p-3 text-xs font-semibold text-gray-800 space-y-1">
                  <div className="font-black text-black uppercase">Check-in Location:</div>
                  <div>{route.building}, {route.room}</div>
                  <div>Please bring your student ID card or mobile campus pass.</div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3.5 bg-[#A7F3D0] hover:bg-[#6EE7B7] text-black font-black uppercase tracking-wider text-xs border-[3px] border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all"
                >
                  Confirm Priority Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CONTACT ADVISOR                                 */}
      {/* ======================================================== */}
      {contactModalOpen && route && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
          <div className="bg-[#FFFDF7] border-[4px] border-black shadow-[10px_10px_0px_0px_#000] p-6 sm:p-8 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-[#BAE6FD] px-2 py-0.5 border border-black">
                  Direct Outreach
                </span>
                <h3 className="text-xl font-black text-black uppercase mt-1">Contact Department Advisor</h3>
                <p className="text-xs font-bold text-gray-700">{route.service} • {route.email}</p>
              </div>
              <button
                onClick={() => setContactModalOpen(false)}
                className="bg-white hover:bg-gray-100 p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
              >
                <X className="w-5 h-5 text-black stroke-[3]" />
              </button>
            </div>

            {messageSent ? (
              <div className="py-6 text-center space-y-3 bg-[#BAE6FD] border-2 border-black p-4">
                <div className="w-12 h-12 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 text-black stroke-[3]" />
                </div>
                <h4 className="text-lg font-black text-black uppercase">Message Dispatched!</h4>
                <p className="text-xs font-bold text-gray-800 max-w-sm mx-auto">
                  Your confidential inquiry was delivered to the duty advisor at <strong>{route.service}</strong>. Response time is under 4 business hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Your Confidential Message to Advisor
                  </label>
                  <textarea
                    rows={4}
                    value={advisorMessage || inputText}
                    onChange={(e) => setAdvisorMessage(e.target.value)}
                    placeholder="Provide any additional context or questions for your advisor..."
                    className="w-full text-xs font-semibold bg-white border-2 border-black p-3 text-black shadow-[3px_3px_0px_0px_#000] focus:outline-none resize-none"
                  />
                </div>

                <div className="text-xs font-bold text-gray-800 bg-[#FEF08A] border-2 border-black p-2.5">
                  Direct Phone for immediate assistance: <span className="font-mono font-black text-black">{route.phone}</span>
                </div>

                <button
                  onClick={handleSendAdvisorMessage}
                  className="w-full py-3.5 bg-[#FFE55C] hover:bg-yellow-400 text-black font-black uppercase tracking-wider text-xs border-[3px] border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all"
                >
                  Send Inquiry to Advisor
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOOTER - NEOBRUTALISM                                    */}
      {/* ======================================================== */}
      <footer className="border-t-[3px] border-black py-6 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-black text-sm uppercase text-black">
              DHRONA / STUDENT SUPPORT
            </span>
            <span className="text-xs font-bold text-gray-600 block">
              Track 01: Student Triage & Routing Prototype
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
