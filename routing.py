"""
University Student Support Routing Engine.
Maps triaged categories to deterministic university departments and actionable next steps.
"""

ROUTES = {
    "mental_wellbeing": {
        "service": "Counselling Services",
        "department": "Student Wellness & Psychological Services",
        "location": "Student Wellness Center, Building B, Room 204",
        "action": "Book Counselling Appointment",
        "contact_phone": "(555) 019-4821",
        "contact_email": "counselling@dhrona.edu",
        "hours": "Mon-Fri 8:30 AM - 5:00 PM (Drop-ins 1:00 PM - 3:00 PM)",
        "priority_support": "Priority appointment within 24 hours available for elevated stress."
    },
    "academic": {
        "service": "Academic Support",
        "department": "Academic Success Center",
        "location": "Main Campus Library, 3rd Floor East Wing",
        "action": "Talk to Academic Advisor",
        "contact_phone": "(555) 019-4822",
        "contact_email": "academicsuccess@dhrona.edu",
        "hours": "Mon-Fri 9:00 AM - 6:00 PM",
        "priority_support": "Workload restructuring & 1-on-1 tutoring sessions available."
    },
    "financial": {
        "service": "Financial Aid Office",
        "department": "Student Financial Services & Emergency Grants",
        "location": "Student Services Hub, Hall A, Room 112",
        "action": "Contact Financial Advisor",
        "contact_phone": "(555) 019-4823",
        "contact_email": "finaid@dhrona.edu",
        "hours": "Mon-Fri 9:00 AM - 4:30 PM",
        "priority_support": "Emergency student micro-grants and tuition deferral assistance."
    },
    "housing": {
        "service": "Student Housing Office",
        "department": "Residence Life & Housing Operations",
        "location": "Campus Housing Pavilion, Room 101",
        "action": "Contact Housing Advisor",
        "contact_phone": "(555) 019-4824",
        "contact_email": "housing@dhrona.edu",
        "hours": "Mon-Fri 8:00 AM - 5:00 PM",
        "priority_support": "Mediation services, emergency room reassignment, tenant rights advocacy."
    },
    "disability": {
        "service": "Accessibility Services",
        "department": "Disability Resource Center (DRC)",
        "location": "Accessibility Center, Suite 110",
        "action": "Request Accessibility Support",
        "contact_phone": "(555) 019-4825",
        "contact_email": "access@dhrona.edu",
        "hours": "Mon-Fri 9:00 AM - 5:00 PM",
        "priority_support": "Exam accommodations, assistive note-taking, mobility transit."
    },
    "harassment": {
        "service": "Student Safety & Title IX Office",
        "department": "Campus Advocacy & Title IX Compliance",
        "location": "Campus Safety & Advocacy Building, Suite 300",
        "action": "Speak with Confidential Advocate",
        "contact_phone": "(555) 019-4899",
        "contact_email": "safety@dhrona.edu",
        "hours": "24/7 Confidential Helpline Active",
        "priority_support": "Immediate safety escort, no-contact directives, confidential counseling."
    },
    "general": {
        "service": "Student Support Desk",
        "department": "One-Stop Student Services",
        "location": "Student Services Central Atrium",
        "action": "Talk to Student Support",
        "contact_phone": "(555) 019-4800",
        "contact_email": "support@dhrona.edu",
        "hours": "Mon-Sat 8:00 AM - 8:00 PM",
        "priority_support": "Cross-department navigation and orientation assistance."
    }
}

def get_route(category: str) -> dict:
    """Returns the routing information for a given category with a fallback to general support."""
    normalized_category = (category or "").lower().strip()
    return ROUTES.get(normalized_category, ROUTES["general"])
