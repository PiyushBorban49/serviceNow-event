/**
 * DHRONA Student Support Triage & Routing Engine
 */

export interface TriageResult {
  category: 'mental_wellbeing' | 'academic' | 'financial' | 'housing' | 'disability' | 'harassment' | 'general';
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
  reason: string;
  recommended_action: string;
  crisis_flag: boolean;
  timestamp: string;
}

export interface UniversityRoute {
  id: string;
  category: string;
  service: string;
  department: string;
  building: string;
  room: string;
  action: string;
  phone: string;
  email: string;
  hours: string;
  priorityNote?: string;
  description: string;
}

export const CRISIS_TERMS = [
  "kill myself",
  "hurt myself",
  "suicide",
  "end my life",
  "don't want to live",
  "dont want to live",
  "self harm",
  "self-harm",
  "end it all",
  "want to die",
  "overdose",
  "slit my wrists",
  "take my own life",
  "hanging myself",
  "jump off"
];

export function detectCrisis(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return CRISIS_TERMS.some(term => lower.includes(term));
}

export const ROUTES: Record<string, UniversityRoute> = {
  mental_wellbeing: {
    id: "route_counselling",
    category: "mental_wellbeing",
    service: "Counselling Services",
    department: "Student Wellness & Psychological Services",
    building: "Student Wellness Center",
    room: "Building B, Suite 204",
    action: "Book Counselling Appointment",
    phone: "(555) 019-4821",
    email: "counselling@dhrona.edu",
    hours: "Mon-Fri 8:30 AM - 5:00 PM (Drop-ins 1-3 PM)",
    priorityNote: "Same-day priority triage slot reserved for elevated stress or acute anxiety.",
    description: "Licensed psychologists and therapists providing individual counseling, crisis intervention, group therapy, and stress management."
  },
  academic: {
    id: "route_academic",
    category: "academic",
    service: "Academic Support",
    department: "Academic Success Center",
    building: "Main Campus Library",
    room: "3rd Floor East Wing",
    action: "Talk to Academic Advisor",
    phone: "(555) 019-4822",
    email: "academicsuccess@dhrona.edu",
    hours: "Mon-Fri 9:00 AM - 6:00 PM",
    priorityNote: "Workload balancing, exam deferral consultation, and subject-specific peer tutoring.",
    description: "Holistic academic counseling, workload strategies, degree audit clarification, and professor communication coaching."
  },
  financial: {
    id: "route_financial",
    category: "financial",
    service: "Financial Aid Office",
    department: "Student Financial Services & Scholarships",
    building: "Student Services Hub",
    room: "Hall A, Room 112",
    action: "Contact Financial Advisor",
    phone: "(555) 019-4823",
    email: "finaid@dhrona.edu",
    hours: "Mon-Fri 9:00 AM - 4:30 PM",
    priorityNote: "Emergency student micro-grants (up to $1,000) and tuition installment deferral.",
    description: "FAFSA/scholarship advisement, emergency living expense assistance, on-campus employment navigation, and emergency loans."
  },
  housing: {
    id: "route_housing",
    category: "housing",
    service: "Student Housing Office",
    department: "Residence Life & Housing Operations",
    building: "Campus Housing Pavilion",
    room: "Room 101",
    action: "Contact Housing Advisor",
    phone: "(555) 019-4824",
    email: "housing@dhrona.edu",
    hours: "Mon-Fri 8:00 AM - 5:00 PM",
    priorityNote: "Emergency room reassignments and mediator-assisted roommate resolution.",
    description: "Dorm assignment, tenant advocacy, off-campus lease reviews, safety inspections, and roommate mediation."
  },
  disability: {
    id: "route_disability",
    category: "disability",
    service: "Accessibility Services",
    department: "Disability Resource Center (DRC)",
    building: "Accessibility Center",
    room: "Suite 110",
    action: "Request Accessibility Support",
    phone: "(555) 019-4825",
    email: "access@dhrona.edu",
    hours: "Mon-Fri 9:00 AM - 5:00 PM",
    priorityNote: "Expedited temporary classroom and exam accommodation letters.",
    description: "Accommodations for physical disabilities, neurodiversity/ADHD, chronic illnesses, and mobility transit."
  },
  harassment: {
    id: "route_harassment",
    category: "harassment",
    service: "Student Safety & Title IX Office",
    department: "Campus Advocacy & Title IX Compliance",
    building: "Campus Safety & Advocacy Building",
    room: "Suite 300",
    action: "Speak with Confidential Advocate",
    phone: "(555) 019-4899",
    email: "safety@dhrona.edu",
    hours: "24/7 Confidential Line Available",
    priorityNote: "Confidential options counseling, safety escorts, and immediate protective measures.",
    description: "Support for victims of harassment, stalking, discrimination, or interpersonal violence with strict privacy."
  },
  general: {
    id: "route_general",
    category: "general",
    service: "Student Support Desk",
    department: "One-Stop Student Services",
    building: "Student Services Central Atrium",
    room: "Information Counter 1",
    action: "Talk to Student Support",
    phone: "(555) 019-4800",
    email: "support@dhrona.edu",
    hours: "Mon-Sat 8:00 AM - 8:00 PM",
    priorityNote: "First point of contact for cross-campus administrative questions.",
    description: "General campus navigation, ID cards, registration holds, and multi-department referrals."
  }
};

