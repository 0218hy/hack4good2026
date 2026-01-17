import { Clock, MapPin, Accessibility, Ear, DollarSign, Info, CheckCircle, X } from 'lucide-react';
import { Activity } from '../types/activity';
import { useLanguage } from '../contexts/LanguageContext';

interface ActivityCardProps {
  activity: Activity;
  onViewDetails: (activity: Activity) => void;
  onSignUp?: (activity: Activity) => void;
  onCancel?: (activityId: string) => void;
  showSignUpButton?: boolean;
  signedUp?: boolean;
}

export default function ActivityCard({ 
  activity, 
  onViewDetails, 
  onSignUp,
  onCancel,
  showSignUpButton = true,
  signedUp = false 
}: ActivityCardProps) {
  const { t, language } = useLanguage();
  
  // Calculate participant vacancy on the fly
  const participantVacancy = activity.participant_capacity - (activity.registered_participants_count || 0);
  const isParticipantFull = participantVacancy <= 0;
  const isDeadlinePassed = new Date(activity.signup_deadline) < new Date();
  const canSignUp = !isParticipantFull && !isDeadlinePassed && !signedUp;
  
  const getStatus = () => {
    if (isParticipantFull) return t('full');
    if (isDeadlinePassed) return t('closed');
    return t('open');
  };
  
  const status = getStatus();
  
  // Get title and venue based on language
  const displayTitle = language === 'zh' ? activity.titleChinese : activity.title;
  const displayVenue = language === 'zh' ? activity.venueChinese : activity.venue;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col h-full">
      {/* Title Section */}
      <div className="p-8 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {displayTitle}
        </h3>
        
        {/* Accessibility badges below title */}
        {(activity.wheelchair_accessible || activity.signLanguageSupport) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activity.wheelchair_accessible && (
              <div 
                className="bg-blue-100 px-3 py-2 rounded-xl flex items-center gap-2 border-2 border-blue-600" 
                title="Wheelchair accessible"
                aria-label="Wheelchair accessible"
              >
                <Accessibility className="w-7 h-7 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm font-bold text-blue-900 whitespace-nowrap">{t('wheelchairOk')}</span>
              </div>
            )}
            {activity.signLanguageSupport && (
              <div 
                className="bg-purple-100 px-3 py-2 rounded-xl flex items-center gap-2 border-2 border-purple-600" 
                title="Sign language support"
                aria-label="Sign language support available"
              >
                <Ear className="w-7 h-7 text-purple-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm font-bold text-purple-900 whitespace-nowrap">{t('signLanguage')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-8 flex-1 flex flex-col">
        {/* Time and Location with larger icons and better spacing */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4 text-gray-700 text-lg">
            <div className="bg-sky-100 p-2 rounded-lg">
              <Clock className="w-7 h-7 text-sky-600 flex-shrink-0" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase">{t('time')}</div>
              <span className="font-semibold">{activity.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-700 text-lg">
            <div className="bg-sky-100 p-2 rounded-lg">
              <MapPin className="w-7 h-7 text-sky-600 flex-shrink-0" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-500 uppercase">{t('location')}</div>
              <span className="font-semibold truncate block">{displayVenue}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] items-start">
          <span className={`px-4 py-2 rounded-full text-base font-bold ${
            status === t('open') ? 'bg-green-100 text-green-700' :
            status === t('full') ? 'bg-red-100 text-red-700' :
            'bg-gray-200 text-gray-700'
          }`}>
            {status}
          </span>
          {activity.paymentRequired && (
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-base font-bold flex items-center gap-2 border-2 border-yellow-400">
              <DollarSign className="w-5 h-5" />
              ${activity.paymentAmount}
            </span>
          )}
          {signedUp && (
            <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-base font-bold">
              {t('registered')}
            </span>
          )}
        </div>
        
        <div className="flex-1"></div>
      </div>

      <div className="p-8 pt-0">
        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onViewDetails(activity)}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-4 px-5 rounded-xl text-base font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
            aria-label={`View details for ${displayTitle}`}
          >
            <Info className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
            <span className="text-center leading-tight">
              View Details<br />查看详情
            </span>
          </button>
          {showSignUpButton && !signedUp && (
            <button
              onClick={() => onSignUp?.(activity)}
              disabled={!canSignUp}
              className={`flex-1 py-4 px-5 rounded-xl text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                canSignUp
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              aria-label={`Sign up for ${displayTitle}`}
            >
              <CheckCircle className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-center leading-tight">
                Sign Up<br />报名
              </span>
            </button>
          )}
          {showSignUpButton && signedUp && (
            <button
              onClick={() => onCancel?.(activity.id)}
              className="flex-1 py-4 px-5 rounded-xl text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
              aria-label={`Cancel registration for ${displayTitle}`}
            >
              <X className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-center leading-tight">
                Cancel<br />取消
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}