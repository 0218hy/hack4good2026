import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, LogOut, Search, Filter, List, Calendar, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../types/activity';
import ActivityCard from './ActivityCard';
import ActivityDetailsModal from './ActivityDetailsModal';
import FilterModal from './FilterModal';
import CalendarView from './CalendarView';
import SignupConfirmationModal from './SignupConfirmationModal';
import { groupActivitiesByDate } from '../utils/activitySorting';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';

interface CaregiverDashboardProps {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

export default function CaregiverDashboard({ activities }: CaregiverDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'browse' | 'care-schedule'>('browse');
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [careReceiverSignups, setCareReceiverSignups] = useState<string[]>([]);
  const [showManageNeedsModal, setShowManageNeedsModal] = useState(false);
  
  const [careReceiverNeeds, setCareReceiverNeeds] = useState({
    wheelchairBound: true,
    signLanguage: false,
    otherNeeds: 'Requires assistance with mobility'
  });

  const [filters, setFilters] = useState({
    eligibleOnly: false,
    wheelchairAccessible: false,
    signLanguageSupport: false,
    paymentRequired: 'all' as 'all' | 'free' | 'paid',
    availableOnly: false,
    repeatability: 'all' as 'all' | 'one-time' | 'weekly' | 'biweekly' | 'monthly'
  });

  // Set calendar as default view when on care schedule tab
  useEffect(() => {
    if (activeTab === 'care-schedule') {
      setView('calendar');
    } else {
      setView('list');
    }
  }, [activeTab]);

  const handleSignUpClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowSignupModal(true);
  };

  const handleConfirmSignup = (caregiverData: any) => {
    if (selectedActivity) {
      setCareReceiverSignups([...careReceiverSignups, selectedActivity.id]);
    }
    setShowSignupModal(false);
    setSelectedActivity(null);
  };

  const handleCancelSignup = (activityId: string) => {
    setCareReceiverSignups(careReceiverSignups.filter(id => id !== activityId));
  };

