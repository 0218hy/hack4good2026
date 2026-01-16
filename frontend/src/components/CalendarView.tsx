import { useState } from 'react';
import { ChevronLeft, ChevronRight, Accessibility, Ear } from 'lucide-react';
import { Activity } from '../types/activity';

interface CalendarViewProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
  signedUpIds?: string[];
}

export default function CalendarView({ activities, onActivityClick, signedUpIds = [] }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getActivitiesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter(activity => activity.date === dateStr);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayActivities = getActivitiesForDay(day);
          const isToday = 
            day === new Date().getDate() && 
            month === new Date().getMonth() && 
            year === new Date().getFullYear();

          return (
            <div
              key={day}
              className={`aspect-square border-2 rounded-lg p-1 ${
                isToday ? 'border-sky-500 bg-sky-50' : 'border-gray-200'
              }`}
            >
              <div className="text-sm font-semibold text-gray-900 mb-1">{day}</div>
              <div className="space-y-1">
                {dayActivities.slice(0, 2).map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => onActivityClick(activity)}
                    className={`w-full text-left px-1 py-0.5 rounded text-xs truncate ${
                      signedUpIds.includes(activity.id)
                        ? 'bg-sky-500 text-white'
                        : activity.participantVacancy === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    } hover:opacity-80 transition-opacity`}
                    title={activity.title}
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate">{activity.title}</span>
                      {activity.wheelchairAccessible && (
                        <Accessibility className="w-2.5 h-2.5 flex-shrink-0" />
                      )}
                      {activity.signLanguageSupport && (
                        <Ear className="w-2.5 h-2.5 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
                {dayActivities.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayActivities.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}