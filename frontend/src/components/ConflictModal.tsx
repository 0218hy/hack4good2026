import { X, AlertCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { Activity } from '../types/activity';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflictingActivity: Activity;
  onViewSchedule: () => void;
}

export default function ConflictModal({
  isOpen,
  onClose,
  conflictingActivity,
  onViewSchedule
}: ConflictModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Schedule Conflict</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
            <p className="text-lg font-semibold text-red-900 mb-2">
              You are already registered for another activity during this time.
            </p>
            <p className="text-base text-red-700">
              Please cancel your existing registration or choose a different activity.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Conflicting Activity:</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xl font-bold text-gray-900">{conflictingActivity.title}</p>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-base text-gray-700">
                    {new Date(conflictingActivity.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-base text-gray-700">{conflictingActivity.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-base text-gray-700">{conflictingActivity.venue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onViewSchedule}
            className="flex-1 bg-sky-500 text-white py-4 rounded-xl text-lg font-bold hover:bg-sky-600 transition-colors shadow-lg"
          >
            View My Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
