import { X, Calendar, Clock, MapPin, AlertCircle, Accessibility, Ear, DollarSign, User, Phone, Repeat } from 'lucide-react';
import { Activity } from '../types/activity';
import { getRecurrenceLabel } from '../utils/recurringActivities';

/**
 * ActivityDetailsModal - Displays detailed activity information
 * 
 * VOLUNTEER CAPACITY TRACKING - SINGLE SOURCE OF TRUTH:
 * ======================================================
 * This modal ensures consistent volunteer capacity display by:
 * 
 * 1. Using ONLY these two fields from Activity:
 *    - volunteerCapacity: Total volunteer slots (set by staff)
 *    - registeredVolunteersCount: Current volunteer signups
 * 
 * 2. Computing status dynamically:
 *    - volunteerVacancy = volunteerCapacity - registeredVolunteersCount
 *    - isVolunteerFull = volunteerVacancy <= 0
 * 
 * 3. Always fetching fresh data:
 *    - Receives allActivities array to get latest state
 *    - Prevents stale data from showing incorrect counts
 * 
 * 4. Displaying consistently:
 *    - Shows: "X / Y" (registeredVolunteersCount / volunteerCapacity)
 *    - Shows: "(Z slots remaining)" where Z = volunteerVacancy
 *    - Status badge: FULL when volunteerVacancy <= 0, else OPEN
 */

interface ActivityDetailsModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: (activity: Activity) => void;
  signedUp?: boolean;
  userRole?: 'participant' | 'caregiver' | 'volunteer' | 'staff';
  allActivities?: Activity[]; // NEW: Pass all activities to always get fresh data
}

