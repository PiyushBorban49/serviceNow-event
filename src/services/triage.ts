/**
 * DHRONA Student Support Triage & Multi-Need Routing Engine
 */

export interface UniversityRoute {
  id: string;
  category: 'mental_wellbeing' | 'academic' | 'financial' | 'housing' | 'disability' | 'harassment' | 'general';
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
  immediateResources: Array<{ title: string; type: string; url?: string }>;
}

export interface DetectedNeed {
  category: 'mental_wellbeing' | 'academic' | 'financial' | 'housing' | 'disability' | 'harassment' | 'general';
  title: string;
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
  extractedPoints: string[]; // Specific bullet points of what student mentioned
  whyRecommended: string;
  route: UniversityRoute;
  recommendedAction: string;
}

export interface MultiNeedTriageResult {
  needs: DetectedNeed[];
  primaryCategory: string;
  overallUrgency: 'low' | 'medium' | 'high';
  crisis_flag: boolean;
  crisisMessage?: string;
  studentSummary: string;
  timestamp: string;
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
  "jump off",
  "die"
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
    action: "Book Priority Counselling",
    phone: "(555) 019-4821",
    email: "counselling@dhrona.edu",
    hours: "Mon-Fri 8:30 AM - 5:00 PM (Drop-ins 1-3 PM)",
    priorityNote: "Same-day priority triage slot reserved for elevated stress or acute anxiety.",
    description: "Licensed psychologists and therapists providing individual counseling, crisis intervention, group therapy, and stress management.",
    immediateResources: [
      { title: "Exam Anxiety & Somatic Grounding Audio Guide", type: "Audio Guide" },
      { title: "24/7 Peer Support Chatline (Togetherall)", type: "Digital Portal" },
      { title: "Circadian Rhythm & Sleep Hygiene Toolkit", type: "PDF Guide" }
    ]
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
    description: "Holistic academic counseling, workload strategies, degree audit clarification, and professor communication coaching.",
    immediateResources: [
      { title: "Syllabus Deconstruction & Workload Calculator", type: "Interactive Tool" },
      { title: "Official Exam Deferral & Incomplete Grade Policy", type: "Policy Document" },
      { title: "Drop-in Subject Peer Tutoring Schedule", type: "Timetable" }
    ]
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
    description: "FAFSA/scholarship advisement, emergency living expense assistance, on-campus employment navigation, and emergency loans.",
    immediateResources: [
      { title: "Student Emergency Relief Fund (SERF) Application", type: "Fast-Track Form" },
      { title: "Tuition Installment Payment Plan (TIPP) Request", type: "Form" },
      { title: "Campus Food Pantry & Community Grocery Voucher", type: "Assistance" }
    ]
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
    description: "Dorm assignment, tenant advocacy, off-campus lease reviews, safety inspections, and roommate mediation.",
    immediateResources: [
      { title: "Confidential Roommate Dispute Mediation Request", type: "Online Form" },
      { title: "Emergency Temporary On-Campus Bed Request", type: "Emergency Portal" },
      { title: "Tenant Rights & Off-Campus Lease Inspection Guide", type: "Legal Guide" }
    ]
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
    description: "Accommodations for physical disabilities, neurodiversity/ADHD, chronic illnesses, and mobility transit.",
    immediateResources: [
      { title: "Academic Accommodations Intake Packet", type: "PDF Form" },
      { title: "Screen Reader & Assistive Tech Lab Booking", type: "Lab Access" },
      { title: "Campus Mobility Cart & Transit Shuttle Dispatch", type: "Service" }
    ]
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
    description: "Support for victims of harassment, stalking, discrimination, or interpersonal violence with strict privacy.",
    immediateResources: [
      { title: "Confidential Title IX Advocacy Protocol", type: "Safety Guide" },
      { title: "No-Contact Directive & Safety Escort Request", type: "Immediate Measure" }
    ]
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
    description: "General campus navigation, ID cards, registration holds, and multi-department referrals.",
    immediateResources: [
      { title: "Campus Support Directory & Office Map", type: "Interactive Map" },
      { title: "One-Stop Registrar & Records Desk", type: "Portal" }
    ]
  }
};

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
 * Intelligent Multi-Need Triage Classifier
 * Identifies 1 to 4 distinct domain needs simultaneously from one single student statement.
 */
