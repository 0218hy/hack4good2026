// Core type definitions matching backend models

// ============================================================================
// USER MODEL (matches Supabase backend)
// ============================================================================
export interface User {
  id: string;                     // UUID string from Supabase Auth
  name: string;
  phone: string | null;           // nullable
  email: string;
  password?: string | null;       // Not exposed to frontend
  role: 'participant' | 'caregiver' | 'volunteer' | 'staff';
  created_at: string;             // ISO timestamp string
}

// Frontend-only extended user data (not sent to backend)
export interface UserProfile {
  user: User;
  participantProfile?: ParticipantProfile;
  careRelationships?: CareRelationship[];
}

// ============================================================================
// PARTICIPANT PROFILE MODEL (matches backend ParticipantProfile struct)
// ============================================================================
export interface ParticipantProfile {
  user_id: string;                // UUID string from Supabase
  age: number | null;             // nullable
  membership_type: string | null; // nullable - e.g., 'member', 'non-member'
  wheelchair: boolean;
  sign_language: boolean;
  // Structural accessibility needs
  needs_seated_activity: boolean; // Prefers seated activities
  sensitive_to_light: boolean;    // Sensitive to bright lights
  sensitive_to_noise: boolean;    // Sensitive to loud noises
  other_need: string | null;      // nullable
  created_at: string;             // ISO timestamp string
}

// ============================================================================
// CARE RELATIONSHIP MODEL (matches backend CareRelationship struct)
// ============================================================================
export interface CareRelationship {
  participant_id: string;         // UUID string from Supabase
  caregiver_id: string;           // UUID string from Supabase
  created_at: string;             // ISO timestamp string
}

// ============================================================================
// ACTIVITY MODEL (matches backend Activity struct)
// ============================================================================
export interface Activity {
  signLanguageSupport: boolean;
  venueChinese: any;
  titleChinese: any;
  id: string;                          // UUID string from Supabase
  title: string;
  description: string | null;          // nullable
  venue: string;
  start_time: string;                  // ISO timestamp string
  end_time: string;                    // ISO timestamp string
  signup_deadline: string;             // ISO timestamp string
  participant_capacity: number;
  volunteer_capacity: number;
  wheelchair_accessible: boolean;
  sign_language_available: boolean;
  requires_payment: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_by: string;                  // UUID string (staff user ID)
  created_at: string;                  // ISO timestamp string
  
  // Extended fields
  payment_amount?: number;             // If requires_payment is true
  meeting_venue?: string;              // Specific meeting point
  job_scope?: string;                  // Volunteer responsibilities
  packing_list?: string;               // Suggested items to bring
  special_instructions?: string;       // Additional notes
  staff_in_charge?: string;            // Staff member name
  staff_contact_number?: string;       // Contact number
  
  // Recurring activity fields
  repeat_frequency?: 'none' | 'weekly' | 'biweekly' | 'monthly';
  repeat_end_date?: string;
  is_recurring_instance?: boolean;
  parent_activity_id?: string;         // Links to parent activity for recurring instances
  
  // Runtime calculated fields (not stored in database)
  registered_participants_count?: number;
  registered_volunteers_count?: number;
  participant_vacancy?: number;        // Calculated: capacity - registered count
  volunteer_vacancy?: number;          // Calculated: capacity - registered count
}

// ============================================================================
// BOOKING MODEL (matches backend Booking struct)
// ============================================================================
export interface Booking {
  id: string;                         // UUID string from Supabase
  activity_id: string;                // UUID string from Supabase
  user_id: string;                    // UUID string (person who made the booking)
  booked_for_user_id: string | null;  // UUID string (nullable - for caregiver booking for participant)
  role: 'participant' | 'volunteer';  // role for this specific booking
  is_paid: boolean;
  attendance_status: 'attended' | 'absent' | 'pending' | null;
  created_at: string;                 // ISO timestamp string
  cancelled_at: string | null;        // ISO timestamp string (nullable)
}

