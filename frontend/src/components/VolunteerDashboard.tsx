import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, LogOut, Search, List, Calendar, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../types/activity';
import ActivityDetailsModal from './ActivityDetailsModal';
import CalendarView from './CalendarView';
import ConflictModal from './ConflictModal';
import { groupActivitiesByDate } from '../utils/activitySorting';
import { detectScheduleConflict } from '../utils/conflictDetection';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';

interface VolunteerDashboardProps {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

export default function VolunteerDashboard({ activities }: VolunteerDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-shifts'>('browse');
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [volunteerSignups, setVolunteerSignups] = useState<string[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictingActivity, setConflictingActivity] = useState<Activity | null>(null);

  // Set calendar as default view when on my shifts tab
  useEffect(() => {
    if (activeTab === 'my-shifts') {
      setView('calendar');
    } else {
      setView('list');
    }
  }, [activeTab]);

  const handleSignUp = (activity: Activity) => {
    // Check for schedule conflicts
    const myShiftsActivities = activities.filter(a => volunteerSignups.includes(a.id));
    const conflict = detectScheduleConflict(activity, myShiftsActivities);
    
    if (conflict) {
      setConflictingActivity(conflict);
      setShowConflictModal(true);
    } else {
      setVolunteerSignups([...volunteerSignups, activity.id]);
    }
  };

  const handleCancelSignup = (activityId: string) => {
    setVolunteerSignups(volunteerSignups.filter(id => id !== activityId));
  };

  const handleViewSchedule = () => {
    setActiveTab('my-shifts');
    setView('calendar');
  };

  const filteredActivities = activities.filter(activity => {
    if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const myShifts = activities.filter(activity => 
    volunteerSignups.includes(activity.id)
  );

  const activitiesToShow = activeTab === 'browse' ? filteredActivities : myShifts;

  const VolunteerActivityCard = ({ activity }: { activity: Activity }) => {
    const isVolunteerFull = activity.volunteerVacancy === 0;
    const isDeadlinePassed = new Date(activity.signupDeadline) < new Date();
    const signedUp = volunteerSignups.includes(activity.id);
    const canSignUp = !isVolunteerFull && !isDeadlinePassed && !signedUp;
    
    const getStatus = () => {
      if (isVolunteerFull) return 'FULL';
      if (isDeadlinePassed) return 'CLOSED';
      return 'OPEN';
    };
    
    const status = getStatus();

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{activity.title}</h3>
          {signedUp && (
            <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-base font-bold">
              SIGNED UP
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-gray-700 text-base"><strong>Time:</strong> {activity.time}</p>
          <p className="text-gray-700 text-base"><strong>Venue:</strong> {activity.venue}</p>
        </div>

        {activity.jobScope && (
          <div className="bg-sky-50 rounded-xl p-5 mb-6">
            <p className="text-base font-bold text-sky-900 mb-2">Job Scope:</p>
            <p className="text-base text-sky-800">{activity.jobScope}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`px-4 py-2 rounded-full text-base font-bold ${
            status === 'OPEN' ? 'bg-sky-100 text-sky-700' :
            status === 'FULL' ? 'bg-red-100 text-red-700' :
            'bg-gray-200 text-gray-700'
          }`}>
            {status}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedActivity(activity);
              setShowDetailsModal(true);
            }}
            className="flex-1 bg-white text-sky-600 border-2 border-sky-500 py-3 px-6 rounded-xl text-base font-bold hover:bg-sky-50 transition-colors"
          >
            View Details
          </button>
          {activeTab === 'browse' && (
            <button
              onClick={() => handleSignUp(activity)}
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
    );
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
              <span className="text-lg font-semibold text-gray-700">Volunteer Dashboard</span>
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
            onClick={() => setActiveTab('my-shifts')}
            className={`px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-md ${
              activeTab === 'my-shifts'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Volunteer Shifts ({volunteerSignups.length})
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
            signedUpIds={volunteerSignups}
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
                    <VolunteerActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            ))}
            {activitiesToShow.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-2xl">
                  {activeTab === 'browse' 
                    ? 'No activities found.'
                    : 'You haven\'t signed up for any volunteer shifts yet.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* My Shifts Actions */}
        {activeTab === 'my-shifts' && myShifts.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Manage Shifts</h3>
            <div className="space-y-4">
              {myShifts.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-xl">
                  <span className="text-lg font-semibold text-gray-900">{activity.title}</span>
                  <button
                    onClick={() => handleCancelSignup(activity.id)}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl text-base font-bold hover:bg-red-600 transition-colors shadow-md"
                  >
                    Cancel Signup
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Details Modal */}
      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      {/* Conflict Modal */}
      {conflictingActivity && (
        <ConflictModal
          isOpen={showConflictModal}
          onClose={() => {
            setShowConflictModal(false);
            setConflictingActivity(null);
          }}
          conflictingActivity={conflictingActivity}
          onViewSchedule={() => {
            setShowConflictModal(false);
            setConflictingActivity(null);
            handleViewSchedule();
          }}
        />
      )}
    </div>
  );
}