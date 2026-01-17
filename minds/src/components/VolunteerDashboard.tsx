import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, LogOut, Search, List, Calendar, Briefcase, Info, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../types/activity';
import ActivityDetailsModal from './ActivityDetailsModal';
import CalendarView from './CalendarView';
import ConflictModal from './ConflictModal';
import { groupActivitiesByDate } from '../utils/activitySorting';
import { detectScheduleConflict } from '../utils/conflictDetection';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';
import { Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface VolunteerDashboardProps {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

export default function VolunteerDashboard({ activities, setActivities }: VolunteerDashboardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-shifts'>('browse');
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [volunteerSignups, setVolunteerSignups] = useState<string[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictingActivity, setConflictingActivity] = useState<Activity | null>(null);
  const [filterOption, setFilterOption] = useState<'all' | 'open' | 'registered'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Set list as default view when on my shifts tab
  useEffect(() => {
    if (activeTab === 'my-shifts') {
      setView('list');
    } else {
      setView('list');
    }
  }, [activeTab]);

  const handleSignUp = (activity: Activity) => {
    // Check if volunteer capacity is available
    const volunteerVacancy = activity.volunteerCapacity - (activity.registeredVolunteersCount || 0);
    if (volunteerVacancy <= 0) {
      alert('This activity is fully booked for volunteers.');
      return;
    }
    
    // Check for schedule conflicts
    const myShiftsActivities = activities.filter(a => volunteerSignups.includes(a.id));
    const conflict = detectScheduleConflict(activity, myShiftsActivities);
    
    if (conflict) {
      setConflictingActivity(conflict);
      setShowConflictModal(true);
    } else {
      // Increment volunteer count only
      setActivities(prev => prev.map(act => 
        act.id === activity.id
          ? {
              ...act,
              registeredVolunteersCount: (act.registeredVolunteersCount || 0) + 1
            }
          : act
      ));
      
      setVolunteerSignups([...volunteerSignups, activity.id]);
    }
  };

  const handleCancelSignup = (activityId: string) => {
    // Decrement volunteer count only
    setActivities(prev => prev.map(act => 
      act.id === activityId
        ? {
            ...act,
            registeredVolunteersCount: Math.max(0, (act.registeredVolunteersCount || 0) - 1)
          }
        : act
    ));
    
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
    
    // Apply filter option (only on browse tab)
    if (activeTab === 'browse') {
      if (filterOption === 'open') {
        // Check if activity is open for volunteer sign-up
        const volunteerVacancy = activity.volunteerCapacity - (activity.registeredVolunteersCount || 0);
        const isVolunteerFull = volunteerVacancy <= 0;
        const isDeadlinePassed = new Date(activity.signupDeadline) < new Date();
        const isAlreadySignedUp = volunteerSignups.includes(activity.id);
        const isDateInPast = new Date(activity.date) < new Date();
        
        // Only show if all conditions are met
        if (isVolunteerFull || isDeadlinePassed || isAlreadySignedUp || isDateInPast) {
          return false;
        }
      } else if (filterOption === 'registered') {
        // Only show activities the volunteer has signed up for
        if (!volunteerSignups.includes(activity.id)) {
          return false;
        }
      }
    }
    
    return true;
  });

  const myShifts = activities.filter(activity => 
    volunteerSignups.includes(activity.id)
  );

  const activitiesToShow = activeTab === 'browse' ? filteredActivities : myShifts;

  const VolunteerActivityCard = ({ activity }: { activity: Activity }) => {
    // SINGLE SOURCE OF TRUTH: Calculate volunteer vacancy using ONLY these two fields
    // - volunteerCapacity: Total volunteer slots (set by staff)
    // - registeredVolunteersCount: Current volunteer signups
    // Formula: volunteerVacancy = volunteerCapacity - registeredVolunteersCount
    const volunteerVacancy = activity.volunteerCapacity - (activity.registeredVolunteersCount || 0);
    const isVolunteerFull = volunteerVacancy <= 0;
    const isDeadlinePassed = new Date(activity.signupDeadline) < new Date();
    const signedUp = volunteerSignups.includes(activity.id);
    const canSignUp = !isVolunteerFull && !isDeadlinePassed && !signedUp;
    
    const getStatus = () => {
      if (isVolunteerFull) return 'FULL';
      if (isDeadlinePassed) return 'CLOSED';
      return 'OPEN';
    };
    
    const status = getStatus();
    
    // Get title and venue based on language
    const displayTitle = language === 'zh' ? activity.titleChinese : activity.title;
    const displayVenue = language === 'zh' ? activity.venueChinese : activity.venue;

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{displayTitle}</h3>
          {signedUp && (
            <span className="px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-base font-bold">
              SIGNED UP
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-gray-700 text-base"><strong>Time:</strong> {activity.time}</p>
          <p className="text-gray-700 text-base"><strong>Venue:</strong> {displayVenue}</p>
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

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setSelectedActivity(activity);
              setShowDetailsModal(true);
            }}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-900 py-4 px-5 rounded-xl text-base font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Info className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
            <span className="text-center leading-tight">
              View Details<br />查看详情
            </span>
          </button>
          {activeTab === 'browse' && !signedUp && (
            <button
              onClick={() => handleSignUp(activity)}
              disabled={!canSignUp}
              className={`flex-1 py-4 px-5 rounded-xl text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                canSignUp
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-center leading-tight">
                {status === 'FULL' ? 'Full\n已满' : status === 'CLOSED' ? 'Closed\n已关闭' : 'Sign Up\n报名'}
              </span>
            </button>
          )}
          {activeTab === 'browse' && signedUp && (
            <button
              onClick={() => handleCancelSignup(activity.id)}
              className="flex-1 py-4 px-5 rounded-xl text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
            >
              <X className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-center leading-tight">
                Cancel<br />取消
              </span>
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
              <LanguageToggle />
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
            className={`px-6 py-3 rounded-xl text-base font-bold transition-all shadow-md flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" strokeWidth={2.5} />
            Browse Activities
          </button>
          <button
            onClick={() => setActiveTab('my-shifts')}
            className={`px-6 py-3 rounded-xl text-base font-bold transition-all shadow-md flex items-center gap-2 ${
              activeTab === 'my-shifts'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="w-5 h-5" strokeWidth={2.5} />
            My Volunteer Shifts ({volunteerSignups.length})
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setView('list')}
                className={`flex-1 px-6 py-4 rounded-xl text-base font-bold transition-colors flex items-center justify-center gap-3 ${
                  view === 'list'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Switch to list view"
              >
                <List className="w-7 h-7 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-center leading-tight">
                  List View<br />
                  列表
                </span>
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`flex-1 px-6 py-4 rounded-xl text-base font-bold transition-colors flex items-center justify-center gap-3 ${
                  view === 'calendar'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Switch to calendar view"
              >
                <Calendar className="w-7 h-7 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-center leading-tight">
                  Calendar View<br />
                  日历
                </span>
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
              Filters 筛选
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
            signedUpIds={volunteerSignups}
            userRole="volunteer"
            showLegend={activeTab !== 'my-shifts'}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
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
                    ? filterOption === 'open'
                      ? 'No activities currently open for volunteer sign-up.'
                      : filterOption === 'registered'
                      ? 'You haven\'t signed up for any volunteer shifts yet.'
                      : 'No activities found.'
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
        userRole="volunteer"
        allActivities={activities}
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