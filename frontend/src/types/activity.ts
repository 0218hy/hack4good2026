export interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  meetingVenue: string;
  description: string;
  participantCapacity: number;
  registeredParticipantsCount: number;
  volunteerCapacity: number;
  registeredVolunteersCount: number;
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