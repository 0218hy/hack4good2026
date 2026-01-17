/**
 * Mock Data Service
 * 
 * Provides mock implementations of backend API responses
 * for development and testing without a real backend.
 */

import {
  User,
  ParticipantProfile,
  Activity,
  Booking,
  BookingWithDetails,
  LegacyActivity,
  convertActivityToBackend,
} from '../types/index';
import { mockActivities } from '../data/mockActivities';

// ============================================================================
// MOCK USERS
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Participant',
    email: 'john@example.com',
    phone: '+65 9123 4567',
    password: null, // Never expose passwords to frontend
    role: 'participant',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Mary Caregiver',
    email: 'mary@example.com',
    phone: '+65 9234 5678',
    password: null,
    role: 'caregiver',
    created_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Tom Volunteer',
    email: 'tom@example.com',
    phone: '+65 9345 6789',
    password: null,
    role: 'volunteer',
    created_at: '2026-01-03T00:00:00Z',
  },
  {
    id: 4,
    name: 'Sarah Staff',
    email: 'sarah@example.com',
    phone: '+65 9456 7890',
    password: null,
    role: 'staff',
    created_at: '2026-01-04T00:00:00Z',
  },
];

// ============================================================================
// MOCK PARTICIPANT PROFILES
// ============================================================================

export const mockParticipantProfiles: ParticipantProfile[] = [
  {
    user_id: 1,
    age: 25,
    membership_type: 'member',
    wheelchair: true,
    sign_language: false,
    other_need: 'Prefers quiet environments',
    created_at: '2026-01-01T00:00:00Z',
  },
];

// ============================================================================
// MOCK ACTIVITIES (converted from legacy format)
// ============================================================================

export const mockBackendActivities: Activity[] = mockActivities.map((activity: LegacyActivity) => {
  return convertActivityToBackend(activity, 4); // Created by Sarah Staff (user_id: 4)
});

// ============================================================================
// MOCK BOOKINGS
// ============================================================================

let mockBookingIdCounter = 1;

export const mockBookings: Booking[] = [
  {
    id: mockBookingIdCounter++,
    activity_id: 1, // Art & Crafts Workshop
    user_id: 1, // John Participant
    booked_for_user_id: null,
    role: 'participant',
    is_paid: false,
    attendance_status: 'pending',
    created_at: '2026-01-15T10:00:00Z',
    cancelled_at: null,
  },
  {
    id: mockBookingIdCounter++,
    activity_id: 1, // Art & Crafts Workshop
    user_id: 3, // Tom Volunteer
    booked_for_user_id: null,
    role: 'volunteer',
    is_paid: false,
    attendance_status: 'pending',
    created_at: '2026-01-15T11:00:00Z',
    cancelled_at: null,
  },
  {
    id: mockBookingIdCounter++,
    activity_id: 2, // Fitness & Movement Class
    user_id: 2, // Mary Caregiver booking for participant
    booked_for_user_id: 1, // For John Participant
    role: 'participant',
    is_paid: true,
    attendance_status: 'pending',
    created_at: '2026-01-16T09:00:00Z',
    cancelled_at: null,
  },
];

// ============================================================================
// MOCK SERVICE FUNCTIONS
// ============================================================================

/**
 * Mock authentication
 */
export function mockLogin(email: string, phone: string): User | null {
  const user = mockUsers.find(u => u.email === email && u.phone === phone);
  return user || null;
}

/**
 * Mock create user
 */
export function mockCreateUser(userData: {
  name: string;
  email: string;
  phone: string;
  role: 'participant' | 'caregiver' | 'volunteer' | 'staff';
}): User {
  const newUser: User = {
    id: mockUsers.length + 1,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: null,
    role: userData.role,
    created_at: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
}

/**
 * Mock get activities with capacity counts
 */
export function mockGetActivities(): Activity[] {
  return mockBackendActivities.map(activity => {
    // Count current bookings for this activity
    const participantBookings = mockBookings.filter(
      b => b.activity_id === activity.id && b.role === 'participant' && !b.cancelled_at
    );
    const volunteerBookings = mockBookings.filter(
      b => b.activity_id === activity.id && b.role === 'volunteer' && !b.cancelled_at
    );

    return {
      ...activity,
      registered_participants_count: participantBookings.length,
      registered_volunteers_count: volunteerBookings.length,
      participant_vacancy: activity.participant_capacity - participantBookings.length,
      volunteer_vacancy: activity.volunteer_capacity - volunteerBookings.length,
    };
  });
}

/**
 * Mock create booking
 */
export function mockCreateBooking(booking: {
  activity_id: number;
  user_id: number;
  booked_for_user_id?: number;
  role: 'participant' | 'volunteer';
}): Booking {
  const newBooking: Booking = {
    id: mockBookingIdCounter++,
    activity_id: booking.activity_id,
    user_id: booking.user_id,
    booked_for_user_id: booking.booked_for_user_id || null,
    role: booking.role,
    is_paid: false,
    attendance_status: 'pending',
    created_at: new Date().toISOString(),
    cancelled_at: null,
  };
  mockBookings.push(newBooking);
  return newBooking;
}

/**
 * Mock cancel booking
 */
export function mockCancelBooking(bookingId: number): Booking | null {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.cancelled_at = new Date().toISOString();
    return booking;
  }
  return null;
}

/**
 * Mock get user bookings with details
 */
