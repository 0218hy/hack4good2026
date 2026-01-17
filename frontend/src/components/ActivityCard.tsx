import { Clock, MapPin, Accessibility, Ear, DollarSign } from 'lucide-react';
import { Activity } from '../types/activity';

interface ActivityCardProps {
  activity: Activity;
  onViewDetails: (activity: Activity) => void;
  onSignUp?: (activity: Activity) => void;
  showSignUpButton?: boolean;
  signedUp?: boolean;
}

export default function ActivityCard({ 
  activity, 
  onViewDetails, 
  onSignUp,
  showSignUpButton = true,
  signedUp = false 
}: ActivityCardProps) {
  // Calculate participant vacancy on the fly
  const participantVacancy = activity.participantCapacity - (activity.registeredParticipantsCount || 0);
  const isParticipantFull = participantVacancy <= 0;
  const isDeadlinePassed = new Date(activity.signupDeadline) < new Date();
  const canSignUp = !isParticipantFull && !isDeadlinePassed && !signedUp;
  
  const getStatus = () => {
    if (isParticipantFull) return 'FULL';
    if (isDeadlinePassed) return 'CLOSED';
    return 'OPEN';
  };
  
  const status = getStatus();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col h-full">
      <div className="relative p-8 pb-4">
        <div className="pr-20">
          <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
            {activity.title}
          </h3>
        </div>
        
        <div className="absolute top-8 right-8 flex gap-2">
          {activity.wheelchairAccessible && (
            <div className="bg-blue-100 p-2.5 rounded-xl" title="Wheelchair accessible">
              <Accessibility className="w-6 h-6 text-blue-600" />
            </div>
          )}
          {activity.signLanguageSupport && (
            <div className="bg-purple-100 p-2.5 rounded-xl" title="Sign language support">
              <Ear className="w-6 h-6 text-purple-600" />
            </div>
          )}
        </div>
      </div>

      <div className="px-8 flex-1 flex flex-col">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700 text-base h-6">
            <Clock className="w-5 h-5 text-sky-500 flex-shrink-0" />
            <span>{activity.time}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 text-base h-6">
            <MapPin className="w-5 h-5 text-sky-500 flex-shrink-0" />
            <span className="truncate">{activity.venue}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] items-start">
          <span className={`px-4 py-2 rounded-full text-base font-bold ${
            status === 'OPEN' ? 'bg-green-100 text-green-700' :
            status === 'FULL' ? 'bg-red-100 text-red-700' :
            'bg-gray-200 text-gray-700'
          }`}>
            {status}
          </span>
          {activity.paymentRequired && (
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-base font-bold flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${activity.paymentAmount}
            </span>
          )}
          {signedUp && (
            <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-base font-bold">
              SIGNED UP
            </span>
          )}
        </div>
        
        <div className="flex-1"></div>
      </div>

      <div className="p-8 pt-0">
        <div className="flex gap-4">
          <button
            onClick={() => onViewDetails(activity)}
            className="flex-1 bg-white text-sky-600 border-2 border-sky-500 py-3 px-6 rounded-xl text-base font-bold hover:bg-sky-50 transition-colors"
          >
            View Details
          </button>
          {showSignUpButton && onSignUp && (
            <button
              onClick={() => onSignUp(activity)}
              disabled={!canSignUp}
              className={`flex-1 py-3 px-6 rounded-xl text-base font-bold transition-colors ${
                canSignUp
                  ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {signedUp ? 'Signed Up' : status === 'FULL' ? 'Full' : status === 'CLOSED' ? 'Closed' : 'Sign Up'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}