  const filteredActivities = activities.filter(activity => {
    if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.wheelchairAccessible && !activity.wheelchairAccessible) {
      return false;
    }
    if (filters.signLanguageSupport && !activity.signLanguageSupport) {
      return false;
    }
    if (filters.paymentRequired === 'free' && activity.paymentRequired) {
      return false;
    }
    if (filters.paymentRequired === 'paid' && !activity.paymentRequired) {
      return false;
    }
    if (filters.availableOnly && activity.participantVacancy === 0) {
      return false;
    }
    // Repeatability filter
    if (filters.repeatability !== 'all') {
      if (filters.repeatability === 'one-time') {
        // Show only non-recurring activities
        if (activity.repeatFrequency) {
          return false;
        }
      } else {
        // Show only activities matching the specific frequency
        if (activity.repeatFrequency !== filters.repeatability) {
          return false;
        }
      }
    }
    return true;
  });

  const careSchedule = activities.filter(activity => 
    careReceiverSignups.includes(activity.id)
  );

  const activitiesToShow = activeTab === 'browse' ? filteredActivities : careSchedule;

  const handleViewSchedule = () => {
    setActiveTab('care-schedule');
    setView('calendar');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Activity Hub Logo" className="h-10" />
              <span className="text-3xl font-bold text-gray-900">Activity Hub</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-lg font-semibold text-gray-700">Caregiver Dashboard</span>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-lg text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-6 h-6" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Care Receiver Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Care Receiver: John Doe</h2>
              <div className="text-gray-600 space-y-2 text-lg">
                <p><strong>Email:</strong> john.doe@example.com</p>
                <p><strong>Needs:</strong> {careReceiverNeeds.wheelchairBound && 'Wheelchair-bound, '}
                  {careReceiverNeeds.signLanguage && 'Sign language support, '}
                  {careReceiverNeeds.otherNeeds}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowManageNeedsModal(true)}
              className="px-6 py-3 bg-sky-500 text-white rounded-xl text-base font-bold hover:bg-sky-600 transition-colors flex items-center gap-2 shadow-md"
            >
              <UserPlus className="w-6 h-6" />
              Manage Needs
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-5 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-md ${
              activeTab === 'browse'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Browse Activities
          </button>
          <button
            onClick={handleViewSchedule}
            className={`px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-md ${
              activeTab === 'care-schedule'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Care Receiver's Schedule ({careReceiverSignups.length})
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 flex gap-3">
              <button
                onClick={() => setView('list')}
                className={`px-6 py-3 rounded-xl text-base font-bold transition-colors flex items-center gap-2 ${
                  view === 'list'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-6 h-6" />
                List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-6 py-3 rounded-xl text-base font-bold transition-colors flex items-center gap-2 ${
                  view === 'calendar'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-6 h-6" />
                Calendar
              </button>
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-3 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
              />
            </div>

            <button
              onClick={() => setShowFilterModal(true)}
              className="px-8 py-3 bg-white border-2 border-gray-300 rounded-xl text-base font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-6 h-6" />
              Filters
            </button>
          </div>
        </div>

        {/* Activities Display */}
        {view === 'calendar' ? (
          <CalendarView
            activities={activitiesToShow}
            onActivityClick={(activity) => {
              setSelectedActivity(activity);
              setShowDetailsModal(true);
            }}
            signedUpIds={careReceiverSignups}
          />
        ) : (
          <div className="space-y-8">
            {groupActivitiesByDate(activitiesToShow).map((group) => (
              <div key={group.date}>
                {/* Date Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b-4 border-sky-500 pb-3 inline-block">
                    {group.dateLabel}
                  </h3>
                </div>
                
                {/* Activities for this date */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onViewDetails={(activity) => {
                        setSelectedActivity(activity);
                        setShowDetailsModal(true);
                      }}
                      onSignUp={activeTab === 'browse' ? handleSignUpClick : undefined}
                      showSignUpButton={activeTab === 'browse'}
                      signedUp={careReceiverSignups.includes(activity.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {activitiesToShow.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-2xl">
                  {activeTab === 'browse' 
                    ? 'No activities found matching your criteria.'
                    : 'No activities scheduled yet.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Schedule Actions */}
        {activeTab === 'care-schedule' && careSchedule.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Manage Schedule</h3>
            <div className="space-y-4">
              {careSchedule.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-xl">
                  <span className="text-lg font-semibold text-gray-900">{activity.title}</span>
                  <button
                    onClick={() => handleCancelSignup(activity.id)}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl text-base font-bold hover:bg-red-600 transition-colors shadow-md"
                  >
                    Cancel Registration
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onSignUp={activeTab === 'browse' ? handleSignUpClick : undefined}
        signedUp={selectedActivity ? careReceiverSignups.includes(selectedActivity.id) : false}
      />

      <SignupConfirmationModal
        activity={selectedActivity}
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onConfirm={handleConfirmSignup}
        registeredActivities={careSchedule}
        onViewSchedule={handleViewSchedule}
      />

      {/* Manage Needs Modal */}
      {showManageNeedsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Care Receiver Needs</h2>
            <div className="space-y-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={careReceiverNeeds.wheelchairBound}
                  onChange={(e) => setCareReceiverNeeds({...careReceiverNeeds, wheelchairBound: e.target.checked})}
                  className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-lg text-gray-700">Wheelchair-bound</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={careReceiverNeeds.signLanguage}
                  onChange={(e) => setCareReceiverNeeds({...careReceiverNeeds, signLanguage: e.target.checked})}
                  className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-lg text-gray-700">Sign language support</span>
              </label>
              <div>
                <label className="block text-base font-bold text-gray-700 mb-3">Other Needs</label>
                <textarea
                  value={careReceiverNeeds.otherNeeds}
                  onChange={(e) => setCareReceiverNeeds({...careReceiverNeeds, otherNeeds: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowManageNeedsModal(false)}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowManageNeedsModal(false)}
                className="flex-1 bg-sky-500 text-white py-4 rounded-xl text-lg font-bold hover:bg-sky-600 transition-colors shadow-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}