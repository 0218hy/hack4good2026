export interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  meetingVenue: string;
  description: string;
  
  // SINGLE SOURCE OF TRUTH FOR CAPACITY TRACKING
  // =============================================
  // Participant tracking (use ONLY these two fields):
  participantCapacity: number;              // Total participant slots (set by staff)
  registeredParticipantsCount: number;      // Current participant registrations
  
  // Volunteer tracking (use ONLY these two fields):
  volunteerCapacity: number;                // Total volunteer slots (set by staff)
  registeredVolunteersCount: number;        // Current volunteer signups
  
  // Vacancy calculation (COMPUTED, not stored):
  // - participantVacancy = participantCapacity - registeredParticipantsCount
  // - volunteerVacancy = volunteerCapacity - registeredVolunteersCount
  // - isParticipantFull = participantVacancy <= 0
  // - isVolunteerFull = volunteerVacancy <= 0
  
  // Legacy fields for backward compatibility - these will be calculated
  participantVacancy: number;
  volunteerVacancy: number;
  
  wheelchairAccessible: boolean;
  signLanguageSupport: boolean;
  paymentRequired: boolean;
  paymentAmount?: number;
  signupDeadline: string;
  jobScope?: string;
  specialInstructions?: string;
  packingList: string;
  repeatFrequency?: 'none' | 'weekly' | 'biweekly' | 'monthly';
  repeatEndDate?: string;
  isRecurringInstance?: boolean;
  parentActivityId?: string; // Links recurring instances to their parent
  staffInCharge: string;
  staffContactNumber: string;
}

export interface Signup {
  activityId: string;
  userId: string;
  userName: string;
  timestamp: string;
  attended?: boolean;
  paymentStatus?: 'paid' | 'unpaid';
}