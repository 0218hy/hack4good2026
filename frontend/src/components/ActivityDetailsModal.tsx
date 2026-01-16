import { X, Calendar, Clock, MapPin, AlertCircle, Accessibility, Ear, DollarSign, User, Phone, Repeat } from 'lucide-react';
import { Activity } from '../types/activity';
import { getRecurrenceLabel } from '../utils/recurringActivities';

interface ActivityDetailsModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: (activity: Activity) => void;
  signedUp?: boolean;
}

export default function ActivityDetailsModal({ 
  activity, 
  isOpen, 
  onClose, 
  onSignUp,
  signedUp = false 
}: ActivityDetailsModalProps) {
  if (!isOpen || !activity) return null;

  const isParticipantFull = activity.participantVacancy === 0;
  const isDeadlinePassed = new Date(activity.signupDeadline) < new Date();
  const canSignUp = !isParticipantFull && !isDeadlinePassed && !signedUp;
  
  const getStatus = () => {
    if (isParticipantFull) return 'FULL';
    if (isDeadlinePassed) return 'CLOSED';
    return 'OPEN';
  };
  
  const status = getStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-8 flex justify-between items-start">
          <h2 className="text-3xl font-bold text-gray-900">{activity.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="p-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 text-gray-700 text-lg">
              <Calendar className="w-6 h-6 text-sky-500" />
              <span className="font-semibold">
                {new Date(activity.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 text-lg">
              <Clock className="w-6 h-6 text-sky-500" />
              <span>{activity.time}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 text-lg">
              <MapPin className="w-6 h-6 text-sky-500" />
              <span>{activity.venue}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-700 text-lg">
              <AlertCircle className="w-6 h-6 text-sky-500" />
              <span>Sign up by {new Date(activity.signupDeadline).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Volunteer Job Scope */}
          <div className="bg-sky-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Volunteer Job Scope / Responsibilities</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {activity.jobScope || 'Volunteer job scope will be updated soon.'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{activity.description}</p>
            {(activity.repeatFrequency && activity.repeatFrequency !== 'none') && (
              <div className="flex items-start gap-2 mt-4 text-sky-700 bg-sky-50 px-4 py-3 rounded-lg">
                <Repeat className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  {activity.isRecurringInstance && (
                    <span className="text-base font-semibold mb-1">
                      This is part of a recurring series
                    </span>
                  )}
                  <span className="text-base">
                    {getRecurrenceLabel(activity)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility Features</h3>
            <div className="flex flex-wrap gap-4">
              {activity.wheelchairAccessible && (
                <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-xl">
                  <Accessibility className="w-6 h-6 text-blue-600" />
                  <span className="text-blue-900 font-bold text-base">Wheelchair Accessible</span>
                </div>
              )}
              {activity.signLanguageSupport && (
                <div className="flex items-center gap-3 bg-purple-50 px-5 py-3 rounded-xl">
                  <Ear className="w-6 h-6 text-purple-600" />
                  <span className="text-purple-900 font-bold text-base">Sign Language Support</span>
                </div>
              )}
              {!activity.wheelchairAccessible && !activity.signLanguageSupport && (
                <p className="text-gray-500 text-base">No special accessibility features listed</p>
              )}
            </div>
          </div>

          {activity.paymentRequired && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-6 h-6 text-yellow-700" />
                <h3 className="text-xl font-bold text-yellow-900">Payment Information</h3>
              </div>
              <p className="text-lg text-yellow-800">
                Upfront payment of ${activity.paymentAmount} at start of event required.
              </p>
            </div>
          )}

          {/* Staff Contact */}
          <div className="bg-sky-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Staff Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700 text-lg">
                <User className="w-5 h-5 text-sky-500" />
                <span><strong>Staff in charge:</strong> {activity.staffInCharge}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 text-lg">
                <Phone className="w-5 h-5 text-sky-500" />
                <span><strong>Contact:</strong> {activity.staffContactNumber}</span>
              </div>
            </div>
          </div>

          {activity.specialInstructions && (
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Special Instructions</h3>
              <p className="text-lg text-gray-700">{activity.specialInstructions}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 px-8 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {onSignUp && (
              <button
                onClick={() => {
                  onSignUp(activity);
                  onClose();
                }}
                disabled={!canSignUp}
                className={`flex-1 py-4 px-8 rounded-xl text-lg font-bold transition-colors ${
                  canSignUp
                    ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {signedUp ? 'Already Signed Up' : status === 'FULL' ? 'Full' : status === 'CLOSED' ? 'Closed' : 'Sign Up'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}