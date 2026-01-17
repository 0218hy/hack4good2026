/**
 * useBookings Hook
 * 
 * Custom hook for managing activity bookings (signups).
 * Provides methods for creating, canceling, and fetching bookings.
 * 
 * Example usage in components:
 * 
 * const { 
 *   userBookings, 
 *   createBooking, 
 *   cancelBooking, 
 *   isLoading 
 * } = useBookings(userId);
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Booking,
  BookingWithDetails,
  Activity,
} from '../types/index';
import {
  mockCreateBooking,
  mockCancelBooking,
  mockGetUserBookings,
  mockCheckConflict,
  mockUpdatePaymentStatus,
  mockUpdateAttendanceStatus,
} from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';

interface UseBookingsOptions {
  role?: 'participant' | 'volunteer';
  status?: 'active' | 'cancelled';
  upcoming?: boolean;
  autoFetch?: boolean;
}

interface UseBookingsReturn {
  bookings: BookingWithDetails[];
  isLoading: boolean;
  error: string | null;
  createBooking: (params: {
    activity_id: number;
    role: 'participant' | 'volunteer';
    booked_for_user_id?: number;
  }) => Promise<Booking>;
  cancelBooking: (bookingId: number) => Promise<void>;
  checkConflict: (activity: Activity) => Promise<{
    hasConflict: boolean;
    conflictingBookings: BookingWithDetails[];
  }>;
  updatePaymentStatus: (bookingId: number, isPaid: boolean) => Promise<void>;
  updateAttendanceStatus: (
    bookingId: number,
    status: 'attended' | 'absent' | 'pending'
  ) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBookings(
  userId?: number,
  options: UseBookingsOptions = {}
): UseBookingsReturn {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { role, status, upcoming, autoFetch = true } = options;

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!targetUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      // In production, use: await bookingAPI.getUserBookings(targetUserId, { role, status, upcoming });
      const data = mockGetUserBookings(targetUserId, { role, status });

      // Filter by upcoming if needed
      let filteredData = data;
      if (upcoming) {
        const now = new Date();
        filteredData = data.filter(
          (booking) =>
            booking.activity &&
            new Date(booking.activity.start_time) >= now
        );
      }

      setBookings(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, role, status, upcoming]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [autoFetch, fetchBookings]);

  // Create booking
  const createBooking = useCallback(
    async (params: {
      activity_id: number;
      role: 'participant' | 'volunteer';
      booked_for_user_id?: number;
    }): Promise<Booking> => {
      if (!targetUserId) {
        throw new Error('User not authenticated');
      }

      setIsLoading(true);
      setError(null);

      try {
        // In production, use: await bookingAPI.createBooking({ ...params, user_id: targetUserId });
        const newBooking = mockCreateBooking({
          ...params,
          user_id: targetUserId,
        });

        // Refresh bookings
        await fetchBookings();

        return newBooking;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [targetUserId, fetchBookings]
  );

  // Cancel booking
  const cancelBooking = useCallback(
    async (bookingId: number): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // In production, use: await bookingAPI.cancelBooking(bookingId);
        const result = mockCancelBooking(bookingId);

        if (!result) {
          throw new Error('Booking not found');
        }

        // Refresh bookings
        await fetchBookings();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBookings]
  );

  // Check for booking conflicts
  const checkConflict = useCallback(
    async (activity: Activity): Promise<{
      hasConflict: boolean;
      conflictingBookings: BookingWithDetails[];
    }> => {
      if (!targetUserId) {
        return { hasConflict: false, conflictingBookings: [] };
      }

      try {
        // In production, use: await bookingAPI.checkConflict(...)
        return mockCheckConflict(
          targetUserId,
          activity.start_time,
          activity.end_time,
          activity.id
        );
      } catch (err) {
        console.error('Error checking conflict:', err);
        return { hasConflict: false, conflictingBookings: [] };
      }
    },
    [targetUserId]
  );

  // Update payment status
  const updatePaymentStatus = useCallback(
    async (bookingId: number, isPaid: boolean): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // In production, use: await bookingAPI.updatePaymentStatus(bookingId, isPaid);
        const result = mockUpdatePaymentStatus(bookingId, isPaid);

        if (!result) {
          throw new Error('Booking not found');
        }

        // Refresh bookings
        await fetchBookings();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBookings]
  );

  // Update attendance status
  const updateAttendanceStatus = useCallback(
    async (
      bookingId: number,
      status: 'attended' | 'absent' | 'pending'
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // In production, use: await bookingAPI.updateAttendanceStatus(bookingId, status);
        const result = mockUpdateAttendanceStatus(bookingId, status);

        if (!result) {
          throw new Error('Booking not found');
        }

        // Refresh bookings
        await fetchBookings();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update attendance status';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchBookings]
  );

  return {
    bookings,
    isLoading,
    error,
    createBooking,
    cancelBooking,
    checkConflict,
    updatePaymentStatus,
    updateAttendanceStatus,
    refresh: fetchBookings,
  };
}

/**
 * Hook to get bookings for a specific activity
 */
export function useActivityBookings(
  activityId: number,
  role?: 'participant' | 'volunteer'
) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, use: await bookingAPI.getActivityBookings(activityId, role);
      const { mockGetActivityBookings } = await import('../services/mockData');
      const data = mockGetActivityBookings(activityId, role);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity bookings');
      console.error('Error fetching activity bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activityId, role]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    isLoading,
    error,
    refresh: fetchBookings,
    participantCount: bookings.filter((b) => b.role === 'participant').length,
    volunteerCount: bookings.filter((b) => b.role === 'volunteer').length,
  };
}

/**
 * Hook to check if user is already booked for an activity
 */
export function useIsBooked(activityId: number, userId?: number) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  const { bookings } = useBookings(targetUserId, { status: 'active', autoFetch: true });

  const isBooked = bookings.some(
    (booking) =>
      booking.activity_id === activityId &&
      !booking.cancelled_at
  );

  const booking = bookings.find(
    (booking) =>
      booking.activity_id === activityId &&
      !booking.cancelled_at
  );

  return {
    isBooked,
    booking,
    role: booking?.role,
  };
}
