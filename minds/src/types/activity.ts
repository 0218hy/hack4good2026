// Legacy activity types - re-exported from index.ts for backward compatibility
// This file will be deprecated - import from './types/index' instead

export type { 
  Activity,
  LegacyActivity,
  Signup,
  Booking,
  BookingWithDetails,
  User,
  UserProfile,
  ParticipantProfile,
  CareRelationship,
  Session
} from './index';

// Re-export conversion helpers
export {
  convertActivityFromBackend,
  convertActivityToBackend,
  convertBookingToSignup
} from './index';

// For backward compatibility, export LegacyActivity as Activity
// This allows existing code to continue working during migration
import { LegacyActivity } from './index';
export type { LegacyActivity as Activity };