import React, { useState } from 'react';
import { Activity as ActivityIcon, LogOut, Calendar, PlusCircle, Users, List, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Activity } from '../types/activity';
import CreateActivityModal from './CreateActivityModal';
import AdminActivityPanel from './AdminActivityPanel';
import EditActivityModal from './EditActivityModal';
import StaffAccountCreation from './StaffAccountCreation';
import EditParticipantModal from './EditParticipantModal';
import EditVolunteerModal from './EditVolunteerModal';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';

interface StaffDashboardProps {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  baseActivities: Activity[];
  setBaseActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  needs: string;
  caregiver?: {
    name: string;
    email: string;
    phone: string;
    relationship?: string;
    accompanying?: boolean;
  };
  notes?: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function StaffDashboard({ activities, setActivities, baseActivities, setBaseActivities }: StaffDashboardProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'calendar' | 'list' | 'create' | 'participants' | 'volunteers' | 'createAccount'>('calendar');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026
  const [showEditModal, setShowEditModal] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<any[]>([]);
  
  // Filter states for Activities List
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [filterActivity, setFilterActivity] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('asc'); // asc = earliest to latest, desc = latest to earliest
  
  // Participant and Volunteer state
  const [showEditParticipantModal, setShowEditParticipantModal] = useState(false);
  const [showEditVolunteerModal, setShowEditVolunteerModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  
  // Mock participant and volunteer data (now as state)
  const [participants, setParticipants] = useState<Participant[]>([
    { 
      id: '1', 
      name: 'Alice Johnson', 
      email: 'alice@example.com', 
      phone: '+65 9123 4567', 
      needs: 'Wheelchair-bound',
      caregiver: {
        name: 'Mary Johnson',
        email: 'mary.johnson@example.com',
        phone: '+65 9111 2222',
        relationship: 'Mother',
        accompanying: true
      },
      notes: 'Requires wheelchair access'
    },
    { 
      id: '2', 
      name: 'Bob Smith', 
      email: 'bob@example.com', 
      phone: '+65 9234 5678', 
      needs: 'Sign language',
      caregiver: {
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com',
        phone: '+65 9333 4444',
        relationship: 'Sister',
        accompanying: false
      }
    },
    { 
      id: '3', 
      name: 'Carol White', 
      email: 'carol@example.com', 
      phone: '+65 9345 6789', 
      needs: 'None'
    },
    { 
      id: '4', 
      name: 'David Lee', 
      email: 'david@example.com', 
      phone: '+65 9456 7890', 
      needs: 'Wheelchair-bound, Sign language',
      caregiver: {
        name: 'Linda Lee',
        email: 'linda.lee@example.com',
        phone: '+65 9555 6666',
        relationship: 'Spouse',
        accompanying: true
      },
      notes: 'Needs extra assistance'
    },
  ]);

  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: '1', name: 'Emily Chen', email: 'emily@example.com', phone: '+65 9567 8901' },
    { id: '2', name: 'Frank Wong', email: 'frank@example.com', phone: '+65 9678 9012' },
    { id: '3', name: 'Grace Tan', email: 'grace@example.com', phone: '+65 9789 0123' },
  ]);

  const handleCreateActivity = (newActivity: Activity) => {
    setBaseActivities([...baseActivities, newActivity]);
    setShowCreateModal(false);
  };

  const handleEditActivity = (updatedActivity: Activity) => {
    setBaseActivities(baseActivities.map(a => a.id === updatedActivity.id ? updatedActivity : a));
    setShowEditModal(false);
    setShowAdminPanel(false);
  };

  const handleDeleteActivity = (activityId: string) => {
    setBaseActivities(baseActivities.filter(a => a.id !== activityId));
    setShowAdminPanel(false);
  };

  const handleAccountCreated = (newUser: any) => {
    setCreatedUsers([...createdUsers, newUser]);
  };

  // Show Account Creation Page
  if (activeView === 'createAccount') {
    return (
      <StaffAccountCreation
        onBack={() => setActiveView('calendar')}
        onAccountCreated={handleAccountCreated}
      />
    );
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getActivitiesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter(activity => activity.date === dateStr);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
              <span className="text-lg font-semibold text-gray-700">Staff Dashboard</span>
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

      <div className="flex h-[calc(100vh-104px)]">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-md">
          <nav className="p-6 space-y-3">
            <button
              onClick={() => setActiveView('calendar')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold transition-colors ${
                activeView === 'calendar'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-6 h-6" />
              Calendar
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold transition-colors ${
                activeView === 'list'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="w-6 h-6" />
              Activities List
            </button>
            <button
              onClick={() => {
                setActiveView('create');
                setShowCreateModal(true);
              }}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold transition-colors ${
                activeView === 'create'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <PlusCircle className="w-6 h-6" />
              Create Activity
            </button>
            <button
              onClick={() => setActiveView('participants')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold transition-colors ${
                activeView === 'participants'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-6 h-6 flex-shrink-0" />
              <span className="text-center leading-tight flex-1">
                Manage<br />Participants/<br />Caregivers
              </span>
            </button>
            <button
              onClick={() => setActiveView('volunteers')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold transition-colors ${
                activeView === 'volunteers'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-6 h-6" />
              Manage Volunteers
            </button>
            <button
              onClick={() => setActiveView('createAccount')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-lg font-bold transition-colors ${
                activeView === 'createAccount'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserPlus className="w-6 h-6" />
              Create New User Accounts
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-10">
          {activeView === 'calendar' && (
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {monthNames[month]} {year}
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={previousMonth}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {dayNames.map(day => (
                    <div key={day} className="text-center font-bold text-gray-600 py-3 text-lg">
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const dayActivities = getActivitiesForDay(day);
                    const isToday = 
                      day === new Date().getDate() && 
                      month === new Date().getMonth() && 
                      year === new Date().getFullYear();

                    return (
                      <div
                        key={day}
                        className={`aspect-square border-2 rounded-xl p-3 ${
                          isToday ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="text-base font-bold text-gray-900 mb-2">{day}</div>
                        <div className="space-y-1">
                          {dayActivities.map(activity => (
                            <button
                              key={activity.id}
                              onClick={() => {
                                setSelectedActivity(activity);
                                setShowAdminPanel(true);
                              }}
                              className={`w-full text-left px-2 py-1 rounded-lg text-xs truncate ${
                                (activity.participantCapacity - (activity.registeredParticipantsCount || 0)) <= 0
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-sky-100 text-sky-700'
                              } hover:opacity-80 transition-opacity font-semibold`}
                              title={activity.title}
                            >
                              {activity.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeView === 'list' && (() => {
            // Get unique staff names for filter dropdown
            const uniqueStaffNames = Array.from(new Set(activities.map(a => a.staffInCharge))).sort();
            
            // Get unique activity titles for filter dropdown
            const uniqueActivityTitles = Array.from(new Set(activities.map(a => a.title))).sort();
            
            // Apply filters
            let filteredActivities = activities.filter(activity => {
              // Filter by staff
              if (filterStaff !== 'all' && activity.staffInCharge !== filterStaff) {
                return false;
              }
              
              // Filter by activity title
              if (filterActivity !== 'all' && activity.title !== filterActivity) {
                return false;
              }
              
              // Filter by date range
              if (filterDateFrom && activity.date < filterDateFrom) {
                return false;
              }
              
              if (filterDateTo && activity.date > filterDateTo) {
                return false;
              }
              
              return true;
            });
            
            // Sort by date (earliest to latest)
            filteredActivities = [...filteredActivities].sort((a, b) => {
              const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
              if (dateCompare !== 0) return dateSortOrder === 'asc' ? dateCompare : -dateCompare;
              return dateSortOrder === 'asc' ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time);
            });
            
            return (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Activities List</h2>
                  <div className="flex items-center gap-3">
                    <label className="text-base font-bold text-gray-700">Sort By Date:</label>
                    <select
                      value={dateSortOrder}
                      onChange={(e) => setDateSortOrder(e.target.value as 'asc' | 'desc')}
                      className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base font-semibold bg-white"
                    >
                      <option value="asc">Earliest to Latest</option>
                      <option value="desc">Latest to Earliest</option>
                    </select>
                  </div>
                </div>
                
                {/* Filter Section */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8 border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filter by Staff In Charge */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Filter by Staff In Charge
                      </label>
                      <select
                        value={filterStaff}
                        onChange={(e) => setFilterStaff(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base bg-white"
                      >
                        <option value="all">All Staff</option>
                        {uniqueStaffNames.map(staffName => (
                          <option key={staffName} value={staffName}>{staffName}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Filter by Activity Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Filter by Activity
                      </label>
                      <select
                        value={filterActivity}
                        onChange={(e) => setFilterActivity(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base bg-white"
                      >
                        <option value="all">All Activities</option>
                        {uniqueActivityTitles.map(activityTitle => (
                          <option key={activityTitle} value={activityTitle}>{activityTitle}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Filter by Date Range - From */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base bg-white"
                      />
                    </div>
                    
                    {/* Filter by Date Range - To */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base bg-white"
                      />
                    </div>
                  </div>
                  
                  {/* Clear Filters Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setFilterStaff('all');
                        setFilterActivity('all');
                        setFilterDateFrom('');
                        setFilterDateTo('');
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
                
                {/* Results count */}
                <div className="mb-4 text-base text-gray-600">
                  Showing {filteredActivities.length} of {activities.length} activities
                </div>
                
                {/* Activities Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Title</th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Staff In Charge</th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Date</th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Time</th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Venue</th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Participants Status</th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Volunteers Status</th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredActivities.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                            No activities match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filteredActivities.map((activity) => {
                          const participantsStatus = activity.participantCapacity - activity.registeredParticipantsCount === 0 ? 'FULL' : 'OPEN';
                          const volunteersStatus = activity.volunteerCapacity - activity.registeredVolunteersCount === 0 ? 'FULL' : 'OPEN';
                          
                          return (
                            <tr key={activity.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-base text-gray-900 font-semibold">{activity.title}</td>
                              <td className="px-6 py-4 text-base text-gray-600">{activity.staffInCharge}</td>
                              <td className="px-6 py-4 text-base text-gray-600">
                                {new Date(activity.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </td>
                              <td className="px-6 py-4 text-base text-gray-600">{activity.time}</td>
                              <td className="px-6 py-4 text-base text-gray-600">{activity.venue}</td>
                              <td className="px-6 py-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                  participantsStatus === 'OPEN' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {participantsStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                  volunteersStatus === 'OPEN' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {volunteersStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col items-start gap-1">
                                  <button 
                                    onClick={() => {
                                      setSelectedActivity(activity);
                                      setShowAdminPanel(true);
                                    }}
                                    className="text-sky-600 hover:text-sky-700 font-bold text-base whitespace-nowrap"
                                  >
                                    View Details
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedActivity(activity);
                                      setShowEditModal(true);
                                    }}
                                    className="text-sky-600 hover:text-sky-700 font-bold text-base whitespace-nowrap"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteActivity(activity.id)}
                                    className="text-red-600 hover:text-red-700 font-bold text-base whitespace-nowrap"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {activeView === 'participants' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Manage Participants/Caregivers</h2>
              </div>
              
              {/* Horizontally scrollable table wrapper with gradient fade */}
              <div className="relative">
                <div className="overflow-x-auto overflow-y-visible" style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}>
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        {/* Participant columns */}
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 bg-gray-50 sticky left-0 z-20 border-r-2 border-gray-200 whitespace-nowrap">
                          Participant Name
                        </th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap min-w-[200px]">
                          Participant Email
                        </th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap min-w-[140px]">
                          Participant Phone
                        </th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap min-w-[180px]">
                          Participant Needs
                        </th>
                        
                        {/* Caregiver columns */}
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 bg-sky-50 whitespace-nowrap min-w-[160px]">
                          Caregiver Name
                        </th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 bg-sky-50 whitespace-nowrap min-w-[200px]">
                          Caregiver Email
                        </th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 bg-sky-50 whitespace-nowrap min-w-[140px]">
                          Caregiver Phone
                        </th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 bg-sky-50 whitespace-nowrap min-w-[140px]">
                          Relationship
                        </th>
                        
                        {/* Admin columns */}
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap min-w-[200px]">
                          Notes
                        </th>
                        <th className="px-6 py-4 text-left text-base font-bold text-gray-900 whitespace-nowrap min-w-[180px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {participants.map((participant) => (
                        <tr key={participant.id} className="hover:bg-gray-50">
                          {/* Participant data */}
                          <td className="px-6 py-4 text-base text-gray-900 font-semibold bg-white sticky left-0 z-10 border-r-2 border-gray-200 whitespace-nowrap">
                            {participant.name}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-600 whitespace-nowrap">
                            {participant.email}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-600 whitespace-nowrap">
                            {participant.phone}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-600">
                            {participant.needs}
                          </td>
                          
                          {/* Caregiver data */}
                          <td className="px-6 py-4 text-base text-gray-600 bg-sky-50/30 whitespace-nowrap">
                            {participant.caregiver?.name || '—'}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-600 bg-sky-50/30 whitespace-nowrap">
                            {participant.caregiver?.email || '—'}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-600 bg-sky-50/30 whitespace-nowrap">
                            {participant.caregiver?.phone || '—'}
                          </td>
                          <td className="px-6 py-4 text-base text-gray-600 bg-sky-50/30 whitespace-nowrap">
                            {participant.caregiver?.relationship || '—'}
                          </td>
                          
                          {/* Admin data */}
                          <td className="px-6 py-4 text-base text-gray-600">
                            {participant.notes || '—'}
                          </td>
                          <td className="px-6 py-4 text-base space-x-3 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedParticipant(participant);
                                setShowEditParticipantModal(true);
                              }}
                              className="text-sky-600 hover:text-sky-700 font-bold"
                            >
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-700 font-bold">
                              Delete Entry
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Scroll hint - subtle gradient at right edge */}
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              </div>
            </div>
          )}

          {activeView === 'volunteers' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Manage Volunteers</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Phone</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {volunteers.map((volunteer) => (
                      <tr key={volunteer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-base text-gray-900">{volunteer.name}</td>
                        <td className="px-6 py-4 text-base text-gray-600">{volunteer.email}</td>
                        <td className="px-6 py-4 text-base text-gray-600">{volunteer.phone}</td>
                        <td className="px-6 py-4 text-base space-x-3">
                          <button
                            onClick={() => {
                              setSelectedVolunteer(volunteer);
                              setShowEditVolunteerModal(true);
                            }}
                            className="text-sky-600 hover:text-sky-700 font-bold"
                          >
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 font-bold">
                            Delete Entry
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Activity Modal */}
      <CreateActivityModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setActiveView('calendar');
        }}
        onCreateActivity={handleCreateActivity}
      />

      {/* Admin Activity Panel */}
      <AdminActivityPanel
        activity={selectedActivity}
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        onDeleteActivity={handleDeleteActivity}
        onEditActivity={() => {
          setShowAdminPanel(false);
          setShowEditModal(true);
        }}
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        activity={selectedActivity}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEditActivity={handleEditActivity}
      />

      {/* Edit Participant Modal */}
      <EditParticipantModal
        participant={selectedParticipant}
        isOpen={showEditParticipantModal}
        onClose={() => setShowEditParticipantModal(false)}
        onEditParticipant={(updatedParticipant) => {
          setParticipants(participants.map(p => p.id === updatedParticipant.id ? updatedParticipant : p));
          setShowEditParticipantModal(false);
        }}
      />

      {/* Edit Volunteer Modal */}
      <EditVolunteerModal
        volunteer={selectedVolunteer}
        isOpen={showEditVolunteerModal}
        onClose={() => setShowEditVolunteerModal(false)}
        onEditVolunteer={(updatedVolunteer) => {
          setVolunteers(volunteers.map(v => v.id === updatedVolunteer.id ? updatedVolunteer : v));
          setShowEditVolunteerModal(false);
        }}
      />
    </div>
  );
}