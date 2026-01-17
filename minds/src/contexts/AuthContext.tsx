/**
 * Authentication Context
 * 
 * Provides user authentication state and methods throughout the app.
 * Uses local mock data for authentication.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile, ParticipantProfile } from '../types/index';
import { 
  mockLogin, 
  mockGetCurrentUser, 
  mockSetCurrentUser, 
  mockClearCurrentUser,
  mockParticipantProfiles 
} from '../services/mockData';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = mockGetCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Get participant profile if user is a participant
          const participantProfile = mockParticipantProfiles.find(
            p => p.user_id === currentUser.id
          );
          
          setUserProfile({
            user: currentUser,
            participantProfile: participantProfile || null,
          });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, phone: string): Promise<boolean> => {
    try {
      const loggedInUser = mockLogin(email, phone);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        mockSetCurrentUser(loggedInUser.id);
        
        // Get participant profile if user is a participant
        const participantProfile = mockParticipantProfiles.find(
          p => p.user_id === loggedInUser.id
        );
        
        setUserProfile({
          user: loggedInUser,
          participantProfile: participantProfile || null,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    mockClearCurrentUser();
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to get current user role
 */
export function useUserRole(): User['role'] | null {
  const { user } = useAuth();
  return user?.role || null;
}

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role: User['role']): boolean {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * Hook to get participant profile (only for participants)
 */
export function useParticipantProfile(): ParticipantProfile | null {
  const { userProfile } = useAuth();
  return userProfile?.participantProfile || null;
}