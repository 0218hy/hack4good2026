import { useState } from 'react';
import { X } from 'lucide-react';
import { Activity } from '../types/activity';
import { detectScheduleConflict } from '../utils/conflictDetection';
import ConflictModal from './ConflictModal';

interface SignupConfirmationModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (caregiverData: { accompanying: boolean; name?: string; contact?: string }) => void;
  registeredActivities: Activity[];
  onViewSchedule: () => void;
}

export default function SignupConfirmationModal({ 
  activity, 
  isOpen, 
  onClose, 
  onConfirm,
  registeredActivities,
  onViewSchedule
}: SignupConfirmationModalProps) {
  const [caregiverAccompanying, setCaregiverAccompanying] = useState(false);
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverContact, setCaregiverContact] = useState('');
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictingActivity, setConflictingActivity] = useState<Activity | null>(null);

  if (!isOpen || !activity) return null;

  const handleConfirm = () => {
    // Check for schedule conflicts
    const conflict = detectScheduleConflict(activity, registeredActivities);
    
    if (conflict) {
      setConflictingActivity(conflict);
      setShowConflictModal(true);
      return;
    }

    // No conflict, proceed with signup
    onConfirm({
      accompanying: caregiverAccompanying,
      name: caregiverAccompanying ? caregiverName : undefined,
      contact: caregiverAccompanying ? caregiverContact : undefined
    });
    
    // Reset form
    setCaregiverAccompanying(false);
    setCaregiverName('');
    setCaregiverContact('');
  };

  const handleConflictClose = () => {
    setShowConflictModal(false);
    setConflictingActivity(null);
  };

  const handleViewSchedule = () => {
    setShowConflictModal(false);
    setConflictingActivity(null);
    onClose();
    onViewSchedule();
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
          <div className="border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Confirm Sign-up</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-sky-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{activity.title}</h3>
              <p className="text-gray-700">
                {new Date(activity.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-gray-700">{activity.time}</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caregiverAccompanying}
                  onChange={(e) => setCaregiverAccompanying(e.target.checked)}
                  className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500 mt-1"
                />
                <span className="text-lg font-semibold text-gray-900">Caregiver accompanying?</span>
              </label>

              {caregiverAccompanying && (
                <div className="ml-8 space-y-4 pt-4">
                  <div>
                    <label htmlFor="caregiverName" className="block text-base font-semibold text-gray-700 mb-2">
                      Caregiver Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="caregiverName"
                      value={caregiverName}
                      onChange={(e) => setCaregiverName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                      placeholder="Enter caregiver name"
                    />
                  </div>

                  <div>
                    <label htmlFor="caregiverContact" className="block text-base font-semibold text-gray-700 mb-2">
                      Caregiver Contact Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="caregiverContact"
                      value={caregiverContact}
                      onChange={(e) => setCaregiverContact(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                      placeholder="+65 1234 5678"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 p-6 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-sky-500 text-white py-4 rounded-xl text-lg font-bold hover:bg-sky-600 transition-colors shadow-lg"
            >
              Confirm Sign-up
            </button>
          </div>
        </div>
      </div>

      {/* Conflict Modal */}
      {conflictingActivity && (
        <ConflictModal
          isOpen={showConflictModal}
          onClose={handleConflictClose}
          conflictingActivity={conflictingActivity}
          onViewSchedule={handleViewSchedule}
        />
      )}
    </>
  );
}