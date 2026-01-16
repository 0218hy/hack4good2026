import { Activity } from '../types/activity';

/**
 * Parses a time string like "10:00 AM - 12:00 PM" and returns start and end times in minutes since midnight
 */
function parseTimeRange(timeString: string): { start: number; end: number } | null {
  try {
    const parts = timeString.split(' - ');
    if (parts.length !== 2) return null;

    const parseTime = (time: string): number => {
      const [timePart, period] = time.trim().split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }
      
      return hour24 * 60 + minutes;
    };

    return {
      start: parseTime(parts[0]),
      end: parseTime(parts[1])
    };
  } catch (error) {
    console.error('Error parsing time range:', timeString, error);
    return null;
  }
}

/**
 * Checks if two time ranges overlap
 * Conflict if: newStart < existingEnd AND newEnd > existingStart
 */
function doTimesOverlap(
  newTime: { start: number; end: number },
  existingTime: { start: number; end: number }
): boolean {
  return newTime.start < existingTime.end && newTime.end > existingTime.start;
}

/**
 * Checks if there's a schedule conflict for a user trying to sign up for an activity
 * @param newActivity - The activity the user wants to sign up for
 * @param registeredActivities - Activities the user is already registered for
 * @returns The conflicting activity if found, null otherwise
 */
export function detectScheduleConflict(
  newActivity: Activity,
  registeredActivities: Activity[]
): Activity | null {
  // Parse the new activity's time range
  const newTimeRange = parseTimeRange(newActivity.time);
  if (!newTimeRange) {
    console.error('Could not parse time range for new activity:', newActivity.time);
    return null;
  }

  // Check against each registered activity
  for (const existingActivity of registeredActivities) {
    // Only check activities on the same date
    if (existingActivity.date !== newActivity.date) {
      continue;
    }

    // Parse the existing activity's time range
    const existingTimeRange = parseTimeRange(existingActivity.time);
    if (!existingTimeRange) {
      console.error('Could not parse time range for existing activity:', existingActivity.time);
      continue;
    }

    // Check for time overlap
    if (doTimesOverlap(newTimeRange, existingTimeRange)) {
      return existingActivity;
    }
  }

  return null;
}
