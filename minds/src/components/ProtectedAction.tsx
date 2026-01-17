/**
 * Protected Action Component
 * 
 * Wrapper component that only renders children if user has required permissions.
 * Use this to conditionally show staff-only UI elements.
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, getUnauthorizedMessage } from '../utils/roleProtection';
import { User } from '../types/index';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProtectedActionProps {
  children: ReactNode;
  requiredRole: User['role'] | User['role'][];
  fallback?: ReactNode;
  showUnauthorizedMessage?: boolean;
}

/**
 * Component that only renders children if user has required role
 * 
 * @example
 * // Only show button to staff
 * <ProtectedAction requiredRole="staff">
 *   <button onClick={createActivity}>Create Activity</button>
 * </ProtectedAction>
 * 
 * @example
 * // Show button to participants or volunteers
 * <ProtectedAction requiredRole={['participant', 'volunteer']}>
 *   <button onClick={signUp}>Sign Up</button>
 * </ProtectedAction>
 */
export function ProtectedAction({
  children,
  requiredRole,
  fallback = null,
  showUnauthorizedMessage = false,
}: ProtectedActionProps) {
  const { user } = useAuth();
  
  if (!hasPermission(user, requiredRole)) {
    if (showUnauthorizedMessage) {
      const message = getUnauthorizedMessage(
        user,
        Array.isArray(requiredRole) ? requiredRole[0] : requiredRole
      );
      
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      );
    }
    
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

interface StaffOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Convenience component for staff-only content
 * 
 * @example
 * <StaffOnly>
 *   <button onClick={deleteActivity}>Delete Activity</button>
 * </StaffOnly>
 */
export function StaffOnly({ children, fallback = null }: StaffOnlyProps) {
  return (
    <ProtectedAction requiredRole="staff" fallback={fallback}>
      {children}
    </ProtectedAction>
  );
}

interface ParticipantOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Convenience component for participant-only content
 */
export function ParticipantOnly({ children, fallback = null }: ParticipantOnlyProps) {
  return (
    <ProtectedAction requiredRole="participant" fallback={fallback}>
      {children}
    </ProtectedAction>
  );
}

interface CaregiverOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Convenience component for caregiver-only content
 */
export function CaregiverOnly({ children, fallback = null }: CaregiverOnlyProps) {
  return (
    <ProtectedAction requiredRole="caregiver" fallback={fallback}>
      {children}
    </ProtectedAction>
  );
}

interface VolunteerOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Convenience component for volunteer-only content
 */
export function VolunteerOnly({ children, fallback = null }: VolunteerOnlyProps) {
  return (
    <ProtectedAction requiredRole="volunteer" fallback={fallback}>
      {children}
    </ProtectedAction>
  );
}

interface LoggedInOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Convenience component for logged-in users only
 */
export function LoggedInOnly({ children, fallback = null }: LoggedInOnlyProps) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