/** All 12 campus departments for the directory & contrast display */
export const ALL_12_DEPARTMENTS = [
  { name: "Counselling & Psychological Services", category: "Mental Wellbeing", wait: "18 days", referrals: "High", icon: "Brain" },
  { name: "Academic Advising & Success Center", category: "Academic", wait: "14 days", referrals: "Medium", icon: "BookOpen" },
  { name: "Student Financial Aid & Scholarships", category: "Financial", wait: "21 days", referrals: "High", icon: "Coins" },
  { name: "Residence Life & Housing Office", category: "Housing", wait: "12 days", referrals: "High", icon: "Home" },
  { name: "Disability Resource Center (DRC)", category: "Accessibility", wait: "16 days", referrals: "Medium", icon: "Shield" },
  { name: "Title IX & Student Safety Advocacy", category: "Safety", wait: "Immediate", referrals: "Critical", icon: "AlertTriangle" },
  { name: "One-Stop Student Support Desk", category: "General", wait: "3 days", referrals: "High", icon: "Compass" },
  { name: "International Student Services (ISSO)", category: "Visa & Cultural", wait: "15 days", referrals: "Medium", icon: "Globe" },
  { name: "University Career & Internship Center", category: "Career", wait: "10 days", referrals: "Low", icon: "Briefcase" },
  { name: "Student Health & Immunization Clinic", category: "Medical", wait: "7 days", referrals: "Medium", icon: "HeartPulse" },
  { name: "Veteran & Military Affairs Office", category: "Specialized", wait: "5 days", referrals: "Low", icon: "Award" },
  { name: "Office of the Dean of Students", category: "Advocacy & Appeals", wait: "14 days", referrals: "High", icon: "Users" }
];

export function getRoute(category: string): UniversityRoute {
  const norm = (category || "").toLowerCase().trim();
  return ROUTES[norm] || ROUTES.general;
}

/**
 * Heuristic classifier matching the structured Groq JSON schema
 */