export function mockGetUserBookings(
  userId: number,
  filters?: { role?: 'participant' | 'volunteer'; status?: 'active' | 'cancelled' }
): BookingWithDetails[] {
  let userBookings = mockBookings.filter(b => b.user_id === userId || b.booked_for_user_id === userId);

  // Apply filters
  if (filters?.role) {
    userBookings = userBookings.filter(b => b.role === filters.role);
  }
  if (filters?.status === 'active') {
    userBookings = userBookings.filter(b => !b.cancelled_at);
  } else if (filters?.status === 'cancelled') {
    userBookings = userBookings.filter(b => !!b.cancelled_at);
  }

  // Add activity and user details
  return userBookings.map(booking => ({
    ...booking,
    activity: mockBackendActivities.find(a => a.id === booking.activity_id),
    user: mockUsers.find(u => u.id === booking.user_id),
    booked_for_user: booking.booked_for_user_id
      ? mockUsers.find(u => u.id === booking.booked_for_user_id)
      : undefined,
  }));
}

/**
 * Mock get activity bookings
 */
export function mockGetActivityBookings(
  activityId: number,
  role?: 'participant' | 'volunteer'
): BookingWithDetails[] {
  let activityBookings = mockBookings.filter(
    b => b.activity_id === activityId && !b.cancelled_at
  );

  if (role) {
    activityBookings = activityBookings.filter(b => b.role === role);
  }

  return activityBookings.map(booking => ({
    ...booking,
    activity: mockBackendActivities.find(a => a.id === activityId),
    user: mockUsers.find(u => u.id === booking.user_id),
    booked_for_user: booking.booked_for_user_id
      ? mockUsers.find(u => u.id === booking.booked_for_user_id)
      : undefined,
  }));
}

/**
 * Mock check booking conflict
 */
export function mockCheckConflict(
  userId: number,
  startTime: string,
  endTime: string,
  excludeActivityId?: number
): { hasConflict: boolean; conflictingBookings: BookingWithDetails[] } {
  const userBookings = mockGetUserBookings(userId, { status: 'active' });
  
  const conflictingBookings = userBookings.filter(booking => {
    if (!booking.activity) return false;
    if (excludeActivityId && booking.activity_id === excludeActivityId) return false;

    const bookingStart = new Date(booking.activity.start_time);
    const bookingEnd = new Date(booking.activity.end_time);
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    // Check for time overlap
    return (
      (newStart >= bookingStart && newStart < bookingEnd) ||
      (newEnd > bookingStart && newEnd <= bookingEnd) ||
      (newStart <= bookingStart && newEnd >= bookingEnd)
    );
  });

  return {
    hasConflict: conflictingBookings.length > 0,
    conflictingBookings,
  };
}

/**
 * Mock update payment status
 */
export function mockUpdatePaymentStatus(bookingId: number, isPaid: boolean): Booking | null {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.is_paid = isPaid;
    return booking;
  }
  return null;
}

/**
 * Mock update attendance status
 */
export function mockUpdateAttendanceStatus(
  bookingId: number,
  status: 'attended' | 'absent' | 'pending'
): Booking | null {
  const booking = mockBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.attendance_status = status;
    return booking;
  }
  return null;
}

/**
 * Mock create activity
 */
export function mockCreateActivity(activity: Partial<Activity>): Activity {
  const newActivity: Activity = {
    id: mockBackendActivities.length + 1,
    title: activity.title || '',
    description: activity.description || null,
    venue: activity.venue || '',
    start_time: activity.start_time || new Date().toISOString(),
    end_time: activity.end_time || new Date().toISOString(),
    signup_deadline: activity.signup_deadline || new Date().toISOString(),
    participant_capacity: activity.participant_capacity || 0,
    volunteer_capacity: activity.volunteer_capacity || 0,
    wheelchair_accessible: activity.wheelchair_accessible || false,
    sign_language_available: activity.sign_language_available || false,
    requires_payment: activity.requires_payment || false,
    status: activity.status || 'published',
    created_by: activity.created_by || 4, // Default to Sarah Staff
    created_at: new Date().toISOString(),
    ...activity,
  };
  mockBackendActivities.push(newActivity);
  return newActivity;
}

/**
 * Mock update activity
 */
export function mockUpdateActivity(activityId: number, updates: Partial<Activity>): Activity | null {
  const index = mockBackendActivities.findIndex(a => a.id === activityId);
  if (index !== -1) {
    mockBackendActivities[index] = {
      ...mockBackendActivities[index],
      ...updates,
    };
    return mockBackendActivities[index];
  }
  return null;
}

/**
 * Mock delete activity
 */
export function mockDeleteActivity(activityId: number): boolean {
  const index = mockBackendActivities.findIndex(a => a.id === activityId);
  if (index !== -1) {
    mockBackendActivities.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Get current user from localStorage (mock session)
 */
export function mockGetCurrentUser(): User | null {
  const userId = localStorage.getItem('mockUserId');
  if (userId) {
    return mockUsers.find(u => u.id === parseInt(userId)) || null;
  }
  return null;
}

/**
 * Set current user in localStorage (mock session)
 */
export function mockSetCurrentUser(userId: number): void {
  localStorage.setItem('mockUserId', userId.toString());
}

/**
 * Clear current user from localStorage (mock logout)
 */
export function mockClearCurrentUser(): void {
  localStorage.removeItem('mockUserId');
}
