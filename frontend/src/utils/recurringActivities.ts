import { Activity } from '../types/activity';

export function generateRecurringActivities(baseActivity: Activity): Activity[] {
  // If not a recurring activity, return just the base activity
  if (!baseActivity.repeatFrequency || baseActivity.repeatFrequency === 'none' || !baseActivity.repeatEndDate) {
    return [baseActivity];
  }

  const activities: Activity[] = [baseActivity];
  const startDate = new Date(baseActivity.date);
  const endDate = new Date(baseActivity.repeatEndDate);

  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    // Calculate next date based on frequency
    switch (baseActivity.repeatFrequency) {
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }

    // Only add if still within range
    if (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Calculate signup deadline (same days before as original)
      const originalDate = new Date(baseActivity.date);
      const originalDeadline = new Date(baseActivity.signupDeadline);
      const daysBefore = Math.floor((originalDate.getTime() - originalDeadline.getTime()) / (1000 * 60 * 60 * 24));
      
      const newDeadline = new Date(currentDate);
      newDeadline.setDate(newDeadline.getDate() - daysBefore);
      const deadlineStr = newDeadline.toISOString().split('T')[0];

      const recurringActivity: Activity = {
        ...baseActivity,
        id: `${baseActivity.id}-${currentDate.getTime()}`,
        date: dateStr,
        signupDeadline: deadlineStr,
        isRecurringInstance: true,
        parentActivityId: baseActivity.id,
        // Reset registration counts for new instances with safe defaults
        registeredParticipantsCount: 0,
        registeredVolunteersCount: 0,
        // Recalculate vacancy based on capacity with safe defaults
        participantCapacity: baseActivity.participantCapacity || 0,
        volunteerCapacity: baseActivity.volunteerCapacity || 0,
        participantVacancy: baseActivity.participantCapacity || 0,
        volunteerVacancy: baseActivity.volunteerCapacity || 0,
      };

      activities.push(recurringActivity);
    }
  }

  return activities;
}

export function getAllActivitiesWithRecurring(baseActivities: Activity[]): Activity[] {
  const allActivities: Activity[] = [];
  
  baseActivities.forEach(activity => {
    const generatedActivities = generateRecurringActivities(activity);
    allActivities.push(...generatedActivities);
  });

  return allActivities;
}

export function getRecurrenceLabel(activity: Activity): string {
  if (!activity.repeatFrequency || activity.repeatFrequency === 'none') {
    return 'One-time event';
  }

  const frequencyMap = {
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly'
  };

  const frequency = frequencyMap[activity.repeatFrequency];
  const startDate = new Date(activity.date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const endDate = activity.repeatEndDate 
    ? new Date(activity.repeatEndDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'Ongoing';

  return `Recurring ${frequency.toLowerCase()} from ${startDate} to ${endDate}`;
}