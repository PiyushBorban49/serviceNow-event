import React, { useState, useEffect, useRef } from 'react';
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
  Lock, 
  BarChart3, 
  Bookmark,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smile,
  Shield,
  Bot,
  Activity,
  Sliders,
  Wind,
  Waves,
  Feather,
  Info
} from 'lucide-react';
import { 
  classifyMultiNeedMessage, 
  calculateClinicalScore,
  detectCrisis, 
  getRoute, 
  ALL_12_DEPARTMENTS, 
  MultiNeedTriageResult, 
  DetectedNeed, 
  UniversityRoute,
  ClinicalAssessmentState,
  ClinicalScoringResult
} from './services/triage';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionType?: 'exercise' | 'escalation' | 'general';
}

const DEMO_PRESETS = [
  {
    id: "preset_multi",
    title: "Exams, Roommate & Tuition",
    category: "3 Concurrent Needs",
    badge: "⭐ Multi-Need Scenario",
    pillColor: "bg-[#E8F3EE] text-[#1B4332] border-[#C3DEC0]",
    accentBg: "bg-[#F3FAF6]",
    text: "I'm struggling with exams, my roommate situation is getting worse every day, and I'm stressed about paying my tuition next month. I don't know who to talk to.",
    assessment: {
      q1Safety: 'no' as const,
      q2TimeHorizon: 'gradual' as const,
      q3FunctionalImpact: 'moderate' as const,
      q4CompoundTriggers: ['deadline', 'housing_finaid'],
      q5DistressLevel: 3 as const
    }
  },
  {
    id: "preset_wellbeing_academic",
    title: "Panic Attacks & Failing Course",
    category: "Dual Need",
    badge: "Dual Need",
    pillColor: "bg-[#F0F4F8] text-[#2C4A63] border-[#CADCE9]",
    accentBg: "bg-[#F6F9FC]",
    text: "I haven't slept in three days because I'm failing Organic Chemistry. I'm having panic attacks before every lab lecture.",
    assessment: {
      q1Safety: 'unsure' as const,
      q2TimeHorizon: 'escalating' as const,
      q3FunctionalImpact: 'severe' as const,
      q4CompoundTriggers: ['deadline'],
      q5DistressLevel: 3 as const
    }
  },
  {
    id: "preset_housing_financial",
    title: "Eviction Risk & Lost Campus Job",
    category: "Dual Need",
    badge: "Housing & Aid",
    pillColor: "bg-[#FDF7E7] text-[#7C5315] border-[#F2DEB0]",
    accentBg: "bg-[#FCF9F0]",
    text: "My landlord threatened to evict me and I just lost my on-campus dining hall job. I have no money for rent or food.",
    assessment: {
      q1Safety: 'no' as const,
      q2TimeHorizon: 'acute' as const,
      q3FunctionalImpact: 'severe' as const,
      q4CompoundTriggers: ['housing_finaid'],
      q5DistressLevel: 3 as const
    }
  },
  {
    id: "preset_academic",
    title: "Study Schedule & Deadlines",
    category: "Single Need",
    badge: "Academic",
    pillColor: "bg-[#F4F1FA] text-[#4A386D] border-[#DDD5EF]",
    accentBg: "bg-[#F9F7FC]",
    text: "I am having trouble organizing my study schedule and balancing four heavy project deadlines this month.",
    assessment: {
      q1Safety: 'no' as const,
      q2TimeHorizon: 'chronic' as const,
      q3FunctionalImpact: 'minimal' as const,
      q4CompoundTriggers: ['deadline'],
      q5DistressLevel: 1 as const
    }
  },
  {
    id: "preset_crisis",
    title: "Immediate Crisis Support",
    category: "Urgent Safety",
    badge: "🚨 Safety Intercept",
    pillColor: "bg-[#FDF0ED] text-[#9E2A2B] border-[#F5C7C3]",
    accentBg: "bg-[#FFF6F5]",
    text: "I feel like hurting myself and I don't know what to do.",
    assessment: {
      q1Safety: 'yes' as const,
      q2TimeHorizon: 'acute' as const,
      q3FunctionalImpact: 'shutdown' as const,
      q4CompoundTriggers: ['trauma'],
      q5DistressLevel: 4 as const
    }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'triage' | 'companion' | 'departments' | 'admin' | 'architecture'>('triage');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [triageResult, setTriageResult] = useState<MultiNeedTriageResult | null>(null);

  // Student Identity Mode
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [studentId, setStudentId] = useState('STU-2026-8491');
  const studentName = isAnonymous ? 'Student' : 'Alex';

  // Mental Health Ambient Sound Generator (Web Audio API)
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundMode, setSoundMode] = useState<'rain' | 'waves' | 'breeze'>('rain');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // 5 Clinical Intake Questions State
  const [clinicalAssessment, setClinicalAssessment] = useState<ClinicalAssessmentState>({
    q1Safety: 'no',
    q2TimeHorizon: 'gradual',
    q3FunctionalImpact: 'moderate',
    q4CompoundTriggers: ['deadline'],
    q5DistressLevel: 2
  });

  const liveScore: ClinicalScoringResult = calculateClinicalScore(clinicalAssessment);

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

  // Reassurance Chatbot State
  const [queueTier, setQueueTier] = useState<'P3' | 'P2' | 'P1'>('P3');
  const [queueDays, setQueueDays] = useState(2);
  const [queueTicketId] = useState('DH-8291');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "We've received your intake and reserved your request in the care queue. You are not alone in this, and taking this step to reach out took courage. I'm here as your Care Companion while you wait for your appointment.",
      time: 'Just now'
    },
    {
      id: 'm2',
      sender: 'bot',
      text: "While your assigned advisor prepares your intake file, would you like a quick 60-second grounding exercise, or do you have questions about what to expect?",
      time: 'Just now'
    }
  ]);

  // Interactive Exercises State
  const [activeExercise, setActiveExercise] = useState<'breathing' | 'sensory' | 'muscle' | null>('breathing');
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathCycles, setBreathCycles] = useState(0);

  // Sensory Grounding State
  const [sensorySteps, setSensorySteps] = useState([
    { id: 5, label: "5 things you can SEE around you", done: false, prompt: "Look for distinct colors or soft textures in the room" },
    { id: 4, label: "4 things you can physically TOUCH", done: false, prompt: "Feel your desk, fabric of your clothes, or chair" },
    { id: 3, label: "3 things you can HEAR right now", done: false, prompt: "Listen for ambient sounds, your own breath, or distant breezes" },
    { id: 2, label: "2 things you can SMELL", done: false, prompt: "Warm coffee, fresh air, paper, or essential oils" },
    { id: 1, label: "1 thing you can TASTE", done: false, prompt: "A sip of cold soothing water" }
  ]);

  // Re-Triage Escalation Modal
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);
  const [escalationAnswers, setEscalationAnswers] = useState({
    distressScore: 8,
    sleepDeprived: true,
    panicAttacks: true,
    academicParalysis: true,
    selfHarmThoughts: false
  });
  const [escalationSuccess, setEscalationSuccess] = useState(false);

  // Daily Warm Check-in simulated SMS
  const [smsAnswered, setSmsAnswered] = useState(false);
  const [smsResponseChoice, setSmsResponseChoice] = useState('');

  // Breathing Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) return prev - 1;
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 4;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 4;
          } else if (breathingPhase === 'Exhale') {
            setBreathingPhase('Rest');
            return 4;
          } else {
            setBreathingPhase('Inhale');
            setBreathCycles((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  // Web Audio Pink Noise Generator for Soothing Mental Focus
  const toggleAmbientSound = () => {
    if (isPlayingSound) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingSound(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Generate gentle soothing pink noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        // Warm Low-pass Filter to create warm rain sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(soundMode === 'waves' ? 450 : soundMode === 'breeze' ? 600 : 800, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.35, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(0);
        noiseNodeRef.current = noise;
        gainNodeRef.current = gainNode;
        setIsPlayingSound(true);
      } catch (err) {
        console.log("Audio Ambient initialization note:", err);
      }
    }
  };

  const handleSendMessage = (customText?: string) => {
    const text = customText || chatInput;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput('');

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = "";

      if (detectCrisis(text) || lower.includes("hurt") || lower.includes("harm") || lower.includes("die")) {
        botResponse = "I hear how much pain you're experiencing right now, and I care deeply about your immediate safety. Because your wellbeing is paramount, I am activating our direct 24/7 Crisis Response protocol. Please reach out to (555) 911-HELP or dial 988 right now.";
        setQueueTier('P1');
      } else if (lower.includes("how long") || lower.includes("wait") || lower.includes("appointment")) {
        botResponse = `Your intake is confirmed in our ${queueTier} queue. The care team at Counselling Services has your file, and your reserved window is in ${queueDays} days. If your symptoms worsen at any point, click the 'My situation has worsened' button above to request an on-call priority bump.`;
      } else if (lower.includes("prepare") || lower.includes("bring") || lower.includes("expect")) {
        botResponse = "You don't need to prepare a formal presentation or worry about having the 'right' words. Bring your student ID and a water bottle. Your advisor has your pre-triaged handoff slip, so you won't have to repeat your whole story from scratch.";
      } else if (lower.includes("anxious") || lower.includes("panic") || lower.includes("breathe") || lower.includes("grounding")) {
        botResponse = "That acute anxiety is very real and understandable while waiting. Let's take a slow moment together. Try the Box Breathing or 5-4-3-2-1 Sensory Grounding tools on your right.";
      } else {
        botResponse = "Thank you for sharing that with me. It is completely normal to feel unsettled while in the waiting window. Your concerns are valid, and gentle support is already in motion. Would you like to practice a quick grounding micro-exercise right now?";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 450);
  };

  const handleTriage = (textToAnalyze?: string, customAssessment?: ClinicalAssessmentState) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : inputText;
    const assessToUse = customAssessment || clinicalAssessment;
    if (!text.trim()) return;

    setIsProcessing(true);
    setTriageResult(null);
    setHandoffGenerated(false);
    setFollowUpConfirmed(false);

    setTimeout(() => {
      const res = classifyMultiNeedMessage(text, assessToUse);
      setTriageResult(res);
      setIsProcessing(false);

      if (res.clinicalScore) {
        if (res.clinicalScore.queueTier === 'P1') {
          setQueueTier('P1');
          setQueueDays(0);
        } else if (res.clinicalScore.queueTier === 'P2') {
          setQueueTier('P2');
          setQueueDays(1);
        } else {
          setQueueTier('P3');
          setQueueDays(2);
        }
      }
    }, 320);
  };

  const handleSelectPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setInputText(preset.text);
    setClinicalAssessment(preset.assessment);
    handleTriage(preset.text, preset.assessment);
  };

  const handleIDontKnowWhereToStart = () => {
    const defaultMultiSituation = "I'm struggling with exams, my roommate situation is getting worse every day, and I'm stressed about paying my tuition next month. I don't know who to talk to.";
    const assess = {
      q1Safety: 'no' as const,
      q2TimeHorizon: 'gradual' as const,
      q3FunctionalImpact: 'moderate' as const,
      q4CompoundTriggers: ['deadline', 'housing_finaid'],
      q5DistressLevel: 3 as const
    };
    setInputText(defaultMultiSituation);
    setClinicalAssessment(assess);
    handleTriage(defaultMultiSituation, assess);
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

  const handleEscalationSubmit = () => {
    if (escalationAnswers.selfHarmThoughts) {
      alert("Immediate safety concern reported. Directing to Emergency Crisis dispatch immediately: 988 or (555) 911-HELP.");
    }
    setQueueTier('P1');
    setQueueDays(0);
    setEscalationSuccess(true);
    setTimeout(() => {
      setEscalationSuccess(false);
      setEscalationModalOpen(false);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `esc-${Date.now()}`,
          sender: 'bot',
          text: "🚨 Escalation Alert Processed: Your status has been elevated to P1 (Same-Day On-Call Priority Slot). A crisis coordinator has been notified and will contact your student account shortly.",
          time: 'Just now'
        }
      ]);
    }, 1800);
  };

  const toggleQ4Trigger = (key: string) => {
    if (key === 'none') {
      setClinicalAssessment({ ...clinicalAssessment, q4CompoundTriggers: [] });
      return;
    }
    const current = [...clinicalAssessment.q4CompoundTriggers];
    const idx = current.indexOf(key);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(key);
    }
    setClinicalAssessment({ ...clinicalAssessment, q4CompoundTriggers: current });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2E26] flex flex-col font-sans selection:bg-[#D4E8DC] selection:text-[#1B4332]">
      {/* ======================================================== */}
      {/* REFINED SERENE HEADER                                    */}
      {/* ======================================================== */}
      <header className="border-b border-[#E3E8E3] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 sm:py-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] text-white shadow-[0_4px_12px_rgba(27,67,50,0.18)] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-[#143224]">
                  DHRONA
                </span>
                <span className="text-[11px] font-bold text-[#2D6A4F] bg-[#E8F3EE] border border-[#C5DEC8] px-2.5 py-0.5 rounded-full">
                  Care Navigator
                </span>
                <span className="text-[10px] font-semibold text-[#507693] bg-[#EBF2F7] border border-[#CADCE9] px-2 py-0.5 rounded-full hidden md:inline-block">
                  Clinical Acuity Triage
                </span>
              </div>
              <p className="text-xs font-medium text-[#52685E]">
                Empathetic student triage, multi-need navigation &amp; gentle companion care
              </p>
            </div>
          </div>

          {/* Right Controls: Ambient Audio Toggle, Privacy Mode, Tabs */}
          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            {/* Ambient Nature Sound generator (Stress Reduction) */}
            <button
              onClick={toggleAmbientSound}
              title={isPlayingSound ? "Stop soothing rain sound" : "Play soothing rain ambient sound"}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isPlayingSound 
                  ? 'bg-[#E8F3EE] text-[#1B4332] border-[#2D6A4F] shadow-sm animate-pulse'
                  : 'bg-white text-[#52685E] border-[#E3E8E3] hover:bg-[#F2F7F4]'
              }`}
            >
              {isPlayingSound ? <Volume2 className="w-3.5 h-3.5 text-[#2D6A4F]" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isPlayingSound ? 'Rain Sound: On' : 'Calm Audio'}</span>
            </button>

            {/* Privacy Mode */}
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E3E8E3] text-[#40564C] hover:bg-[#F6F4F0] transition shadow-xs hidden md:flex items-center space-x-1"
            >
              <span>{isAnonymous ? '🛡️ Anonymous Mode' : `🎓 ${studentId}`}</span>
            </button>

            {/* Primary Nav Navigation */}
            <nav className="flex items-center bg-[#EDEBE6] p-1 rounded-2xl border border-[#DFDDD8] space-x-1">
              <button
                onClick={() => setActiveTab('triage')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'triage'
                    ? 'bg-white text-[#1B4332] shadow-xs'
                    : 'text-[#5A6D63] hover:text-[#1B4332]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Navigator</span>
              </button>

              <button
                onClick={() => setActiveTab('companion')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'companion'
                    ? 'bg-white text-[#1B4332] shadow-xs'
                    : 'text-[#5A6D63] hover:text-[#1B4332]'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Companion</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
              </button>

              <button
                onClick={() => setActiveTab('departments')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'departments'
                    ? 'bg-white text-[#1B4332] shadow-xs'
                    : 'text-[#5A6D63] hover:text-[#1B4332]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>12 Silos</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-white text-[#1B4332] shadow-xs'
                    : 'text-[#5A6D63] hover:text-[#1B4332]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeTab === 'architecture'
                    ? 'bg-white text-[#1B4332] shadow-xs'
                    : 'text-[#5A6D63] hover:text-[#1B4332]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Pitch</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* SOOTHING SUBTLE REASSURANCE TICKER                       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-[#EBF4EF] via-[#F2F7F4] to-[#EEF5F8] border-b border-[#DFE7E1] py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#2A4D3B]">
            <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping shrink-0"></span>
            <span className="font-semibold">
              Take a slow, deep breath. You are in a safe, non-judgmental space.
            </span>
            <span className="text-[#658273] hidden sm:inline">
              • Share whatever is on your mind in your own words.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleIDontKnowWhereToStart}
              className="text-xs font-semibold text-[#1B4332] hover:text-[#2D6A4F] bg-white border border-[#C5DEC8] hover:border-[#2D6A4F] px-3 py-1 rounded-full shadow-xs transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Load sample multi-need situation</span>
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
            
            {/* STEP 1: INTAKE FORM */}
            <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-9 space-y-7">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0F3EF] pb-5">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2D6A4F] bg-[#E8F3EE] px-3 py-1 rounded-full mb-2">
                    <Feather className="w-3.5 h-3.5" />
                    <span>Step 1 • Universal Topic Intake</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#143224] tracking-tight">
                    What's weighing on you right now?
                  </h2>
                  <p className="text-sm font-medium text-[#52685E] mt-1 max-w-2xl leading-relaxed">
                    You don't need to know which office to visit or use formal terminology. Describe your situation naturally—we connect you to all the right campus care.
                  </p>
                </div>

                <button
                  onClick={handleIDontKnowWhereToStart}
                  className="px-4 py-2.5 bg-[#F2F7F4] hover:bg-[#E4EFE9] text-[#1B4332] text-xs font-bold rounded-2xl border border-[#CDE0D4] transition shadow-xs flex items-center space-x-2 shrink-0 self-start md:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>"I Don't Know Where To Start"</span>
                </button>
              </div>

              {/* Quick Empathy Scenarios */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#40564C] flex items-center space-x-1.5">
                    <span>Common Student Situations (Click to pre-fill):</span>
                  </span>
                  <span className="text-[11px] font-medium text-[#7C9286]">Instant Test Scenarios</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left p-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${preset.accentBg} border-[#E3E8E3] hover:border-[#2D6A4F] flex flex-col justify-between`}
                    >
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 inline-block self-start ${preset.pillColor}`}>
                        {preset.badge}
                      </span>
                      <div className="text-xs font-bold text-[#143224] leading-snug">
                        {preset.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input */}
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Take your time. You can write: 'I'm struggling with exams, my roommate situation is getting worse, and I'm stressed about paying my tuition next month'..."
                    className="w-full bg-[#FAF8F5] rounded-2xl border border-[#DCE4DD] focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/10 focus:outline-none p-4 text-sm font-medium text-[#1A2E26] placeholder:text-[#8D9F95] leading-relaxed transition-all"
                  />
                  {inputText && (
                    <button
                      onClick={() => setInputText('')}
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white text-xs font-semibold px-2.5 py-1 rounded-xl border border-[#DCE4DD] text-[#5A6D63] transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* STEP 2: 5 CLINICAL QUESTIONS (CALMING SOOTHING UI)      */}
            {/* ======================================================== */}
            <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-9 space-y-7">
              
              {/* Header with Live Score Meter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F3EF] pb-5">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#345C78] bg-[#EBF2F7] px-3 py-1 rounded-full mb-2">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Step 2 • Clinical Acuity &amp; Triage Assessment</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#143224] tracking-tight">
                    5-Question Clinical Acuity Check
                  </h3>
                  <p className="text-xs font-medium text-[#52685E] mt-1 max-w-2xl leading-relaxed">
                    Helps us calibrate queue urgency (P1 to P4) so students experiencing acute decompensation or crisis receive immediate care.
                  </p>
                </div>

                {/* Live Acuity Score Tracker Badge */}
                <div className="bg-gradient-to-br from-[#F5FAF7] to-[#EDF6F1] border border-[#CDE0D4] p-4 rounded-2xl text-right shadow-xs shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#52685E]">Calculated Acuity Score</div>
                  <div className="text-2xl font-heading font-extrabold text-[#143224] mt-0.5 flex items-center justify-end space-x-2">
                    <span>{liveScore.totalScore} Pts</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      liveScore.queueTier === 'P1'
                        ? 'bg-[#FDF0ED] text-[#9E2A2B] border-[#F5C7C3]'
                        : liveScore.queueTier === 'P2'
                        ? 'bg-[#FDF7E7] text-[#7C5315] border-[#F2DEB0]'
                        : 'bg-[#E8F3EE] text-[#1B4332] border-[#C3DEC0]'
                    }`}>
                      {liveScore.queueTier} Tier
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#52685E] mt-0.5">
                    {liveScore.tierLabel}
                  </div>
                </div>
              </div>

              {/* 5 Questions */}
              <div className="space-y-6">

                {/* Q1: Safety & Self-Harm */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  clinicalAssessment.q1Safety === 'yes'
                    ? 'bg-[#FDF0ED] border-[#F5C7C3]'
                    : 'bg-[#FAF8F5] border-[#E3E8E3]'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#143224]">
                      Q1: Safety &amp; Self-Harm (Clinical Override)
                    </span>
                    <span className="text-[11px] font-medium text-[#7C9286]">0 to 100 Pts</span>
                  </div>
                  <div className="text-sm font-semibold text-[#143224] mb-3">
                    "Are you currently having thoughts of self-harm, suicide, or feeling unsafe?"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'no', label: 'No', pts: '0 Pts', desc: 'Standard support flow' },
                      { key: 'unsure', label: 'Unsure / Mild thoughts', pts: '25 Pts', desc: 'Elevated triage care' },
                      { key: 'yes', label: 'Yes', pts: '100 Pts', desc: 'Instant P1 Emergency Override' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setClinicalAssessment({ ...clinicalAssessment, q1Safety: opt.key as any })}
                        className={`p-3.5 text-left rounded-xl border transition-all ${
                          clinicalAssessment.q1Safety === opt.key
                            ? opt.key === 'yes'
                              ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-sm'
                              : 'bg-white text-[#1B4332] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-xs'
                            : 'bg-white/80 hover:bg-white text-[#40564C] border-[#E3E8E3]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span>{opt.label}</span>
                          <span className="font-mono text-[11px]">{opt.pts}</span>
                        </div>
                        <span className={`text-[11px] font-normal block mt-1 ${clinicalAssessment.q1Safety === opt.key && opt.key === 'yes' ? 'text-white/90' : 'text-[#658273]'}`}>
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Time Horizon */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3E8E3] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143224]">
                      Q2: Time Horizon (Duration &amp; Onset)
                    </span>
                    <span className="text-[11px] font-medium text-[#7C9286]">5 to 20 Pts</span>
                  </div>
                  <div className="text-sm font-semibold text-[#143224]">
                    "How long has this situation or distress been affecting you?"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { key: 'chronic', label: 'Over a month', pts: '5 Pts', note: 'Chronic / stable' },
                      { key: 'gradual', label: '1 to 4 weeks', pts: '10 Pts', note: 'Gradual buildup' },
                      { key: 'escalating', label: '3 to 7 days', pts: '15 Pts', note: 'Escalating' },
                      { key: 'acute', label: 'Last 48 hours', pts: '20 Pts', note: 'Acute crisis onset' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setClinicalAssessment({ ...clinicalAssessment, q2TimeHorizon: opt.key as any })}
                        className={`p-3 text-left rounded-xl border transition-all ${
                          clinicalAssessment.q2TimeHorizon === opt.key
                            ? 'bg-white text-[#1B4332] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-xs'
                            : 'bg-white/80 hover:bg-white text-[#40564C] border-[#E3E8E3]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span>{opt.label}</span>
                          <span className="font-mono text-[11px] text-[#2D6A4F]">{opt.pts}</span>
                        </div>
                        <span className="text-[11px] text-[#658273] block mt-1">{opt.note}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3: Daily Functional Impact */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3E8E3] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143224]">
                      Q3: Daily Functional Impact
                    </span>
                    <span className="text-[11px] font-medium text-[#7C9286]">5 to 25 Pts</span>
                  </div>
                  <div className="text-sm font-semibold text-[#143224]">
                    "How severely is this impacting your ability to function today? (e.g., sleeping, eating, attending class)"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { key: 'minimal', label: 'Minimal', pts: '5 Pts', desc: "Managing, but under stress." },
                      { key: 'moderate', label: 'Moderate', pts: '10 Pts', desc: "Struggling to focus or sleep, but getting by." },
                      { key: 'severe', label: 'Severe', pts: '20 Pts', desc: "Skipping classes, unable to eat/sleep." },
                      { key: 'shutdown', label: 'Total Shutdown', pts: '25 Pts', desc: "Unable to perform basic routines." }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setClinicalAssessment({ ...clinicalAssessment, q3FunctionalImpact: opt.key as any })}
                        className={`p-3 text-left rounded-xl border transition-all ${
                          clinicalAssessment.q3FunctionalImpact === opt.key
                            ? 'bg-white text-[#1B4332] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-xs'
                            : 'bg-white/80 hover:bg-white text-[#40564C] border-[#E3E8E3]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs mb-1">
                          <span>{opt.label}</span>
                          <span className="font-mono text-[11px] text-[#2D6A4F]">{opt.pts}</span>
                        </div>
                        <span className="text-[11px] text-[#658273] leading-snug">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4: Compound Triggers */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3E8E3] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143224]">
                      Q4: Compound Pressures &amp; Trigger Factors
                    </span>
                    <span className="text-[11px] font-medium text-[#7C9286]">Select all that apply</span>
                  </div>
                  <div className="text-sm font-semibold text-[#143224]">
                    "Are any critical external triggers adding immediate pressure?"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { key: 'none', label: 'None of these', pts: '0 Pts' },
                      { key: 'deadline', label: 'Impending deadline / Failing grades', pts: '5 Pts' },
                      { key: 'housing_finaid', label: 'Housing insecurity / Loss of aid', pts: '10 Pts' },
                      { key: 'trauma', label: 'Personal trauma / Safety / Abuse', pts: '15 Pts' }
                    ].map((opt) => {
                      const isSelected = opt.key === 'none' 
                        ? clinicalAssessment.q4CompoundTriggers.length === 0 
                        : clinicalAssessment.q4CompoundTriggers.includes(opt.key);
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => toggleQ4Trigger(opt.key)}
                          className={`p-3 text-left rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-white text-[#1B4332] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-xs'
                              : 'bg-white/80 hover:bg-white text-[#40564C] border-[#E3E8E3]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs mb-1">
                            <span className="flex items-center space-x-1.5">
                              <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px] ${isSelected ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'border-[#CADCE9]'}`}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <span>{opt.label}</span>
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-[#2D6A4F]">+{opt.pts}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q5: Emotional Distress Level */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3E8E3] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143224]">
                      Q5: Emotional Distress Level (Self-Reported)
                    </span>
                    <span className="text-[11px] font-medium text-[#7C9286]">5 to 20 Pts</span>
                  </div>
                  <div className="text-sm font-semibold text-[#143224]">
                    "On a scale of 1 to 4, how close do you feel to your breaking point right now?"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { val: 1, label: '1 - Low', pts: '5 Pts', desc: "I need guidance or advice." },
                      { val: 2, label: '2 - Moderate', pts: '10 Pts', desc: "Overwhelmed, need support soon." },
                      { val: 3, label: '3 - High', pts: '15 Pts', desc: "Near my limit, struggling to cope." },
                      { val: 4, label: '4 - Extreme', pts: '20 Pts', desc: "At my breaking point right now." }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setClinicalAssessment({ ...clinicalAssessment, q5DistressLevel: opt.val as any })}
                        className={`p-3 text-left rounded-xl border transition-all ${
                          clinicalAssessment.q5DistressLevel === opt.val
                            ? 'bg-white text-[#1B4332] border-[#2D6A4F] ring-2 ring-[#2D6A4F]/20 shadow-xs'
                            : 'bg-white/80 hover:bg-white text-[#40564C] border-[#E3E8E3]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs mb-1">
                          <span>{opt.label}</span>
                          <span className="font-mono text-[11px] text-[#2D6A4F]">{opt.pts}</span>
                        </div>
                        <span className="text-[11px] text-[#658273] leading-snug">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* ACTION BUTTON */}
              <div className="pt-4 border-t border-[#F0F3EF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-semibold text-[#52685E] flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#2D6A4F] stroke-[2.2]" />
                  <span>
                    Deterministic Clinical Algorithm Active • Total Acuity: <strong>{liveScore.totalScore} Pts</strong> ({liveScore.queueTier})
                  </span>
                </div>

                <button
                  onClick={() => handleTriage()}
                  disabled={isProcessing || !inputText.trim()}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] hover:from-[#255942] hover:to-[#143224] text-white font-bold rounded-2xl shadow-[0_4px_16px_rgba(27,67,50,0.25)] hover:shadow-[0_6px_22px_rgba(27,67,50,0.35)] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Fusing Topic Triage &amp; Clinical Acuity...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Build My Coordinated Support Plan</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* ======================================================== */}
            {/* TRIAGE RESULT DISPLAY                                    */}
            {/* ======================================================== */}
            {triageResult && (
              <div className="space-y-8 animate-fadeIn">
                {triageResult.crisis_flag ? (
                  <div className="bg-[#FFF6F5] rounded-3xl border border-[#F5C7C3] shadow-[0_8px_30px_rgba(185,28,28,0.06)] p-6 sm:p-9 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FEE2E2] pb-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-13 h-13 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-7 h-7 text-[#B91C1C]" />
                        </div>
                        <div>
                          <div className="inline-block bg-[#B91C1C] text-white text-[11px] font-bold px-3 py-1 rounded-full mb-1">
                            Immediate Human Support Required
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#7F1D1D] tracking-tight">
                            We Are Here With You Right Now.
                          </h3>
                        </div>
                      </div>

                      <div className="bg-white border border-[#FCA5A5] px-3.5 py-2 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase text-[#B91C1C] block">Q1 Clinical Override</span>
                        <span className="text-xs font-mono font-bold text-[#7F1D1D]">100 Pts • Instant P1 Dispatch</span>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-[#7F1D1D] max-w-3xl leading-relaxed">
                      Your assessment indicates an immediate safety concern. Normal automated intake has been paused. Please connect with one of these 24/7 free, confidential emergency responders right now:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl border border-[#FCA5A5] p-5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#FEE2E2] pb-2">
                          <span className="text-xs font-bold text-[#B91C1C]">Campus Crisis Unit</span>
                          <PhoneCall className="w-4 h-4 text-[#B91C1C]" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-[#143224]">
                          (555) 911-HELP
                        </div>
                        <p className="text-xs font-medium text-[#52685E]">
                          24/7 on-campus mobile crisis and mental health stabilization unit.
                        </p>
                        <button
                          onClick={() => alert("Connecting you directly to Campus Crisis Emergency Dispatch: (555) 911-HELP")}
                          className="w-full py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Connect Now (24/7)
                        </button>
                      </div>

                      <div className="bg-white rounded-2xl border border-[#F2DEB0] p-5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#FDF7E7] pb-2">
                          <span className="text-xs font-bold text-[#7C5315]">Suicide &amp; Crisis Lifeline</span>
                          <HeartHandshake className="w-4 h-4 text-[#7C5315]" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-[#143224]">
                          Call or Text 988
                        </div>
                        <p className="text-xs font-medium text-[#52685E]">
                          National free, confidential 24/7 lifeline for anyone experiencing distress.
                        </p>
                        <button
                          onClick={() => alert("Dialing 988 Suicide & Crisis Lifeline.")}
                          className="w-full py-2.5 bg-[#1B4332] hover:bg-[#143224] text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Call / Text 988
                        </button>
                      </div>

                      <div className="bg-white rounded-2xl border border-[#CADCE9] p-5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#EBF2F7] pb-2">
                          <span className="text-xs font-bold text-[#2C4A63]">Campus Safety Escort</span>
                          <ShieldAlert className="w-4 h-4 text-[#2C4A63]" />
                        </div>
                        <div className="text-2xl font-mono font-bold text-[#143224]">
                          (555) 019-SAFE
                        </div>
                        <p className="text-xs font-medium text-[#52685E]">
                          24/7 student safety escorts and emergency officer response to any hall.
                        </p>
                        <button
                          onClick={() => alert("Dispatching request to Campus Safety & Escort Service.")}
                          className="w-full py-2.5 bg-[#2C4A63] hover:bg-[#1D3244] text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Request Officer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* SUPPORT NAVIGATOR HERO HEADER */}
                    <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-9 space-y-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0F3EF] pb-5">
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-xs font-bold text-[#2D6A4F] bg-[#E8F3EE] px-3 py-0.5 rounded-full border border-[#C5DEC8]">
                              Coordinated Care Result
                            </span>
                            <span className="text-xs font-bold text-[#7C9286]">•</span>
                            <span className="text-xs font-bold text-[#345C78]">
                              {triageResult.needs.length} {triageResult.needs.length === 1 ? 'Support Need Identified' : 'Concurrent Needs Identified'}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#143224] tracking-tight">
                            Your Personalized Campus Support Plan
                          </h3>
                        </div>

                        {/* Priority Badge */}
                        <div className="bg-[#FAF8F5] border border-[#E3E8E3] p-3.5 rounded-2xl text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9286] block">Assigned Queue Priority</span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full border inline-block mt-1 ${
                            triageResult.clinicalScore?.queueTier === 'P1'
                              ? 'bg-[#FDF0ED] text-[#9E2A2B] border-[#F5C7C3]'
                              : triageResult.clinicalScore?.queueTier === 'P2'
                              ? 'bg-[#FDF7E7] text-[#7C5315] border-[#F2DEB0]'
                              : 'bg-[#E8F3EE] text-[#1B4332] border-[#C3DEC0]'
                          }`}>
                            {triageResult.clinicalScore ? `${triageResult.clinicalScore.queueTier} (${triageResult.clinicalScore.totalScore} Pts)` : `${triageResult.overallUrgency} Urgency`}
                          </span>
                          <div className="text-[11px] font-medium text-[#52685E] mt-1">
                            {triageResult.clinicalScore?.tierLabel}
                          </div>
                        </div>
                      </div>

                      {/* Bridge to Care Companion Mode Banner */}
                      <div className="bg-gradient-to-r from-[#F0F4F8] via-[#EAF2F6] to-[#E5EFF4] rounded-2xl border border-[#CADCE9] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-white border border-[#CADCE9] flex items-center justify-center shrink-0 shadow-xs">
                            <Bot className="w-6 h-6 text-[#2C4A63]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#143224]">
                              Waiting in {triageResult.clinicalScore?.queueTier || 'P3'} Queue?
                            </div>
                            <div className="text-xs font-medium text-[#3E617E]">
                              Switch to Companion Mode to chat with our Care Companion, do 60s breathing grounding, or re-escalate if distress rises.
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('companion')}
                          className="px-5 py-2.5 bg-[#2C4A63] hover:bg-[#1D3244] text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                        >
                          Open Care Companion →
                        </button>
                      </div>
                    </div>

                    {/* MULTI-NEED DEPARTMENT CARDS */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-heading font-extrabold text-[#143224] flex items-center space-x-2">
                          <Bookmark className="w-5 h-5 text-[#2D6A4F]" />
                          <span>Detected Support Pathways ({triageResult.needs.length})</span>
                        </h4>
                        <span className="text-xs font-medium text-[#7C9286]">
                          Calibrated by Topic Intake + 5 Clinical Questions
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {triageResult.needs.map((need, idx) => {
                          const route = need.route;
                          return (
                            <div
                              key={need.category}
                              className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F3EF] pb-4">
                                <div className="flex items-center space-x-3.5">
                                  <div className="w-9 h-9 rounded-xl bg-[#E8F3EE] text-[#1B4332] font-bold text-sm flex items-center justify-center border border-[#C5DEC8]">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C9286]">
                                      {need.title}
                                    </div>
                                    <div className="text-xl font-heading font-extrabold text-[#143224]">
                                      {route.service}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-medium text-[#52685E]">Relevance:</span>
                                  <span className="bg-[#E8F3EE] text-[#1B4332] font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#C5DEC8]">
                                    {Math.round(need.confidence * 100)}%
                                  </span>
                                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                    need.urgency === 'high' ? 'bg-[#FDF0ED] text-[#9E2A2B] border-[#F5C7C3]' : need.urgency === 'medium' ? 'bg-[#FDF7E7] text-[#7C5315] border-[#F2DEB0]' : 'bg-[#EBF2F7] text-[#2C4A63] border-[#CADCE9]'
                                  }`}>
                                    {need.urgency} Urgency
                                  </span>
                                </div>
                              </div>

                              {/* WHY WE RECOMMEND THIS */}
                              <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#143224] flex items-center space-x-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                                    <span>Why We Recommend This</span>
                                  </span>
                                  <span className="text-[10px] font-semibold text-[#52685E] bg-white px-2 py-0.5 rounded-full border border-[#E3E8E3]">
                                    Support Recommendation • Non-Diagnostic
                                  </span>
                                </div>

                                <div className="text-xs font-semibold text-[#40564C]">
                                  Identified from your description &amp; clinical answers:
                                </div>
                                <ul className="space-y-1 pl-2">
                                  {need.extractedPoints.map((point, pIdx) => (
                                    <li key={pIdx} className="text-xs font-medium text-[#52685E] flex items-start space-x-2">
                                      <span className="text-[#2D6A4F] font-bold">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>

                                <p className="text-xs font-medium text-[#143224] border-t border-[#E3E8E3] pt-2 mt-2 leading-relaxed">
                                  {need.whyRecommended}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <div className="text-[11px] font-bold text-[#40564C]">Location &amp; Office Hours</div>
                                  <div className="bg-[#FAF8F5] rounded-xl border border-[#E3E8E3] p-3 text-xs space-y-1 text-[#52685E]">
                                    <div><strong>Building:</strong> {route.building} ({route.room})</div>
                                    <div><strong>Hours:</strong> {route.hours}</div>
                                    <div><strong>Direct:</strong> <span className="font-mono text-[#143224]">{route.phone}</span> • {route.email}</div>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="text-[11px] font-bold text-[#40564C]">Immediate Self-Service Care</div>
                                  <div className="bg-[#FAF8F5] rounded-xl border border-[#E3E8E3] p-3 text-xs space-y-1.5">
                                    {route.immediateResources.map((res, rIdx) => (
                                      <div key={rIdx} className="flex items-center justify-between text-[11px] font-medium text-[#143224]">
                                        <span className="truncate pr-2">📄 {res.title}</span>
                                        <span className="bg-white border border-[#E3E8E3] px-2 py-0.5 rounded-full text-[9px] font-bold text-[#52685E] shrink-0">
                                          {res.type}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <span className="text-xs font-medium text-[#658273]">
                                  Policy: {route.priorityNote || 'Priority intake available'}
                                </span>
                                <button
                                  onClick={() => openBookingFor(route.service)}
                                  className="py-2.5 px-4 bg-[#E8F3EE] hover:bg-[#D4E8DC] text-[#1B4332] font-bold text-xs rounded-xl border border-[#C5DEC8] transition shadow-xs flex items-center space-x-1.5"
                                >
                                  <Calendar className="w-4 h-4 text-[#2D6A4F]" />
                                  <span>{route.action}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* UNIFIED HANDOFF SLIP & FOLLOW-UP */}
                    <div className="bg-gradient-to-br from-[#E8F3EE] to-[#E0EFE8] rounded-3xl border border-[#C5DEC8] p-6 sm:p-9 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5DEC8] pb-5">
                        <div>
                          <span className="text-xs font-bold text-[#2D6A4F] bg-white px-3 py-1 rounded-full border border-[#C5DEC8] mb-1.5 inline-block">
                            ⭐ Pre-Triaged Cross-Department Handoff
                          </span>
                          <h3 className="text-2xl font-heading font-extrabold text-[#143224] tracking-tight">
                            Unified Support Handoff Slip
                          </h3>
                          <p className="text-xs font-medium text-[#52685E] mt-1">
                            Includes Topic summary + 5-Question Acuity score ({liveScore.totalScore} Pts • {liveScore.queueTier}).
                          </p>
                        </div>

                        <button
                          onClick={() => setHandoffModalOpen(true)}
                          className="px-6 py-3 bg-[#1B4332] hover:bg-[#143224] text-white font-bold text-xs rounded-2xl shadow-sm transition flex items-center space-x-2 shrink-0"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Review &amp; Transmit Handoff Slip</span>
                        </button>
                      </div>

                      <div className="bg-white rounded-2xl border border-[#C5DEC8] p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold text-[#143224]">
                              Would you like a scheduled follow-up check-in?
                            </div>
                            <p className="text-xs text-[#658273] mt-0.5">
                              We will privately check in to verify you connected with your advisors and are getting back on track.
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {(['Tomorrow', 'In 3 days', 'Next week', 'None'] as const).map((period) => (
                              <button
                                key={period}
                                onClick={() => setFollowUpPeriod(period)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
                                  followUpPeriod === period
                                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                                    : 'bg-[#FAF8F5] hover:bg-white text-[#52685E] border-[#E3E8E3]'
                                }`}
                              >
                                {period}
                              </button>
                            ))}
                            <button
                              onClick={handleScheduleFollowUp}
                              className="px-4 py-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-xs transition ml-2"
                            >
                              Save
                            </button>
                          </div>
                        </div>

                        {followUpConfirmed && (
                          <div className="bg-[#FAF8F5] border border-[#C5DEC8] p-3 rounded-xl text-xs font-semibold text-[#1B4332] flex items-center space-x-2 animate-fadeIn">
                            <Check className="w-4 h-4 text-[#2D6A4F]" />
                            <span>
                              Follow-up check-in confirmed for <strong>{followUpPeriod}</strong>. You will receive a discreet check-in notification.
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
        {/* TAB 2: REASSURANCE CHATBOT (COMPANION MODE)             */}
        {/* ======================================================== */}
        {activeTab === 'companion' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-9 space-y-7">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0F3EF] pb-5">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="text-xs font-bold text-[#345C78] bg-[#EBF2F7] px-3 py-0.5 rounded-full border border-[#CADCE9]">
                      Companion Mode Active
                    </span>
                    <span className="text-xs text-[#7C9286]">•</span>
                    <span className="text-xs font-mono font-medium text-[#7C9286]">Ticket #{queueTicketId}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#143224] tracking-tight">
                    The Temporary Reassurance Chatbot
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-[#52685E] mt-1 max-w-2xl leading-relaxed">
                    For students placed in waiting queues, waiting for an appointment can cause secondary anxiety. 
                    Your Care Companion Virtual Agent is active with validation, grounding tools, and dynamic re-triage.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2.5 shrink-0">
                  <div className="bg-[#FAF8F5] border border-[#E3E8E3] p-3.5 rounded-2xl text-right shadow-xs w-full sm:w-auto">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C9286]">Active Queue Status</div>
                    <div className="text-sm font-heading font-extrabold text-[#143224] mt-0.5">
                      {queueTier} Queue ({queueDays === 0 ? 'Today Priority' : `In ${queueDays} Days`})
                    </div>
                    <div className="text-[10px] text-[#658273]">Counselling &amp; Psychological Services</div>
                  </div>

                  <button
                    onClick={() => setEscalationModalOpen(true)}
                    className="w-full sm:w-auto py-2.5 px-4 bg-[#FDF0ED] hover:bg-[#FCE3DF] text-[#9E2A2B] font-bold text-xs rounded-xl border border-[#F5C7C3] transition shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#9E2A2B]" />
                    <span>"My Situation Has Worsened" (Escalate)</span>
                  </button>
                </div>
              </div>

              {/* DAILY WARM CHECK-IN */}
              <div className="bg-gradient-to-r from-[#FDF7E7] to-[#FCF4DF] rounded-2xl border border-[#F2DEB0] p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7C5315] flex items-center space-x-1.5">
                    <Mail className="w-4 h-4" />
                    <span>Daily Warm Check-in • Automated SMS &amp; App Push</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-white text-[#7C5315] px-2.5 py-0.5 rounded-full border border-[#F2DEB0]">
                    Scheduled Daily Check-In
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-[#F2DEB0] p-4 text-xs text-[#143224] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-[#8D7646] font-mono text-[10px] block mb-0.5">Incoming SMS from DHRONA Care:</span>
                    "Hi {studentName}, your intake session is in {queueDays} days. How are you feeling today? Tap here if you need a quick grounding exercise."
                  </div>

                  {!smsAnswered ? (
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setSmsAnswered(true);
                          setSmsResponseChoice("Hanging in there");
                          handleSendMessage("I'm hanging in there, just trying to focus on classes.");
                        }}
                        className="px-3 py-1 bg-[#E8F3EE] hover:bg-[#D4E8DC] text-[#1B4332] text-xs font-bold rounded-lg border border-[#C5DEC8] transition"
                      >
                        👍 Hanging in there
                      </button>
                      <button
                        onClick={() => {
                          setSmsAnswered(true);
                          setSmsResponseChoice("A bit overwhelmed");
                          handleSendMessage("A bit overwhelmed today with coursework and sleep.");
                        }}
                        className="px-3 py-1 bg-[#FDF7E7] hover:bg-[#F2DEB0] text-[#7C5315] text-xs font-bold rounded-lg border border-[#F2DEB0] transition"
                      >
                        😟 A bit overwhelmed
                      </button>
                      <button
                        onClick={() => {
                          setSmsAnswered(true);
                          setSmsResponseChoice("Need Grounding");
                          setActiveExercise('breathing');
                          handleSendMessage("I need a quick grounding exercise right now.");
                        }}
                        className="px-3 py-1 bg-[#EBF2F7] hover:bg-[#CADCE9] text-[#2C4A63] text-xs font-bold rounded-lg border border-[#CADCE9] transition"
                      >
                        🌬️ Need 60s Grounding
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-[#1B4332] bg-[#E8F3EE] px-3 py-1 rounded-full border border-[#C5DEC8]">
                      ✓ Responded: {smsResponseChoice}
                    </span>
                  )}
                </div>
              </div>

              {/* CHAT WINDOW & INTERACTIVE TOOLS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] flex flex-col h-[520px] overflow-hidden">
                  <div className="p-4 bg-white border-b border-[#E3E8E3] flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#E8F3EE] text-[#1B4332] flex items-center justify-center border border-[#C5DEC8]">
                        <Bot className="w-5 h-5 text-[#2D6A4F]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#143224]">Care Companion Agent</div>
                        <div className="text-[10px] font-medium text-[#2D6A4F] flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse"></span>
                          <span>Active Validation &amp; Reassurance</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-medium text-[#7C9286]">24/7 Active</span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1 text-[10px] text-[#7C9286] mb-1">
                          <span>{msg.sender === 'user' ? (isAnonymous ? 'You' : 'Alex') : 'Care Companion'}</span>
                          <span>•</span>
                          <span>{msg.time}</span>
                        </div>

                        <div
                          className={`max-w-[85%] p-3.5 text-xs font-medium leading-relaxed rounded-2xl border shadow-xs ${
                            msg.sender === 'user'
                              ? 'bg-[#1B4332] text-white border-[#1B4332]'
                              : 'bg-white text-[#143224] border-[#E3E8E3]'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-white border-t border-[#E3E8E3] flex flex-wrap gap-1.5">
                    <button
                      onClick={() => {
                        setActiveExercise('breathing');
                        handleSendMessage("Can we do the 60-second Box Breathing exercise?");
                      }}
                      className="px-3 py-1 bg-[#FAF8F5] hover:bg-[#E8F3EE] text-[#1B4332] text-xs font-semibold rounded-full border border-[#DCE4DD] transition"
                    >
                      🌬️ Box Breathing (60s)
                    </button>
                    <button
                      onClick={() => {
                        setActiveExercise('sensory');
                        handleSendMessage("I'd like to try 5-4-3-2-1 Sensory Grounding.");
                      }}
                      className="px-3 py-1 bg-[#FAF8F5] hover:bg-[#EBF2F7] text-[#2C4A63] text-xs font-semibold rounded-full border border-[#DCE4DD] transition"
                    >
                      👁️ 5-4-3-2-1 Grounding
                    </button>
                    <button
                      onClick={() => handleSendMessage("What should I bring to my appointment?")}
                      className="px-3 py-1 bg-[#FAF8F5] hover:bg-[#FDF7E7] text-[#7C5315] text-xs font-semibold rounded-full border border-[#DCE4DD] transition"
                    >
                      📋 What should I bring?
                    </button>
                  </div>

                  <div className="p-3 bg-white border-t border-[#E3E8E3] flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Talk with your Care Companion while waiting..."
                      className="flex-1 bg-[#FAF8F5] rounded-xl border border-[#DCE4DD] px-3.5 py-2 text-xs font-medium text-[#1A2E26] placeholder:text-[#8D9F95] focus:outline-none focus:border-[#2D6A4F]"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-4 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-[#E3E8E3] pb-2.5">
                      <span className="text-xs font-bold text-[#143224] flex items-center space-x-1.5">
                        <Activity className="w-4 h-4 text-[#2D6A4F]" />
                        <span>Interactive 60s Micro-Coping</span>
                      </span>
                      <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#E8F3EE] px-2.5 py-0.5 rounded-full border border-[#C5DEC8]">
                        Instant Somatic Relief
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setActiveExercise('breathing')}
                        className={`p-2 text-xs font-bold rounded-xl transition ${
                          activeExercise === 'breathing' || activeExercise === null
                            ? 'bg-white text-[#1B4332] border border-[#2D6A4F] shadow-xs'
                            : 'bg-white/60 hover:bg-white text-[#658273]'
                        }`}
                      >
                        Box Breathing
                      </button>
                      <button
                        onClick={() => setActiveExercise('sensory')}
                        className={`p-2 text-xs font-bold rounded-xl transition ${
                          activeExercise === 'sensory'
                            ? 'bg-white text-[#2C4A63] border border-[#507693] shadow-xs'
                            : 'bg-white/60 hover:bg-white text-[#658273]'
                        }`}
                      >
                        5-4-3-2-1 Sensory
                      </button>
                      <button
                        onClick={() => setActiveExercise('muscle')}
                        className={`p-2 text-xs font-bold rounded-xl transition ${
                          activeExercise === 'muscle'
                            ? 'bg-white text-[#7C5315] border border-[#D99B26] shadow-xs'
                            : 'bg-white/60 hover:bg-white text-[#658273]'
                        }`}
                      >
                        Muscle Release
                      </button>
                    </div>

                    {(activeExercise === 'breathing' || activeExercise === null) && (
                      <div className="bg-white rounded-2xl border border-[#C5DEC8] p-5 space-y-4 text-center">
                        <div className="text-xs font-bold text-[#143224]">
                          Box Breathing Protocol (4-4-4-4)
                        </div>

                        {/* Circular Organic Visual Breath Coach */}
                        <div className="py-3 flex flex-col items-center justify-center">
                          <div
                            className={`w-32 h-32 rounded-full border-2 border-[#2D6A4F]/40 bg-gradient-to-br from-[#E8F3EE] to-[#D4E8DC] flex flex-col items-center justify-center shadow-lg transition-transform duration-1000 ${
                              isBreathingActive && breathingPhase === 'Inhale'
                                ? 'scale-115 shadow-[0_0_35px_rgba(45,106,79,0.3)]'
                                : isBreathingActive && breathingPhase === 'Exhale'
                                ? 'scale-90 shadow-sm'
                                : 'scale-100'
                            }`}
                          >
                            <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                              {breathingPhase}
                            </span>
                            <span className="text-3xl font-heading font-extrabold text-[#143224] mt-1 font-mono">
                              {breathingTimer}s
                            </span>
                          </div>
                        </div>

                        <div className="text-xs font-medium text-[#40564C]">
                          {breathingPhase === 'Inhale' && "Inhale gently through your nose, expanding your belly..."}
                          {breathingPhase === 'Hold' && "Hold your breath softly without straining..."}
                          {breathingPhase === 'Exhale' && "Release through your mouth smoothly and slowly..."}
                          {breathingPhase === 'Rest' && "Rest comfortably before the next cycle..."}
                        </div>

                        <div className="flex items-center justify-center space-x-2 pt-1">
                          <button
                            onClick={() => setIsBreathingActive(!isBreathingActive)}
                            className="px-5 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
                          >
                            {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{isBreathingActive ? 'Pause Exercise' : 'Start 60s Session'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsBreathingActive(false);
                              setBreathingPhase('Inhale');
                              setBreathingTimer(4);
                              setBreathCycles(0);
                            }}
                            className="p-2.5 bg-white hover:bg-[#F2F7F4] text-[#40564C] border border-[#E3E8E3] rounded-xl transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] font-medium text-[#7C9286]">
                          Cycles: {breathCycles} • Calms heart rate and activates the parasympathetic vagal nerve.
                        </div>
                      </div>
                    )}

                    {activeExercise === 'sensory' && (
                      <div className="bg-white rounded-2xl border border-[#CADCE9] p-4 space-y-3">
                        <div className="text-xs font-bold text-[#143224] flex items-center justify-between">
                          <span>5-4-3-2-1 Sensory Grounding</span>
                          <span className="text-[10px] text-[#2C4A63]">Check off gently</span>
                        </div>

                        <div className="space-y-2">
                          {sensorySteps.map((step, sIdx) => (
                            <button
                              key={step.id}
                              onClick={() => {
                                const updated = [...sensorySteps];
                                updated[sIdx].done = !updated[sIdx].done;
                                setSensorySteps(updated);
                              }}
                              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition flex items-start space-x-2.5 ${
                                step.done 
                                  ? 'bg-[#E8F3EE] border-[#C5DEC8] text-[#1B4332] line-through' 
                                  : 'bg-[#FAF8F5] border-[#E3E8E3] text-[#143224] hover:bg-white'
                              }`}
                            >
                              <span className="font-mono font-bold text-[#2D6A4F]">{step.id}</span>
                              <div className="min-w-0">
                                <div>{step.label}</div>
                                <div className="text-[11px] text-[#7C9286] font-normal">{step.prompt}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setSensorySteps(sensorySteps.map((s) => ({ ...s, done: false })));
                          }}
                          className="w-full py-1.5 bg-[#FAF8F5] hover:bg-white text-[#52685E] text-xs font-semibold rounded-xl border border-[#E3E8E3] transition"
                        >
                          Reset Checklist
                        </button>
                      </div>
                    )}

                    {activeExercise === 'muscle' && (
                      <div className="bg-white rounded-2xl border border-[#F2DEB0] p-4 space-y-3">
                        <div className="text-xs font-bold text-[#143224]">
                          Guided Muscle Release (PMR)
                        </div>

                        <div className="space-y-2.5 text-xs text-[#143224]">
                          <div className="bg-[#FAF8F5] border border-[#E3E8E3] p-3 rounded-xl space-y-1">
                            <div className="font-bold text-[11px] text-[#2D6A4F]">1. Shoulders &amp; Neck</div>
                            <p className="text-[11px] text-[#52685E]">
                              Gently pull shoulders up toward your ears for 5 seconds. Now release completely. Feel the drop.
                            </p>
                          </div>

                          <div className="bg-[#FAF8F5] border border-[#E3E8E3] p-3 rounded-xl space-y-1">
                            <div className="font-bold text-[11px] text-[#2D6A4F]">2. Jaw &amp; Forehead</div>
                            <p className="text-[11px] text-[#52685E]">
                              Unclench your teeth. Let your tongue rest gently behind your bottom teeth. Smooth out your forehead.
                            </p>
                          </div>

                          <div className="bg-[#FAF8F5] border border-[#E3E8E3] p-3 rounded-xl space-y-1">
                            <div className="font-bold text-[11px] text-[#2D6A4F]">3. Hands &amp; Abdomen</div>
                            <p className="text-[11px] text-[#52685E]">
                              Unclench your hands, spread your fingers wide, and allow your stomach to soften on the exhale.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: THE 12 CAMPUS DEPARTMENTS DIRECTORY                */}
        {/* ======================================================== */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-9 space-y-6">
              <div className="max-w-3xl">
                <span className="text-xs font-bold text-[#B91C1C] bg-[#FDF0ED] px-3 py-1 rounded-full border border-[#F5C7C3] inline-block mb-2">
                  The Problem Statement
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#143224] tracking-tight">
                  The 12-Department Campus Maze
                </h2>
                <p className="text-sm font-medium text-[#52685E] mt-2 leading-relaxed">
                  Traditional universities operate 12+ separate administrative silos. Stressed students are forced to figure out which of these buildings to visit, resulting in an average 3-week intake queue and over 40% misdirected referrals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_12_DEPARTMENTS.map((dept, i) => (
                  <div
                    key={i}
                    className="bg-[#FAF8F5] hover:bg-white rounded-2xl border border-[#E3E8E3] hover:border-[#2D6A4F] p-4 space-y-2 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-[#E3E8E3] pb-2">
                      <span className="text-[10px] font-bold uppercase text-[#7C9286]">
                        Silo {i + 1} of 12
                      </span>
                      <span className="text-[10px] font-bold bg-white text-[#1B4332] px-2 py-0.5 rounded-full border border-[#E3E8E3]">
                        Wait: {dept.wait}
                      </span>
                    </div>
                    <div className="text-base font-heading font-bold text-[#143224] leading-snug">
                      {dept.name}
                    </div>
                    <div className="text-xs font-medium text-[#52685E] flex items-center justify-between pt-1">
                      <span>Domain: {dept.category}</span>
                      <span className="text-[10px] font-semibold text-[#7C5315] bg-[#FDF7E7] px-2 py-0.5 rounded-full border border-[#F2DEB0]">
                        Friction: {dept.referrals}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#E8F3EE] to-[#E0EFE8] rounded-2xl border border-[#C5DEC8] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-heading font-extrabold text-[#143224]">
                    How Dhrona Solves This in Seconds
                  </h4>
                  <p className="text-xs font-medium text-[#52685E] mt-1 max-w-2xl leading-relaxed">
                    Instead of navigating 12 separate websites and waiting weeks, the student enters one conversation. Dhrona performs multi-need triage and coordinates a single unified handoff.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('triage')}
                  className="px-6 py-3 bg-[#1B4332] hover:bg-[#143224] text-white text-xs font-bold rounded-2xl shadow-xs shrink-0 transition"
                >
                  Test Student Intake →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ADMIN DEMAND DASHBOARD                            */}
        {/* ======================================================== */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-9 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F3EF] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#2D6A4F] bg-[#E8F3EE] px-3 py-1 rounded-full border border-[#C5DEC8] inline-block mb-1.5">
                    Operational Intelligence
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#143224] tracking-tight">
                    Campus Support Triage Operations
                  </h2>
                  <p className="text-xs font-medium text-[#52685E]">
                    Aggregated university-level demand analytics. Demonstrates resource optimization &amp; queue elimination.
                  </p>
                </div>

                <div className="text-xs font-medium text-[#7C9286] font-mono">
                  Live Campus Aggregation (Demo Data)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-[#7C9286]">Total Student Inquiries</span>
                  <div className="text-3xl font-heading font-extrabold text-[#143224] mt-1">128</div>
                  <div className="text-[10px] font-medium text-[#658273] mt-1">Past 7 days</div>
                </div>

                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-[#7C9286]">Multi-Need Inquiries</span>
                  <div className="text-3xl font-heading font-extrabold text-[#143224] mt-1">44%</div>
                  <div className="text-[10px] font-medium text-[#658273] mt-1">Cross-department cases</div>
                </div>

                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-[#7C9286]">Avg. Time to Handoff</span>
                  <div className="text-3xl font-heading font-extrabold text-[#2D6A4F] mt-1">1.8m</div>
                  <div className="text-[10px] font-medium text-[#658273] mt-1">Reduced from 21 days</div>
                </div>

                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-[#7C9286]">Referral Bounce Rate</span>
                  <div className="text-3xl font-heading font-extrabold text-[#2D6A4F] mt-1">&lt; 3%</div>
                  <div className="text-[10px] font-medium text-[#658273] mt-1">Reduced from +40%</div>
                </div>
              </div>

              <div className="space-y-4 pt-3">
                <h4 className="text-sm font-bold text-[#143224]">
                  Department Influx &amp; Demand Breakdown
                </h4>
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-[#143224]">
                      <span>🧠 Mental Wellbeing (Counselling)</span>
                      <span>42 requests (33%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#EBF2F7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#507693] rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-[#143224]">
                      <span>📚 Academic Success &amp; Advising</span>
                      <span>48 requests (38%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#E8F3EE] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2D6A4F] rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-[#143224]">
                      <span>💰 Financial Aid &amp; Emergency Grants</span>
                      <span>24 requests (19%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#FDF7E7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#D99B26] rounded-full" style={{ width: '19%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-[#143224]">
                      <span>🏠 Housing &amp; Residence Life</span>
                      <span>14 requests (10%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E3E8E3]">
                      <div className="h-full bg-[#7C5315] rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ARCHITECTURE & PITCH DECK                         */}
        {/* ======================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-9 space-y-5">
              <span className="text-xs font-bold text-[#2D6A4F] bg-[#E8F3EE] px-3 py-1 rounded-full border border-[#C5DEC8] inline-block">
                The Pitch Strategy
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#143224] tracking-tight">
                "Students shouldn't need to understand the university's organizational structure before they can get help."
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-5 space-y-1 shadow-xs">
                  <div className="text-[10px] font-bold uppercase text-[#7C9286]">1. Natural Language</div>
                  <div className="text-sm font-bold text-[#143224]">Understand</div>
                  <p className="text-xs text-[#52685E]">Captures complex multi-issue stress without requiring bureaucratic jargon.</p>
                </div>

                <div className="bg-[#FDF0ED] rounded-2xl border border-[#F5C7C3] p-5 space-y-1 shadow-xs">
                  <div className="text-[10px] font-bold uppercase text-[#9E2A2B]">2. 5-Question Clinical Score</div>
                  <div className="text-sm font-bold text-[#7F1D1D]">Acuity Engine</div>
                  <p className="text-xs text-[#7F1D1D]">Objective point system calibrating P1 to P4 queues.</p>
                </div>

                <div className="bg-[#EBF2F7] rounded-2xl border border-[#CADCE9] p-5 space-y-1 shadow-xs">
                  <div className="text-[10px] font-bold uppercase text-[#345C78]">3. Companion Bot</div>
                  <div className="text-sm font-bold text-[#143224]">Waiting Support</div>
                  <p className="text-xs text-[#52685E]">Active validation, 60s micro-coping, and dynamic queue re-triage.</p>
                </div>

                <div className="bg-[#E8F3EE] rounded-2xl border border-[#C5DEC8] p-5 space-y-1 shadow-xs">
                  <div className="text-[10px] font-bold uppercase text-[#2D6A4F]">4. Coordinated Action</div>
                  <div className="text-sm font-bold text-[#143224]">One Handoff</div>
                  <p className="text-xs text-[#52685E]">Produces an approved handoff slip with scheduled follow-up.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: HANDOFF SLIP MODAL                              */}
      {/* ======================================================== */}
      {handoffModalOpen && triageResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-2xl p-6 sm:p-8 max-w-xl w-full space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F3EF] pb-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#E8F3EE] text-[#1B4332] px-2.5 py-0.5 rounded-full border border-[#C5DEC8]">
                  Official Handoff Document
                </span>
                <h3 className="text-xl font-heading font-extrabold text-[#143224] mt-1">
                  Cross-Department Support Handoff
                </h3>
              </div>
              <button
                onClick={() => setHandoffModalOpen(false)}
                className="bg-[#FAF8F5] hover:bg-[#F2F7F4] p-1.5 rounded-xl border border-[#E3E8E3] transition"
              >
                <X className="w-5 h-5 text-[#52685E]" />
              </button>
            </div>

            {handoffGenerated ? (
              <div className="space-y-4 bg-[#F2F7F4] rounded-2xl border border-[#C5DEC8] p-5">
                <div className="flex items-center space-x-2 text-[#1B4332]">
                  <CheckCircle2 className="w-6 h-6 text-[#2D6A4F]" />
                  <span className="text-sm font-bold">Handoff Successfully Dispatched!</span>
                </div>

                <div className="bg-white rounded-xl border border-[#C5DEC8] p-3.5 font-mono text-xs space-y-1 text-[#143224]">
                  <div><strong>Reference ID:</strong> DH-{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div><strong>Student Identity:</strong> {isAnonymous ? 'Anonymous Student (Privacy Mode)' : studentId}</div>
                  <div><strong>Target Offices:</strong> {triageResult.needs.map(n => n.route.service).join(' • ')}</div>
                  <div><strong>Clinical Acuity:</strong> {liveScore.totalScore} Pts ({liveScore.queueTier})</div>
                  <div><strong>Queue Priority:</strong> {liveScore.tierLabel}</div>
                </div>

                <p className="text-xs text-[#52685E]">
                  Duty advisors have received your structured summary. You will not need to repeat your vulnerable story when meeting with them.
                </p>

                <button
                  onClick={() => setHandoffModalOpen(false)}
                  className="w-full py-3 bg-[#1B4332] hover:bg-[#143224] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Close &amp; Return to Care Plan
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E3E8E3] p-4 space-y-3">
                  <div className="text-[10px] font-bold text-[#7C9286] border-b border-[#E3E8E3] pb-1.5 flex justify-between">
                    <span>Generated Intake Summary</span>
                    <span>Student: {isAnonymous ? 'Anonymous' : studentId}</span>
                  </div>

                  <div className="text-xs font-medium text-[#143224] leading-relaxed">
                    "{triageResult.studentSummary}"
                  </div>

                  <div className="text-xs space-y-1 pt-1">
                    <span className="font-bold text-[#40564C] block">Coordinated Support Offices:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {triageResult.needs.map(n => (
                        <span key={n.category} className="bg-white text-[#143224] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#E3E8E3]">
                          {n.route.service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FDF7E7] rounded-2xl border border-[#F2DEB0] p-4 space-y-2.5">
                  <div className="text-xs font-bold text-[#7C5315] flex items-center space-x-1.5">
                    <Lock className="w-4 h-4 text-[#7C5315]" />
                    <span>Student Privacy &amp; Consent Confirmation</span>
                  </div>

                  <label className="flex items-center space-x-2 text-xs font-medium text-[#143224] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentSummary}
                      onChange={(e) => setConsentSummary(e.target.checked)}
                      className="w-4 h-4 accent-[#2D6A4F]"
                    />
                    <span>Share structured summary &amp; clinical acuity score ({liveScore.totalScore} Pts)</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-medium text-[#143224] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentUrgency}
                      onChange={(e) => setConsentUrgency(e.target.checked)}
                      className="w-4 h-4 accent-[#2D6A4F]"
                    />
                    <span>Share queue tier assignment ({liveScore.queueTier})</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-medium text-[#143224] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentDoNotShareTranscript}
                      onChange={(e) => setConsentDoNotShareTranscript(e.target.checked)}
                      className="w-4 h-4 accent-[#2D6A4F]"
                    />
                    <span>DO NOT share raw conversational transcript or extraneous data</span>
                  </label>
                </div>

                <button
                  onClick={handleCreateHandoff}
                  disabled={!consentSummary}
                  className="w-full py-3.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-2xl shadow-xs transition disabled:opacity-50"
                >
                  Approve Consent &amp; Transmit Handoff
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0F3EF] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#E8F3EE] text-[#1B4332] px-2.5 py-0.5 rounded-full border border-[#C5DEC8]">
                  Priority Intake Slot
                </span>
                <h3 className="text-xl font-heading font-extrabold text-[#143224] mt-1">Book Fast-Track Slot</h3>
                <p className="text-xs text-[#52685E]">{bookingTargetService}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="bg-[#FAF8F5] hover:bg-[#F2F7F4] p-1.5 rounded-xl border border-[#E3E8E3] transition"
              >
                <X className="w-5 h-5 text-[#52685E]" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-6 text-center space-y-3 bg-[#E8F3EE] rounded-2xl border border-[#C5DEC8] p-4">
                <div className="w-12 h-12 bg-white rounded-full border border-[#C5DEC8] flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 text-[#2D6A4F]" />
                </div>
                <h4 className="text-lg font-heading font-extrabold text-[#143224]">Slot Confirmed!</h4>
                <p className="text-xs text-[#52685E] max-w-sm mx-auto">
                  Your priority intake slot with <strong>{bookingTargetService}</strong> is confirmed. A calendar invite was attached to your handoff record.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#143224] mb-1.5">
                    Select Available Window
                  </label>
                  <select
                    className="w-full text-xs font-medium bg-[#FAF8F5] rounded-xl border border-[#DCE4DD] p-3 text-[#143224] focus:outline-none focus:border-[#2D6A4F]"
                  >
                    <option>Tomorrow, 10:00 AM (Priority Intake)</option>
                    <option>Tomorrow, 2:00 PM (Priority Intake)</option>
                    <option>In 2 Days, 11:30 AM</option>
                  </select>
                </div>

                <div className="bg-[#FAF8F5] rounded-xl border border-[#E3E8E3] p-3.5 text-xs text-[#52685E] space-y-1">
                  <div className="font-bold text-[#143224]">Check-in Protocol:</div>
                  <div>Handoff slip will be pre-loaded at the front desk.</div>
                  <div>Zero duplicate paperwork required.</div>
                </div>

                <button
                  onClick={() => setBookingConfirmed(true)}
                  className="w-full py-3.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Confirm Priority Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DYNAMIC RE-TRIAGE ("MY SITUATION HAS WORSENED") */}
      {/* ======================================================== */}
      {escalationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E3E8E3] shadow-2xl p-6 sm:p-8 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0F3EF] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#FDF0ED] text-[#9E2A2B] px-2.5 py-0.5 rounded-full border border-[#F5C7C3]">
                  Dynamic Re-Triage Protocol
                </span>
                <h3 className="text-xl font-heading font-extrabold text-[#143224] mt-1">
                  "My Situation Has Worsened"
                </h3>
                <p className="text-xs text-[#52685E]">Recalculate queue tier &amp; priority assignment</p>
              </div>
              <button
                onClick={() => setEscalationModalOpen(false)}
                className="bg-[#FAF8F5] hover:bg-[#F2F7F4] p-1.5 rounded-xl border border-[#E3E8E3] transition"
              >
                <X className="w-5 h-5 text-[#52685E]" />
              </button>
            </div>

            {escalationSuccess ? (
              <div className="py-6 text-center space-y-3 bg-[#E8F3EE] rounded-2xl border border-[#C5DEC8] p-4">
                <div className="w-12 h-12 bg-white rounded-full border border-[#C5DEC8] flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 text-[#2D6A4F]" />
                </div>
                <h4 className="text-lg font-heading font-extrabold text-[#143224]">Queue Upgraded to P1 Priority!</h4>
                <p className="text-xs text-[#52685E] max-w-sm mx-auto">
                  Your ticket was elevated to <strong>P1 Priority (Same-Day On-Call Slot)</strong>. An advisor has been notified immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#52685E]">
                  Please answer these 5 quick check-in questions to recalibrate your triage score:
                </p>

                <div className="space-y-2.5">
                  <div className="bg-[#FAF8F5] rounded-xl border border-[#E3E8E3] p-3 space-y-1">
                    <label className="text-xs font-bold text-[#143224] block">
                      1. Current Distress Level (1 = Manageable, 10 = Acute Crisis): {escalationAnswers.distressScore}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={escalationAnswers.distressScore}
                      onChange={(e) => setEscalationAnswers({ ...escalationAnswers, distressScore: Number(e.target.value) })}
                      className="w-full accent-[#2D6A4F] cursor-pointer"
                    />
                  </div>

                  <label className="flex items-center space-x-2 text-xs font-medium text-[#143224] bg-[#FAF8F5] rounded-xl border border-[#E3E8E3] p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={escalationAnswers.sleepDeprived}
                      onChange={(e) => setEscalationAnswers({ ...escalationAnswers, sleepDeprived: e.target.checked })}
                      className="w-4 h-4 accent-[#2D6A4F]"
                    />
                    <span>2. Severe sleep loss (&gt; 48 hours without restful sleep)</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-medium text-[#143224] bg-[#FAF8F5] rounded-xl border border-[#E3E8E3] p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={escalationAnswers.panicAttacks}
                      onChange={(e) => setEscalationAnswers({ ...escalationAnswers, panicAttacks: e.target.checked })}
                      className="w-4 h-4 accent-[#2D6A4F]"
                    />
                    <span>3. Experiencing acute physical panic symptoms / shaking / chest tightness</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-medium text-[#143224] bg-[#FAF8F5] rounded-xl border border-[#E3E8E3] p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={escalationAnswers.academicParalysis}
                      onChange={(e) => setEscalationAnswers({ ...escalationAnswers, academicParalysis: e.target.checked })}
                      className="w-4 h-4 accent-[#2D6A4F]"
                    />
                    <span>4. Unable to attend classes or complete essential daily activities</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-medium text-[#9E2A2B] bg-[#FDF0ED] rounded-xl border border-[#F5C7C3] p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={escalationAnswers.selfHarmThoughts}
                      onChange={(e) => setEscalationAnswers({ ...escalationAnswers, selfHarmThoughts: e.target.checked })}
                      className="w-4 h-4 accent-[#B91C1C]"
                    />
                    <span>5. Experiencing thoughts of self-harm or immediate crisis (Triggers 24/7 Hotline)</span>
                  </label>
                </div>

                <button
                  onClick={handleEscalationSubmit}
                  className="w-full py-3.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Recalculate Triage &amp; Elevate Queue Position
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REFINED FOOTER                                           */}
      {/* ======================================================== */}
      <footer className="border-t border-[#E3E8E3] py-6 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-heading font-extrabold text-sm text-[#143224]">
              DHRONA / STUDENT SUPPORT &amp; CARE NAVIGATOR
            </span>
            <span className="text-xs font-medium text-[#658273] block">
              Track 01: Multi-Need Triage, Clinical Acuity Scoring &amp; Care Companion Chatbot
            </span>
          </div>

          <div className="text-xs text-[#7C9286]">
            Intake &amp; Clinical Navigation Assistant • Designed with soothing mental health principles
          </div>
        </div>
      </footer>
    </div>
  );
}
