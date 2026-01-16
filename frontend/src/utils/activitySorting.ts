import { Activity } from '../types/activity';

export function sortActivitiesByDateTime(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => {
    // First, compare dates
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // If dates are the same, compare start times
    // Extract start time from time string (e.g., "10:00 AM - 12:00 PM")
    const getStartTime = (timeStr: string) => {
      const startTimeStr = timeStr.split('-')[0].trim();
      return parseTimeString(startTimeStr);
    };
    
    return getStartTime(a.time) - getStartTime(b.time);
  });
}

function parseTimeString(timeStr: string): number {
  // Parse time string like "10:00 AM" or "2:00 PM" into minutes since midnight
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

export function groupActivitiesByDate(activities: Activity[]): { date: string; dateLabel: string; activities: Activity[] }[] {
  const sorted = sortActivitiesByDateTime(activities);
  const groups: { [key: string]: Activity[] } = {};
  
  sorted.forEach(activity => {
    if (!groups[activity.date]) {
      groups[activity.date] = [];
    }
    groups[activity.date].push(activity);
  });
  
  return Object.keys(groups).map(date => ({
    date,
    dateLabel: formatDateLabel(date),
    activities: groups[date]
  }));
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