export function classifyMessage(message: string): TriageResult {
  const text = message.toLowerCase();

  // Layer 1: Safety keyword check
  if (detectCrisis(message)) {
    return {
      category: 'mental_wellbeing',
      urgency: 'high',
      confidence: 0.99,
      reason: "Direct safety/crisis keywords detected. Prompt emergency support and campus safety intervention activated.",
      recommended_action: "Connect immediately to 24/7 Campus Crisis Care",
      crisis_flag: true,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  // Layer 2: Domain-specific triage heuristics
  if (
    text.includes("exam") ||
    text.includes("class") ||
    text.includes("grade") ||
    text.includes("fail") ||
    text.includes("study") ||
    text.includes("workload") ||
    text.includes("professor") ||
    text.includes("course") ||
    text.includes("gpa") ||
    text.includes("homework") ||
    text.includes("deadline") ||
    text.includes("academic")
  ) {
    const isMedium = text.includes("fail") || text.includes("falling behind") || text.includes("overwhelm") || text.includes("deadline");
    return {
      category: 'academic',
      urgency: isMedium ? 'medium' : 'low',
      confidence: 0.92,
      reason: "Student reports difficulty managing academic workload, understanding course expectations, or staying on track with studies.",
      recommended_action: "Talk to Academic Advisor at Academic Success Center",
      crisis_flag: false,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (
    text.includes("sleep") ||
    text.includes("stress") ||
    text.includes("anxious") ||
    text.includes("anxiety") ||
    text.includes("depress") ||
    text.includes("mental") ||
    text.includes("panic") ||
    text.includes("crying") ||
    text.includes("burnout") ||
    text.includes("exhausted") ||
    text.includes("lonely")
  ) {
    return {
      category: 'mental_wellbeing',
      urgency: 'medium',
      confidence: 0.94,
      reason: "Student reports symptoms of prolonged emotional distress, elevated anxiety, and sleep disruption.",
      recommended_action: "Book priority counselling appointment at Student Wellness Center",
      crisis_flag: false,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (
    text.includes("rent") ||
    text.includes("money") ||
    text.includes("afford") ||
    text.includes("tuition") ||
    text.includes("aid") ||
    text.includes("scholarship") ||
    text.includes("loan") ||
    text.includes("broke") ||
    text.includes("job") ||
    text.includes("financial") ||
    text.includes("fee")
  ) {
    return {
      category: 'financial',
      urgency: 'medium',
      confidence: 0.90,
      reason: "Student reports financial hardship, unexpected tuition expenses, or urgent need for emergency aid counseling.",
      recommended_action: "Contact Financial Aid Office for emergency consultation and micro-grants",
      crisis_flag: false,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (
    text.includes("roommate") ||
    text.includes("dorm") ||
    text.includes("housing") ||
    text.includes("landlord") ||
    text.includes("evict") ||
    text.includes("lease") ||
    text.includes("apartment") ||
    text.includes("residence") ||
    text.includes("room")
  ) {
    return {
      category: 'housing',
      urgency: 'medium',
      confidence: 0.91,
      reason: "Student reports residential friction, roommate dispute, or threat to housing stability.",
      recommended_action: "Contact Student Housing Office for mediation or emergency room swap",
      crisis_flag: false,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (
    text.includes("disability") ||
    text.includes("accommodation") ||
    text.includes("adhd") ||
    text.includes("wheelchair") ||
    text.includes("accessible") ||
    text.includes("hearing") ||
    text.includes("extra time") ||
    text.includes("chronic")
  ) {
    return {
      category: 'disability',
      urgency: 'low',
      confidence: 0.93,
      reason: "Student requests classroom accommodations, assistive learning technology, or campus accessibility support.",
      recommended_action: "Submit accommodation intake packet with Accessibility Services",
      crisis_flag: false,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  if (
    text.includes("harass") ||
    text.includes("stalk") ||
    text.includes("threat") ||
    text.includes("unsafe") ||
    text.includes("assault") ||
    text.includes("title ix") ||
    text.includes("abusive")
  ) {
    return {
      category: 'harassment',
      urgency: 'high',
      confidence: 0.96,
      reason: "Student describes personal safety threat, interpersonal harassment, or hostile campus environment.",
      recommended_action: "Connect immediately with Confidential Title IX Advocate",
      crisis_flag: true,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  return {
    category: 'general',
    urgency: 'low',
    confidence: 0.85,
    reason: "General inquiry regarding campus resources and administrative navigation.",
    recommended_action: "Talk to Student Support Desk at Central Atrium",
    crisis_flag: false,
    timestamp: new Date().toLocaleTimeString()
  };
}