// Frontend-only extended booking data
export interface BookingWithDetails extends Booking {
  activity?: Activity;
  user?: User;
  booked_for_user?: User;
}

// ============================================================================
// SESSION MODEL (matches backend Session struct - for authentication)
// ============================================================================
export interface Session {
  id: string;                         // UUID string
  user_id: number;                    // int32 in backend
  refresh_token: string;
  is_revoked: boolean;
  expires_at: string;                 // ISO timestamp string (pgtype.Timestamp in backend)
  created_at: string;                 // ISO timestamp string (pgtype.Timestamp in backend)
}

// ============================================================================
// LEGACY COMPATIBILITY TYPES (for gradual migration)
// ============================================================================

// Legacy Activity format (to be deprecated)
export interface LegacyActivity {
  id: string;                          // Legacy string IDs
  title: string;
  titleChinese: string;                // Chinese title
  date: string;                        // Legacy: separate date field (YYYY-MM-DD)
  time: string;                        // Legacy: time range string (e.g., "10:00 AM - 12:00 PM")
  venue: string;
  venueChinese: string;                // Chinese venue
  meetingVenue: string;
  description: string;
  participantCapacity: number;
  registeredParticipantsCount: number;
  volunteerCapacity: number;
  registeredVolunteersCount: number;
  participantVacancy: number;
  volunteerVacancy: number;
  wheelchairAccessible: boolean;
  signLanguageSupport: boolean;
  // Structural accessibility tags
  seatedActivity: boolean;             // Activity can be done while seated
  lowLight: boolean;                   // Low light environment
  lowNoise: boolean;                   // Low noise environment
  paymentRequired: boolean;
  paymentAmount?: number;
  signupDeadline: string;              // Legacy: date string (YYYY-MM-DD)
  jobScope?: string;
  specialInstructions?: string;
  packingList: string;
  repeatFrequency?: 'none' | 'weekly' | 'biweekly' | 'monthly';
  repeatEndDate?: string;
  isRecurringInstance?: boolean;
  parentActivityId?: string;           // Legacy string ID
  staffInCharge: string;
  staffContactNumber: string;
}

// Legacy Signup format (to be replaced by Booking)
export interface Signup {
  activityId: string;
  userId: string;
  userName: string;
  timestamp: string;
  attended?: boolean;
  paymentStatus?: 'paid' | 'unpaid';
}

// ============================================================================
// HELPER FUNCTIONS FOR TYPE CONVERSION
// ============================================================================

/**
 * Converts backend Activity to frontend format
 */
export function convertActivityFromBackend(backendActivity: Activity): LegacyActivity {
  const startTime = new Date(backendActivity.start_time);
  const endTime = new Date(backendActivity.end_time);
  
  // Extract date (YYYY-MM-DD)
  const date = startTime.toISOString().split('T')[0];
  
  // Format time range (e.g., "10:00 AM - 12:00 PM")
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  const time = `${formatTime(startTime)} - ${formatTime(endTime)}`;
  
  return {
    id: backendActivity.id.toString(),
    title: backendActivity.title,
    date,
    time,
    venue: backendActivity.venue,
    meetingVenue: backendActivity.meeting_venue || backendActivity.venue,
    description: backendActivity.description || '',
    participantCapacity: backendActivity.participant_capacity,
    registeredParticipantsCount: backendActivity.registered_participants_count || 0,
    volunteerCapacity: backendActivity.volunteer_capacity,
    registeredVolunteersCount: backendActivity.registered_volunteers_count || 0,
    participantVacancy: backendActivity.participant_capacity - (backendActivity.registered_participants_count || 0),
    volunteerVacancy: backendActivity.volunteer_capacity - (backendActivity.registered_volunteers_count || 0),
    wheelchairAccessible: backendActivity.wheelchair_accessible,
    signLanguageSupport: backendActivity.sign_language_available,
    // Structural accessibility tags
    seatedActivity: false,             // Default to false
    lowLight: false,                   // Default to false
    lowNoise: false,                   // Default to false
    paymentRequired: backendActivity.requires_payment,
    paymentAmount: backendActivity.payment_amount,
    signupDeadline: new Date(backendActivity.signup_deadline).toISOString().split('T')[0],
    jobScope: backendActivity.job_scope,
    specialInstructions: backendActivity.special_instructions,
    packingList: backendActivity.packing_list || '',
    repeatFrequency: backendActivity.repeat_frequency || 'none',
    repeatEndDate: backendActivity.repeat_end_date,
    isRecurringInstance: backendActivity.is_recurring_instance,
    parentActivityId: backendActivity.parent_activity_id?.toString(),
    staffInCharge: backendActivity.staff_in_charge || '',
    staffContactNumber: backendActivity.staff_contact_number || ''
  };
}

