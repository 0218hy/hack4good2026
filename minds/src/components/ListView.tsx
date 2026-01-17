import { Activity } from '../types/activity';
import ActivityCard from './ActivityCard';
import { groupActivitiesByDate } from '../utils/activitySorting';
import { useLanguage } from '../contexts/LanguageContext';

interface ListViewProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
  signedUpIds: string[];
  userRole: 'participant' | 'caregiver' | 'volunteer' | 'staff';
  showLegend?: boolean;
  onSignUp?: (activity: Activity) => void;
  onCancel?: (activityId: string) => void;
}

export default function ListView({
  activities,
  onActivityClick,
  signedUpIds,
  userRole,
  showLegend = true,
  onSignUp,
  onCancel
}: ListViewProps) {
  const { t, language } = useLanguage();
  const groupedActivities = groupActivitiesByDate(activities, language);

  if (activities.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
        <p className="text-2xl text-gray-500">{t('noActivities')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedActivities.map((group) => (
        <div key={group.date}>
          {/* Date Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 border-b-4 border-sky-500 pb-3 inline-block">
              {group.dateLabel}
            </h3>
          </div>

          {/* Activity Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onViewDetails={onActivityClick}
                onSignUp={onSignUp}
                onCancel={onCancel}
                showSignUpButton={userRole === 'participant' || userRole === 'caregiver'}
                signedUp={signedUpIds.includes(activity.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}