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
  HelpCircle, 
  Building2, 
  Layers, 
  Code, 
  ExternalLink,
  X,
  PhoneCall,
  Check,
  Compass
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
    category: "Academic Support",
    icon: BookOpen,
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300",
    text: "I am struggling to keep up with my classes and I don't know how to organize my workload. I have three exams next week and feel like I'm failing."
  },
  {
    id: "preset_mental",
    title: "Stress & Sleep",
    category: "Mental Wellbeing",
    icon: Brain,
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
    text: "I haven't been sleeping properly for the last two weeks. Exams are coming up and I'm extremely stressed and having panic moments."
  },
  {
    id: "preset_housing",
    title: "Roommate / Housing",
    category: "Student Housing",
    icon: Home,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300",
    text: "I don't know who to talk to. I'm having problems with my roommate and I'm worried I might lose my housing if things escalate."
  },
  {
    id: "preset_financial",
    title: "Tuition & Emergency Aid",
    category: "Financial Aid",
    icon: Coins,
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
    text: "I lost my on-campus part-time job this week. I don't have enough money for next month's tuition fee installment and groceries."
  },
  {
    id: "preset_crisis",
    title: "Immediate Crisis (Safety Test)",
    category: "Emergency / Crisis",
    icon: ShieldAlert,
    color: "from-red-500/20 to-rose-500/20 border-red-500/50 text-red-300",
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

  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDate, setBookingDate] = useState('Tomorrow, 2:00 PM');
  
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [advisorMessage, setAdvisorMessage] = useState('');

  const handleTriage = (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!text.trim()) return;

    setIsProcessing(true);
    setResult(null);

    // Simulate instant AI evaluation with sub-second feedback
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
    }, 350);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top University Branding Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">DHRONA</span>
                <span className="text-slate-500 text-sm font-light">/</span>
                <span className="text-slate-300 font-semibold text-sm">STUDENT SUPPORT</span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full ml-1">
                  Track 01 Triage
                </span>
              </div>
              <p className="text-xs text-slate-400">One intelligent door to all campus support services</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'triage'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Intake</span>
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'departments'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>12 Departments</span>
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architecture & Pitch</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Challenge Problem Statement Bar (Section 13) */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">The Student Support Crisis:</span>
              <span>Students shouldn't need an org chart to get help.</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
              <div className="bg-slate-950/80 border border-slate-800/80 px-3.5 py-1.5 rounded-lg flex items-center space-x-2">
                <span className="text-base font-black text-rose-400">12</span>
                <span className="text-[11px] text-slate-400 leading-tight">Fragmented Departments</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 px-3.5 py-1.5 rounded-lg flex items-center space-x-2">
                <span className="text-base font-black text-amber-400">3 Weeks</span>
                <span className="text-[11px] text-slate-400 leading-tight">Average Intake Wait</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800/80 px-3.5 py-1.5 rounded-lg flex items-center space-x-2">
                <span className="text-base font-black text-indigo-400">+40%</span>
                <span className="text-[11px] text-slate-400 leading-tight">Bounced Referrals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ======================================================== */}
        {/* TAB 1: STUDENT TRIAGE & INTAKE                           */}
        {/* ======================================================== */}
        {activeTab === 'triage' && (
          <div className="space-y-8">
            {/* Intake Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/20">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  How can we help you today?
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Tell us what you are struggling with in plain words. Dhrona analyzes your situation safely and routes you to the exact campus support you need.
                </p>
              </div>

              {/* Quick Preset Buttons for Hackathon Judges (Section 14 & 11) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Demo Scenarios (1-Click Test for Judges)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Instant test cases</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {DEMO_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.text)}
                        className={`text-left p-3 rounded-xl border bg-gradient-to-br ${preset.color} hover:scale-[1.02] active:scale-[0.99] transition-all flex flex-col justify-between group`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Icon className="w-4 h-4 opacity-90 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                            {preset.category}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white group-hover:text-indigo-200 line-clamp-1">
                          {preset.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g., I've been really stressed about exams and haven't been sleeping for the past two weeks, or I'm struggling with rent and tuition..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none leading-relaxed"
                  />
                  {inputText && (
                    <button
                      onClick={() => setInputText('')}
                      className="absolute top-4 right-4 text-xs text-slate-500 hover:text-slate-300 p-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Private & Confidential • Zero diagnosis • Intended strictly for student intake & routing
                    </span>
                  </div>

                  <button
                    onClick={() => handleTriage()}
                    disabled={isProcessing || !inputText.trim()}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 active:scale-95 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Evaluating Support Path...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Find My Support</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* RESULT SECTION: SAFETY / EMERGENCY OR STANDARD ROUTE     */}
            {/* ======================================================== */}
            {result && route && (
              <div className="space-y-6 animate-fadeIn">
                {/* CASE 1: IMMEDIATE CRISIS TRIGGER (Section 4 & 5) */}
                {result.crisis_flag || result.urgency === 'high' || detectCrisis(inputText) ? (
                  <div className="bg-gradient-to-br from-red-950 via-slate-950 to-red-950 border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-900/40 space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-7 h-7 text-red-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider border border-red-500/40">
                            Immediate Support Available
                          </span>
                          <span className="text-xs text-red-400 font-mono">Safety Rule Activated</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                          We are here for you right now.
                        </h3>
                        <p className="text-sm text-red-200/90 mt-1 max-w-3xl leading-relaxed">
                          Your message suggests you may be going through an immediate crisis. You do not have to carry this alone. Please reach out to one of the trained, confidential emergency responders below:
                        </p>
                      </div>
                    </div>

                    {/* Immediate Hotlines */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-5 space-y-3">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Campus Crisis Dispatch</span>
                          <PhoneCall className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="text-xl font-black text-white">(555) 911-HELP</div>
                        <p className="text-xs text-slate-300">
                          Direct 24/7 campus emergency psychological & safety response team.
                        </p>
                        <button
                          onClick={() => alert("Initiating emergency protocol connection to Campus Crisis Dispatch.")}
                          className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/30"
                        >
                          Connect Immediately
                        </button>
                      </div>

                      <div className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-5 space-y-3">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                          <span>National Suicide & Crisis</span>
                          <HeartHandshake className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="text-xl font-black text-white">Call or Text 988</div>
                        <p className="text-xs text-slate-300">
                          Free, confidential, 24/7 lifeline for mental health crises & emotional distress.
                        </p>
                        <button
                          onClick={() => alert("Initiating direct call to 988 Suicide & Crisis Lifeline.")}
                          className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md shadow-red-600/30"
                        >
                          Call 988
                        </button>
                      </div>

                      <div className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-5 space-y-3">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Campus Security Escort</span>
                          <ShieldAlert className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="text-xl font-black text-white">(555) 019-SAFE</div>
                        <p className="text-xs text-slate-300">
                          Immediate 24/7 on-campus safety escort and emergency officer support.
                        </p>
                        <button
                          onClick={() => alert("Dispatching request to Campus Safety & Escort Service.")}
                          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                        >
                          Request Campus Officer
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-950/60 border border-red-500/30 rounded-xl p-3.5 text-xs text-red-300 flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        <strong>Safety Guarantee:</strong> AI conversation is suspended. You are routed directly to licensed human intervention.
                      </span>
                    </div>
                  </div>
                ) : (
                  /* CASE 2: NORMAL / MEDIUM / LOW TRIAGED ROUTING */
                  <div className="space-y-6">
                    {/* Visual Support Path (Section 12) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Your Support Path
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400">Triage Confidence:</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {Math.round(result.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
                        <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Step 1 • Student Intake</div>
                          <div className="text-xs font-medium text-slate-300 mt-1 line-clamp-2 italic">
                            "{inputText}"
                          </div>
                        </div>

                        <div className="flex justify-center text-slate-600">
                          <ArrowRight className="w-5 h-5 hidden md:block" />
                          <span className="md:hidden text-xs">↓</span>
                        </div>

                        <div className="md:col-span-2 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4">
                          <div className="text-[10px] text-indigo-400 uppercase font-semibold">Step 2 • AI Triage</div>
                          <div className="text-sm font-bold text-white mt-1 capitalize">
                            {result.category.replace('_', ' ')}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                              result.urgency === 'high' 
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : result.urgency === 'medium'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {result.urgency} Urgency
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-center text-slate-600">
                          <ArrowRight className="w-5 h-5 hidden md:block" />
                          <span className="md:hidden text-xs">↓</span>
                        </div>

                        <div className="md:col-span-2 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4">
                          <div className="text-[10px] text-emerald-400 uppercase font-semibold">Step 3 • University Service</div>
                          <div className="text-sm font-bold text-white mt-1">
                            {route.service}
                          </div>
                          <div className="text-[11px] text-emerald-300/80 mt-1 truncate">
                            {route.action}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Recommended Service Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Department Details & Actions */}
                      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                                Recommended Destination
                              </span>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-400">{route.department}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-1">
                              {route.service}
                            </h3>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">Triage Match:</span>
                            <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                              {(result.confidence * 100).toFixed(0)}% Match
                            </span>
                          </div>
                        </div>

                        {/* Why We Recommend This */}
                        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Why We Recommend This</span>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed">
                            {result.reason}
                          </p>
                        </div>

                        {/* Location, Hours, Contact Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start space-x-3">
                            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <div className="font-semibold text-white">{route.building}</div>
                              <div className="text-slate-400">{route.room}</div>
                            </div>
                          </div>

                          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start space-x-3">
                            <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <div className="font-semibold text-white">Hours & Walk-ins</div>
                              <div className="text-slate-400">{route.hours}</div>
                            </div>
                          </div>

                          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start space-x-3">
                            <Phone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <div className="font-semibold text-white">Direct Phone</div>
                              <div className="text-slate-400 font-mono">{route.phone}</div>
                            </div>
                          </div>

                          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start space-x-3">
                            <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <div className="font-semibold text-white">Department Email</div>
                              <div className="text-slate-400 font-mono">{route.email}</div>
                            </div>
                          </div>
                        </div>

                        {/* Priority support note */}
                        {route.priorityNote && (
                          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-300 flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span>
                              <strong>Priority Intake Notice:</strong> {route.priorityNote}
                            </span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            onClick={() => setBookingModalOpen(true)}
                            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>{route.action}</span>
                          </button>

                          <button
                            onClick={() => setContactModalOpen(true)}
                            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition flex items-center justify-center space-x-2 border border-slate-700 active:scale-95"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Contact Assigned Advisor</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Structured Triage Inspector (Groq JSON schema) */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                              <Code className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Groq Triage Schema</span>
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                              JSON Output
                            </span>
                          </div>

                          <pre className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
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

                          <div className="text-[11px] text-slate-400 leading-normal">
                            Classification generated through dual-layer verification (deterministic safety keywords + structured LLM triage).
                          </div>
                        </div>

                        {/* Recent Ingestion History */}
                        {history.length > 1 && (
                          <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-4 space-y-2.5">
                            <div className="text-xs font-semibold text-slate-400">
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
                                  className="w-full text-left p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 text-xs text-slate-300 truncate transition block"
                                >
                                  <div className="font-semibold text-indigo-300">{item.route.service}</div>
                                  <div className="text-[10px] text-slate-500 truncate">{item.text}</div>
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  The Problem Statement
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Why University Support Systems Fail Students
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Traditional universities operate 12+ separate administrative silos. A stressed student struggling with both grades and rent has to figure out which of these 12 buildings to visit, fill out redundant intake forms, and frequently gets referred in circles.
                </p>
              </div>

              {/* Grid of the 12 fragmented departments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {ALL_12_DEPARTMENTS.map((dept, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Department {i + 1} of 12
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        Wait: {dept.wait}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{dept.name}</div>
                    <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span>Category: {dept.category}</span>
                      <span className="text-rose-400 text-[10px]">Misdirection: {dept.referrals}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* The Dhrona Solution Banner */}
              <div className="bg-gradient-to-r from-indigo-900/60 via-blue-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">How Dhrona Solves This in Seconds</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Instead of forcing students to understand the university hierarchy, Dhrona offers a single empathetic conversational intake, classifies the intent, and maps directly to the right department.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('triage')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition"
                >
                  Try Student Intake
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                The Pitch Strategy (Section 15)
              </span>
              <h2 className="text-2xl font-bold text-white">
                "Students shouldn't need to understand the university's organizational structure before they can get help."
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">1. Understand</div>
                  <div className="text-sm font-bold text-white">Natural Language</div>
                  <p className="text-xs text-slate-400">Student expresses their raw stress or issue in their own voice.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">2. Safety First</div>
                  <div className="text-sm font-bold text-red-400">Keyword Interceptor</div>
                  <p className="text-xs text-slate-400">Instant deterministic catch for self-harm or crisis terms.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">3. Triage</div>
                  <div className="text-sm font-bold text-indigo-400">Structured Classification</div>
                  <p className="text-xs text-slate-400">Category, urgency, confidence, and reasoning extraction.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">4. Route & Act</div>
                  <div className="text-sm font-bold text-emerald-400">Actionable Service</div>
                  <p className="text-xs text-slate-400">Direct booking, phone, room number, and immediate advisor access.</p>
                </div>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white">System Architecture & Groq Prompt Pipeline</h3>
              
              <div className="font-mono text-xs text-slate-300 bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto leading-relaxed">
{`STUDENT MESSAGE
      │
      ▼
SAFETY KEYWORD CHECK (Deterministic Layer)
      ├── [Crisis Detected] ──► 🚨 Immediate Emergency Protocol (988 / Campus Police)
      │
      └── [Standard / Safe]
            │
            ▼
      GROQ LLM INFERENCE (llama-3.3-70b-versatile)
            │
            ▼
      STRUCTURED JSON OUTPUT
      {
        "category": "mental_wellbeing" | "academic" | "financial" | ...,
        "urgency": "low" | "medium" | "high",
        "confidence": 0.94,
        "reason": "..."
      }
            │
            ▼
      ROUTING ENGINE (Python / TypeScript Dict Rules)
            │
            ├── mental_wellbeing ──► Counselling Services (Wellness Center B204)
            ├── academic         ──► Academic Success Center (Library 3rd Floor)
            ├── financial        ──► Financial Aid & Emergency Grants (Hall A112)
            ├── housing          ──► Student Housing Office (Pavilion 101)
            ├── disability       ──► Accessibility Services (Suite 110)
            └── harassment       ──► Title IX & Safety Office (Suite 300)
            │
            ▼
      ACTIONABLE STUDENT OUTCOME
      • One-click Appointment Booking
      • Direct Advisor Outreach
      • Location & Drop-in Hours`}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: BOOKING APPOINTMENT                             */}
      {/* ======================================================== */}
      {bookingModalOpen && route && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Book Priority Appointment</h3>
                <p className="text-xs text-slate-400">{route.service} • {route.building}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your appointment with <strong>{route.service}</strong> is scheduled for <strong>{bookingDate}</strong>. Confirmation sent to your university email.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Preferred Time Slot
                  </label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM (Priority Intake)</option>
                    <option value="Tomorrow, 2:00 PM">Tomorrow, 2:00 PM (Priority Intake)</option>
                    <option value="In 2 Days, 11:30 AM">In 2 Days, 11:30 AM</option>
                    <option value="In 3 Days, 3:00 PM">In 3 Days, 3:00 PM</option>
                  </select>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Location Details:</div>
                  <div className="text-slate-400">{route.building}, {route.room}</div>
                  <div className="text-slate-400">Please arrive 5 minutes early with your student ID card.</div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Contact Department Advisor</h3>
                <p className="text-xs text-slate-400">{route.service} • {route.email}</p>
              </div>
              <button
                onClick={() => setContactModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {messageSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Message Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your confidential inquiry has been routed to the duty advisor at <strong>{route.service}</strong>. Expect a response within 4 business hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Confidential Message to Advisor
                  </label>
                  <textarea
                    rows={4}
                    value={advisorMessage || inputText}
                    onChange={(e) => setAdvisorMessage(e.target.value)}
                    placeholder="Provide any additional context or questions for your advisor..."
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="text-[11px] text-slate-400">
                  Direct phone for immediate questions: <span className="font-mono text-white">{route.phone}</span>
                </div>

                <button
                  onClick={handleSendAdvisorMessage}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/30"
                >
                  Send Inquiry to Advisor
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 mt-auto bg-slate-950">
        <p className="font-medium text-slate-400">
          DHRONA Student Support • Track 01: Student Triage & Routing
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          Built for Hackathon Demo • Intended as an intake & routing assistant, not a clinical diagnostic system.
        </p>
      </footer>
    </div>
  );
}
