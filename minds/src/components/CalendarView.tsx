import { useState } from 'react';
import { ChevronLeft, ChevronRight, Accessibility, Ear } from 'lucide-react';
import { Activity } from '../types/activity';
import { useLanguage } from '../contexts/LanguageContext';

interface CalendarViewProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
  signedUpIds?: string[];
  userRole?: 'participant' | 'caregiver' | 'volunteer';
  showLegend?: boolean;
}

export default function CalendarView({ activities, onActivityClick, signedUpIds = [], userRole = 'participant', showLegend = true }: CalendarViewProps) {
  const { t, language } = useLanguage();
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

  const monthNames = language === 'zh' 
    ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = language === 'zh'
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthYearLabel = language === 'zh'
    ? `${year}年 ${monthNames[month]}`
    : `${monthNames[month]} ${year}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthYearLabel}
        </h2>
        <div className="flex items-center gap-6">
          {/* Color Legend */}
          {showLegend && (
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                <span className="text-sm font-semibold text-gray-700">{t('registered')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-gray-700">{t('slotsAvailable')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-semibold text-gray-700">{t('fullyBooked')}</span>
              </div>
            </div>
          )}
          
          {/* Month Navigation */}
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
                {dayActivities.slice(0, 2).map(activity => {
                  // Calculate vacancy based on user role
                  const participantVacancy = activity.participantCapacity - (activity.registeredParticipantsCount || 0);
                  const volunteerVacancy = activity.volunteerCapacity - (activity.registeredVolunteersCount || 0);
                  const vacancy = userRole === 'volunteer' ? volunteerVacancy : participantVacancy;
                  const isFull = vacancy <= 0;
                  
                  // Get title based on language
                  const displayTitle = language === 'zh' ? activity.titleChinese : activity.title;
                  
                  return (
                    <button
                      key={activity.id}
                      onClick={() => onActivityClick(activity)}
                      className={`w-full text-left px-2 py-2 rounded-lg text-sm font-semibold border-2 ${
                        signedUpIds.includes(activity.id)
                          ? 'bg-sky-500 text-white border-sky-700'
                          : isFull
                          ? 'bg-red-100 text-red-900 border-red-400'
                          : 'bg-green-100 text-green-900 border-green-400'
                      } hover:opacity-90 transition-all hover:scale-105`}
                      title={displayTitle}
                      aria-label={`Activity: ${displayTitle}`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="truncate leading-tight">{displayTitle}</span>
                        {(activity.wheelchairAccessible || activity.signLanguageSupport) && (
                          <div className="flex items-center gap-1 mt-0.5">
                            {activity.wheelchairAccessible && (
                              <div className="bg-white/90 rounded p-0.5" title="Wheelchair accessible">
                                <Accessibility className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={3} aria-label="Wheelchair accessible" />
                              </div>
                            )}
                            {activity.signLanguageSupport && (
                              <div className="bg-white/90 rounded p-0.5" title="Sign language available">
                                <Ear className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" strokeWidth={3} aria-label="Sign language available" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
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