export default function ActivityDetailsModal({ 
  activity, 
  isOpen, 
  onClose, 
  onSignUp,
  signedUp = false,
  userRole,
  allActivities
}: ActivityDetailsModalProps) {
  if (!isOpen || !activity) return null;

  // CRITICAL: Always get the latest activity state from the activities array
  // This prevents showing stale data when registrations change
  const currentActivity = allActivities?.find(a => a.id === activity.id) || activity;

  // Calculate real-time vacancy from capacity and count using ONLY these two fields
  const participantVacancy = currentActivity.participantCapacity - (currentActivity.registeredParticipantsCount || 0);
  const volunteerVacancy = currentActivity.volunteerCapacity - (currentActivity.registeredVolunteersCount || 0);
  
  // Determine which vacancy to check based on user role
  const isParticipantOrCaregiver = userRole === 'participant' || userRole === 'caregiver';
  const isVolunteer = userRole === 'volunteer';
  
  // Check if FULL based on user role - single source of truth
  const isRoleFull = isVolunteer 
    ? volunteerVacancy <= 0
    : participantVacancy <= 0;
  
  const isDeadlinePassed = new Date(currentActivity.signupDeadline) < new Date();
  const canSignUp = !isRoleFull && !isDeadlinePassed && !signedUp;
  
  const getStatus = () => {
    if (isRoleFull) return 'FULL';
    if (isDeadlinePassed) return 'CLOSED';
    return 'OPEN';
  };
  
  const status = getStatus();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-8 flex justify-between items-start z-10 flex-shrink-0">
          <div className="flex-1 pr-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h2>
            <h3 className="text-2xl font-semibold text-gray-700">{activity.titleChinese}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pb-6">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-gray-700 text-lg">
                <Calendar className="w-6 h-6 text-sky-500 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {new Date(activity.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="font-semibold text-gray-600">
                    {new Date(activity.date).toLocaleDateString('zh-CN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-700 text-lg">
                <Clock className="w-6 h-6 text-sky-500 flex-shrink-0" />
                <span>Time 时间: {activity.time}</span>
              </div>
              <div className="flex items-start gap-4 text-gray-700 text-lg">
                <MapPin className="w-6 h-6 text-sky-500 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Venue 地点: {activity.venue}</span>
                  {activity.venueChinese && (
                    <span className="text-gray-600">{activity.venueChinese}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-700 text-lg">
                <AlertCircle className="w-6 h-6 text-sky-500 flex-shrink-0" />
                <span>Sign up by 报名截止日期: {new Date(activity.signupDeadline).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Vacancy Information */}
            <div className={`grid gap-4 mb-8 ${
              userRole === 'staff' ? 'grid-cols-2' : 'grid-cols-1'
            }`}>
              {/* Participants Vacancy - show for participants, caregivers, and staff */}
              {(userRole === 'participant' || userRole === 'caregiver' || userRole === 'staff' || !userRole) && (
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-200 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-sky-900 mb-2">PARTICIPANTS 参与者</h4>
                  {currentActivity.participantCapacity && currentActivity.participantCapacity > 0 ? (
                    <>
                      <div className="text-2xl font-bold text-sky-700 mb-1">
                        {currentActivity.registeredParticipantsCount || 0} / {currentActivity.participantCapacity}
                      </div>
                      <div className="text-base font-semibold text-sky-600">
                        ({participantVacancy} slot{participantVacancy !== 1 ? 's' : ''} remaining 剩余名额)
                      </div>
                    </>
                  ) : (
                    <div className="text-base font-semibold text-gray-500">Not required 不需要</div>
                  )}
                </div>
              )}
              
              {/* Volunteers Vacancy - show for volunteers and staff only */}
              {(userRole === 'volunteer' || userRole === 'staff' || !userRole) && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-green-900 mb-2">VOLUNTEERS 志愿者</h4>
                  {currentActivity.volunteerCapacity && currentActivity.volunteerCapacity > 0 ? (
                    <>
                      <div className="text-2xl font-bold text-green-700 mb-1">
                        {currentActivity.registeredVolunteersCount || 0} / {currentActivity.volunteerCapacity}
                      </div>
                      <div className="text-base font-semibold text-green-600">
                        ({volunteerVacancy} slot{volunteerVacancy !== 1 ? 's' : ''} remaining 剩余名额)
                      </div>
                    </>
                  ) : (
                    <div className="text-base font-semibold text-gray-500">Not required 不需要</div>
                  )}
                </div>
              )}
            </div>

            {/* Volunteer Job Scope - only show for volunteers */}
            {userRole === 'volunteer' && (
              <div className="bg-sky-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Volunteer Job Scope / Responsibilities 志愿者工作范围/职责</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {activity.jobScope || 'Volunteer job scope will be updated soon.'}
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Description 描述</h3>
              <p className="text-lg text-gray-700 leading-relaxed">{activity.description}</p>
              {(activity.repeatFrequency && activity.repeatFrequency !== 'none') && (
                <div className="flex items-start gap-2 mt-4 text-sky-700 bg-sky-50 px-4 py-3 rounded-lg">
                  <Repeat className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    {activity.isRecurringInstance && (
                      <span className="text-base font-semibold mb-1">
                        This is part of a recurring series 这是定期活动系列的一部分
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility Features 无障碍设施</h3>
              <div className="flex flex-wrap gap-4">
                {activity.wheelchairAccessible && (
                  <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-xl">
                    <Accessibility className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-900 font-bold text-base">Wheelchair Accessible 轮椅通道</span>
                  </div>
                )}
                {activity.signLanguageSupport && (
                  <div className="flex items-center gap-3 bg-purple-50 px-5 py-3 rounded-xl">
                    <Ear className="w-6 h-6 text-purple-600" />
                    <span className="text-purple-900 font-bold text-base">Sign Language Support 手语支持</span>
                  </div>
                )}
                {!activity.wheelchairAccessible && !activity.signLanguageSupport && (
                  <p className="text-gray-500 text-base">No special accessibility features listed 无特殊无障碍设施</p>
                )}
              </div>
            </div>

            {/* Payment Information - only show for participants and caregivers */}
            {activity.paymentRequired && (userRole === 'participant' || userRole === 'caregiver') && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-6 h-6 text-yellow-700" />
                  <h3 className="text-xl font-bold text-yellow-900">Payment Information 付款信息</h3>
                </div>
                <p className="text-lg text-yellow-800">
                  Upfront payment of ${activity.paymentAmount} at start of event required.
                </p>
                <p className="text-lg text-yellow-800">
                  活动开始时需预付 ${activity.paymentAmount}。
                </p>
              </div>
            )}

            <div className="bg-sky-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Staff Contact 工作人员联系方式</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <User className="w-5 h-5 text-sky-500" />
                  <span><strong>Staff in charge 负责工作人员:</strong> {activity.staffInCharge}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-lg">
                  <Phone className="w-5 h-5 text-sky-500" />
                  <span><strong>Contact 联系电话:</strong> {activity.staffContactNumber}</span>
                </div>
              </div>
            </div>

            {activity.specialInstructions && (
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Special Instructions 特别说明</h3>
                <p className="text-lg text-gray-700">{activity.specialInstructions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-t-2 border-gray-200 p-6 shadow-lg flex-shrink-0">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 px-8 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Close 关闭
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
                {signedUp ? 'Already Signed Up 已报名' : status === 'FULL' ? 'Fully Booked 已满额' : status === 'CLOSED' ? 'Closed 已关闭' : 'Sign Up 报名'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}