export function classifyMultiNeedMessage(message: string): MultiNeedTriageResult {
  const text = message.toLowerCase();

  // Layer 1: Deterministic Crisis Check
  if (detectCrisis(message)) {
    const crisisNeed: DetectedNeed = {
      category: 'mental_wellbeing',
      title: 'Emergency Mental Health & Crisis Care',
      urgency: 'high',
      confidence: 0.99,
      extractedPoints: [
        "Immediate safety concern detected",
        "Direct crisis/self-harm phrasing present",
        "Urgent emotional distress requiring human intervention"
      ],
      whyRecommended: "Your message contains direct indicators of crisis or self-harm. Human safety responders are on standby immediately.",
      route: ROUTES.mental_wellbeing,
      recommendedAction: "Connect immediately to 24/7 Campus Crisis & Emergency Care"
    };

    return {
      needs: [crisisNeed],
      primaryCategory: 'mental_wellbeing',
      overallUrgency: 'high',
      crisis_flag: true,
      crisisMessage: "Immediate Safety Protocol Activated: AI conversational flow suspended. Direct connection to confidential emergency responders.",
      studentSummary: "Immediate safety/crisis support requested.",
      timestamp: new Date().toLocaleTimeString()
    };
  }

  const detectedNeeds: DetectedNeed[] = [];

  // Need 1: Academic
  const hasAcademic = [
    "exam", "exams", "class", "classes", "grade", "grades", "fail", "failing",
    "study", "studying", "workload", "course", "courses", "professor", "gpa",
    "homework", "deadline", "deadlines", "assignment", "assignments", "academic",
    "syllabus", "semester"
  ].some(k => text.includes(k));

  if (hasAcademic) {
    const points: string[] = [];
    if (text.includes("exam")) points.push("Upcoming exam pressure & scheduling");
    if (text.includes("fail") || text.includes("falling")) points.push("Concerns about failing classes or GPA decline");
    if (text.includes("workload") || text.includes("overwhelm")) points.push("Managing cumulative academic coursework");
    if (text.includes("deadline") || text.includes("assignment")) points.push("Approaching assignment deadlines");
    if (points.length === 0) points.push("General coursework and study organization");

    const isUrgent = text.includes("fail") || text.includes("next week") || text.includes("overwhelm");

    detectedNeeds.push({
      category: 'academic',
      title: 'Academic Success & Advising',
      urgency: isUrgent ? 'medium' : 'low',
      confidence: 0.93,
      extractedPoints: points,
      whyRecommended: "You mentioned difficulty organizing class workload, impending exams, and worries regarding academic standing. The Academic Success Center can restructure your study plan or coordinate exam extensions.",
      route: ROUTES.academic,
      recommendedAction: "Schedule workload restructuring consultation with Academic Advisor"
    });
  }

  // Need 2: Mental Wellbeing / Stress
  const hasWellbeing = [
    "sleep", "sleeping", "stress", "stressed", "anxious", "anxiety", "depress",
    "depressed", "mental", "panic", "crying", "burnout", "exhausted", "lonely",
    "breakdown", "overwhelmed"
  ].some(k => text.includes(k));

  if (hasWellbeing) {
    const points: string[] = [];
    if (text.includes("sleep")) points.push("Prolonged sleep disruption & insomnia");
    if (text.includes("stress")) points.push("Elevated emotional and physiological stress");
    if (text.includes("anxious") || text.includes("anxiety") || text.includes("panic")) points.push("Acute anxiety symptoms or panic sensations");
    if (text.includes("burnout") || text.includes("exhausted")) points.push("Exhaustion and cognitive burnout");
    if (points.length === 0) points.push("Emotional distress and mental wellbeing concerns");

    detectedNeeds.push({
      category: 'mental_wellbeing',
      title: 'Mental Health & Counselling',
      urgency: 'medium',
      confidence: 0.95,
      extractedPoints: points,
      whyRecommended: "You mentioned ongoing sleep disruption and feeling severely overwhelmed. Speaking with a confidential counselor can help stabilize anxiety and prevent burnout.",
      route: ROUTES.mental_wellbeing,
      recommendedAction: "Book priority confidential intake session with Counselling Services"
    });
  }

  // Need 3: Financial Aid & Living Expenses
  const hasFinancial = [
    "rent", "money", "afford", "tuition", "aid", "scholarship", "loan", "loans",
    "broke", "job", "financial", "fee", "fees", "bills", "cost", "pay"
  ].some(k => text.includes(k));

  if (hasFinancial) {
    const points: string[] = [];
    if (text.includes("tuition") || text.includes("fee")) points.push("Imminent tuition payment deadlines");
    if (text.includes("rent") || text.includes("groceries") || text.includes("broke")) points.push("Emergency living expense shortage");
    if (text.includes("job") || text.includes("lost")) points.push("Loss of student employment income");
    if (points.length === 0) points.push("Financial hardship or grant inquiries");

    detectedNeeds.push({
      category: 'financial',
      title: 'Financial Aid & Emergency Grants',
      urgency: 'medium',
      confidence: 0.91,
      extractedPoints: points,
      whyRecommended: "You highlighted acute financial pressure and concerns regarding upcoming tuition or living costs. Financial Services provides emergency micro-grants and deferral options.",
      route: ROUTES.financial,
      recommendedAction: "Apply for Student Emergency Relief Fund & tuition installment plan"
    });
  }

  // Need 4: Housing & Residential Life
  const hasHousing = [
    "roommate", "roommates", "dorm", "housing", "landlord", "evict", "eviction",
    "lease", "apartment", "residence", "room", "living situation"
  ].some(k => text.includes(k));

  if (hasHousing) {
    const points: string[] = [];
    if (text.includes("roommate")) points.push("Roommate friction and living space conflict");
    if (text.includes("evict") || text.includes("lease")) points.push("Housing security or lease termination risk");
    if (text.includes("dorm") || text.includes("housing")) points.push("On-campus dorm assignment challenges");
    if (points.length === 0) points.push("Residential stability concerns");

    detectedNeeds.push({
      category: 'housing',
      title: 'Residence Life & Housing Operations',
      urgency: 'medium',
      confidence: 0.92,
      extractedPoints: points,
      whyRecommended: "You noted interpersonal living friction with a roommate and worry about losing housing. The Housing Office offers neutral mediation and emergency room swaps.",
      route: ROUTES.housing,
      recommendedAction: "Request confidential roommate mediation or room reassignment"
    });
  }

  // Need 5: Disability & Accommodations
  const hasDisability = [
    "disability", "accommodation", "accommodations", "adhd", "wheelchair",
    "accessible", "hearing", "extra time", "chronic", "medical condition"
  ].some(k => text.includes(k));

  if (hasDisability) {
    detectedNeeds.push({
      category: 'disability',
      title: 'Accessibility & DRC Accommodations',
      urgency: 'low',
      confidence: 0.94,
      extractedPoints: [
        "Classroom or exam accommodation needs",
        "Disability support documentation"
      ],
      whyRecommended: "You expressed needs relating to accessibility or learning accommodations to ensure equitable academic access.",
      route: ROUTES.disability,
      recommendedAction: "Submit accommodation intake packet with Disability Resource Center"
    });
  }

  // Need 6: Harassment / Safety
  const hasHarassment = [
    "harass", "harassment", "stalk", "stalking", "threat", "threatened",
    "unsafe", "assault", "title ix", "abusive", "uncomfortable"
  ].some(k => text.includes(k));

  if (hasHarassment) {
    detectedNeeds.push({
      category: 'harassment',
      title: 'Student Safety & Title IX Advocacy',
      urgency: 'high',
      confidence: 0.97,
      extractedPoints: [
        "Interpersonal harassment or stalking concern",
        "Campus safety & personal security threat"
      ],
      whyRecommended: "You mentioned feeling unsafe or harassed on campus. The Title IX Office provides immediate protective measures and confidential advocacy.",
      route: ROUTES.harassment,
      recommendedAction: "Connect with Confidential Campus Safety & Title IX Advocate"
    });
  }

  // Fallback to General if no specific category matched
  if (detectedNeeds.length === 0) {
    detectedNeeds.push({
      category: 'general',
      title: 'Student Support Desk',
      urgency: 'low',
      confidence: 0.85,
      extractedPoints: ["General campus navigation inquiry"],
      whyRecommended: "Your inquiry covers broad campus topics. The One-Stop Support Desk connects students to the appropriate staff.",
      route: ROUTES.general,
      recommendedAction: "Connect with One-Stop Support Specialist"
    });
  }

  // Determine overall urgency
  const hasHigh = detectedNeeds.some(n => n.urgency === 'high');
  const hasMedium = detectedNeeds.some(n => n.urgency === 'medium');
  const overallUrgency = hasHigh ? 'high' : hasMedium ? 'medium' : 'low';

  // Generate concise student summary for the one-click handoff
  const needTitles = detectedNeeds.map(n => n.title).join(", ");
  const studentSummary = `Student reported simultaneous concerns across: ${needTitles}. Core indicators include: ${detectedNeeds.flatMap(n => n.extractedPoints).slice(0, 3).join("; ")}.`;

  return {
    needs: detectedNeeds,
    primaryCategory: detectedNeeds[0].category,
    overallUrgency,
    crisis_flag: false,
    studentSummary,
    timestamp: new Date().toLocaleTimeString()
  };
}
