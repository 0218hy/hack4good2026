/**
 * Role-Based Protection Utilities
 * 
 * Helper functions to enforce role-based access control in the frontend.
 * Note: These are for UX only - backend must also validate permissions!
 */

import { User } from '../types/index';

/**
 * Check if user has permission to perform an action
 */
export function hasPermission(
  user: User | null,
  requiredRole: User['role'] | User['role'][]
): boolean {
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
}

/**
 * Check if user is staff
 */
export function isStaff(user: User | null): boolean {
  return user?.role === 'staff';
}

/**
 * Check if user is participant
 */
export function isParticipant(user: User | null): boolean {
  return user?.role === 'participant';
}

/**
 * Check if user is caregiver
 */
export function isCaregiver(user: User | null): boolean {
  return user?.role === 'caregiver';
}

/**
 * Check if user is volunteer
 */
export function isVolunteer(user: User | null): boolean {
  return user?.role === 'volunteer';
}

/**
 * Staff-only actions
 */
export const STAFF_ONLY_ACTIONS = {
  CREATE_ACTIVITY: 'create_activity',
  EDIT_ACTIVITY: 'edit_activity',
  DELETE_ACTIVITY: 'delete_activity',
  CREATE_USER: 'create_user',
  DELETE_USER: 'delete_user',
  MANAGE_BOOKINGS: 'manage_bookings',
  VIEW_ALL_USERS: 'view_all_users',
  UPDATE_PAYMENT_STATUS: 'update_payment_status',
  UPDATE_ATTENDANCE: 'update_attendance',
} as const;

/**
 * Check if user can perform a specific action
 */
export function canPerformAction(
  user: User | null,
  action: typeof STAFF_ONLY_ACTIONS[keyof typeof STAFF_ONLY_ACTIONS]
): boolean {
  if (!user) return false;
  
  // All staff-only actions require staff role
  if (Object.values(STAFF_ONLY_ACTIONS).includes(action)) {
    return isStaff(user);
  }
  
  return false;
}

/**
 * Get user's accessible routes based on role
 */
export function getAccessibleRoutes(user: User | null): string[] {
  if (!user) return ['/login', '/register'];
  
  const commonRoutes = ['/activities', '/profile'];
  
  switch (user.role) {
    case 'staff':
      return [...commonRoutes, '/staff-dashboard', '/create-activity', '/manage-users'];
    case 'participant':
      return [...commonRoutes, '/participant-dashboard', '/my-activities'];
    case 'caregiver':
      return [...commonRoutes, '/caregiver-dashboard', '/manage-participants'];
    case 'volunteer':
      return [...commonRoutes, '/volunteer-dashboard', '/my-activities'];
    default:
      return commonRoutes;
  }
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(user: User | null, route: string): boolean {
  const accessibleRoutes = getAccessibleRoutes(user);
  return accessibleRoutes.some(r => route.startsWith(r));
}

/**
 * Role-based feature flags
 */
export function getFeatureFlags(user: User | null) {
  return {
    canCreateActivity: isStaff(user),
    canDeleteActivity: isStaff(user),
    canEditActivity: isStaff(user),
    canCreateUser: isStaff(user),
    canDeleteUser: isStaff(user),
    canManageBookings: isStaff(user),
    canUpdatePaymentStatus: isStaff(user),
    canUpdateAttendance: isStaff(user),
    canViewAllUsers: isStaff(user),
    canSignUpForActivity: isParticipant(user) || isVolunteer(user),
    canBookForOthers: isCaregiver(user),
    canViewOwnBookings: user !== null,
  };
}

/**
 * Error messages for unauthorized actions
 */
export const UNAUTHORIZED_MESSAGES = {
  STAFF_ONLY: 'This action is restricted to staff members only.',
  LOGIN_REQUIRED: 'Please login to perform this action.',
  PARTICIPANT_ONLY: 'This feature is only available to participants.',
  VOLUNTEER_ONLY: 'This feature is only available to volunteers.',
  CAREGIVER_ONLY: 'This feature is only available to caregivers.',
  INVALID_ROLE: 'You do not have permission to access this feature.',
} as const;

/**
 * Get appropriate error message for unauthorized access
 */
export function getUnauthorizedMessage(
  user: User | null,
  requiredRole?: User['role']
): string {
  if (!user) return UNAUTHORIZED_MESSAGES.LOGIN_REQUIRED;
  
  if (!requiredRole) return UNAUTHORIZED_MESSAGES.INVALID_ROLE;
  
  switch (requiredRole) {
    case 'staff':
      return UNAUTHORIZED_MESSAGES.STAFF_ONLY;
    case 'participant':
      return UNAUTHORIZED_MESSAGES.PARTICIPANT_ONLY;
    case 'volunteer':
      return UNAUTHORIZED_MESSAGES.VOLUNTEER_ONLY;
    case 'caregiver':
      return UNAUTHORIZED_MESSAGES.CAREGIVER_ONLY;
    default:
      return UNAUTHORIZED_MESSAGES.INVALID_ROLE;
  }
}
