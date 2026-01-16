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
  
  // Participant and Volunteer state
  const [showEditParticipantModal, setShowEditParticipantModal] = useState(false);
  const [showEditVolunteerModal, setShowEditVolunteerModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  
  // Mock participant and volunteer data (now as state)
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+65 9123 4567', needs: 'Wheelchair-bound' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', phone: '+65 9234 5678', needs: 'Sign language' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', phone: '+65 9345 6789', needs: 'None' },
    { id: '4', name: 'David Lee', email: 'david@example.com', phone: '+65 9456 7890', needs: 'Wheelchair-bound, Sign language' },
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
              <Users className="w-6 h-6" />
              Manage Participants
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
                                activity.participantVacancy === 0
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

          {activeView === 'list' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Activities List</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Title</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Time</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Venue</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activities.map((activity) => {
                      const status = activity.participantVacancy === 0 ? 'FULL' : 
                                    new Date(activity.signupDeadline) < new Date() ? 'CLOSED' : 'OPEN';
                      return (
                        <tr key={activity.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-base text-gray-900 font-semibold">{activity.title}</td>
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
                              status === 'OPEN' ? 'bg-green-100 text-green-700' :
                              status === 'FULL' ? 'bg-red-100 text-red-700' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 space-x-3">
                            <button 
                              onClick={() => {
                                setSelectedActivity(activity);
                                setShowEditModal(true);
                              }}
                              className="text-sky-600 hover:text-sky-700 font-bold text-base"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteActivity(activity.id)}
                              className="text-red-600 hover:text-red-700 font-bold text-base"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'participants' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Manage Participants</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Phone</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Needs</th>
                      <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-base text-gray-900">{participant.name}</td>
                        <td className="px-6 py-4 text-base text-gray-600">{participant.email}</td>
                        <td className="px-6 py-4 text-base text-gray-600">{participant.phone}</td>
                        <td className="px-6 py-4 text-base text-gray-600">{participant.needs}</td>
                        <td className="px-6 py-4 text-base space-x-3">
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