/**
 * Converts frontend LegacyActivity to backend format
 */
export function convertActivityToBackend(legacyActivity: LegacyActivity, createdBy: string): Activity {
  // Parse date and time to create start_time and end_time
  const [startTimeStr, endTimeStr] = legacyActivity.time.split(' - ');
  
  // Helper function to parse time string like "10:00 AM" or "2:00 PM"
  const parseTime = (dateStr: string, timeStr: string): string => {
    // Remove extra spaces
    const cleanTime = timeStr.trim();
    
    // Parse the time components
    const match = cleanTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) {
      console.error('Invalid time format:', timeStr);
      return new Date().toISOString(); // Fallback to current time
    }
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Create ISO datetime string
    const [year, month, day] = dateStr.split('-');
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Months are 0-indexed
      parseInt(day),
      hours,
      minutes,
      0,
      0
    );
    
    return date.toISOString();
  };
  
  const startTime = parseTime(legacyActivity.date, startTimeStr);
  const endTime = parseTime(legacyActivity.date, endTimeStr);
  
  // Parse signup deadline (date string YYYY-MM-DD to end of that day)
  const [year, month, day] = legacyActivity.signupDeadline.split('-');
  const signupDeadline = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    23,
    59,
    59
  ).toISOString();
  
  return {
    id: legacyActivity.id,  // Keep as string UUID
    title: legacyActivity.title,
    description: legacyActivity.description,
    venue: legacyActivity.venue,
    start_time: startTime,
    end_time: endTime,
    signup_deadline: signupDeadline,
    participant_capacity: legacyActivity.participantCapacity,
    volunteer_capacity: legacyActivity.volunteerCapacity,
    wheelchair_accessible: legacyActivity.wheelchairAccessible,
    sign_language_available: legacyActivity.signLanguageSupport,
    requires_payment: legacyActivity.paymentRequired,
    status: 'published', // Default status
    created_by: createdBy,
    created_at: new Date().toISOString(),
    payment_amount: legacyActivity.paymentAmount,
    meeting_venue: legacyActivity.meetingVenue,
    job_scope: legacyActivity.jobScope,
    packing_list: legacyActivity.packingList,
    special_instructions: legacyActivity.specialInstructions,
    staff_in_charge: legacyActivity.staffInCharge,
    staff_contact_number: legacyActivity.staffContactNumber,
    repeat_frequency: legacyActivity.repeatFrequency,
    repeat_end_date: legacyActivity.repeatEndDate,
    is_recurring_instance: legacyActivity.isRecurringInstance,
    parent_activity_id: legacyActivity.parentActivityId,
    registered_participants_count: legacyActivity.registeredParticipantsCount,
    registered_volunteers_count: legacyActivity.registeredVolunteersCount
  };
}

/**
 * Converts backend Booking to legacy Signup format
 */
export function convertBookingToSignup(booking: Booking, userName: string): Signup {
  return {
    activityId: booking.activity_id.toString(),
    userId: booking.user_id.toString(),
    userName,
    timestamp: booking.created_at,
    attended: booking.attendance_status === 'attended',
    paymentStatus: booking.is_paid ? 'paid' : 'unpaid'
  };
}