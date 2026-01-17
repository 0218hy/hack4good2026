import React, { useState } from 'react';
import { Activity } from '../types/activity';
import { Users, Calendar, TrendingUp, Activity as ActivityIcon, UserCheck, Briefcase, AlertCircle, CheckCircle, Filter } from 'lucide-react';

interface StaffStatisticsProps {
  activities: Activity[];
}

export default function StaffStatistics({ activities }: StaffStatisticsProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'participantFill' | 'volunteerFill'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter activities by status
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);
    
    if (filterStatus === 'upcoming') {
      return activityDate >= today;
    } else if (filterStatus === 'ended') {
      return activityDate < today;
    }
    return true;
  });

  // Activity-specific breakdown with calculations
  const activityBreakdown = filteredActivities.map(act => {
    const activityDate = new Date(act.date);
    activityDate.setHours(0, 0, 0, 0);
    const hasEnded = activityDate < today;
    
    return {
      id: act.id,
      title: act.title,
      date: act.date,
      time: act.time,
      venue: act.venue,
      hasEnded,
      // Participant stats
      participantCapacity: act.participantCapacity,
      participantSignups: act.registeredParticipantsCount || 0,
      participantVacancy: act.participantCapacity - (act.registeredParticipantsCount || 0),
      participantFillRate: act.participantCapacity > 0 
        ? ((act.registeredParticipantsCount || 0) / act.participantCapacity * 100)
        : 0,
      // Volunteer stats
      volunteerCapacity: act.volunteerCapacity,
      volunteerSignups: act.registeredVolunteersCount || 0,
      volunteerVacancy: act.volunteerCapacity - (act.registeredVolunteersCount || 0),
      volunteerFillRate: act.volunteerCapacity > 0
        ? ((act.registeredVolunteersCount || 0) / act.volunteerCapacity * 100)
        : 0,
      // Additional info
      paymentRequired: act.paymentRequired,
      paymentAmount: act.paymentAmount,
      wheelchairAccessible: act.wheelchairAccessible,
      signLanguageSupport: act.signLanguageSupport,
      staffInCharge: act.staffInCharge,
    };
  });

  // Sort activities
  const sortedActivities = [...activityBreakdown].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'participantFill') {
      comparison = a.participantFillRate - b.participantFillRate;
    } else if (sortBy === 'volunteerFill') {
      comparison = a.volunteerFillRate - b.volunteerFillRate;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate summary stats for filtered activities
  const totalActivities = filteredActivities.length;
  const endedActivities = activityBreakdown.filter(a => a.hasEnded).length;
  const upcomingActivities = activityBreakdown.filter(a => !a.hasEnded).length;
  const totalParticipantSignups = activityBreakdown.reduce((sum, act) => sum + act.participantSignups, 0);
  const totalVolunteerSignups = activityBreakdown.reduce((sum, act) => sum + act.volunteerSignups, 0);
  const totalParticipantCapacity = activityBreakdown.reduce((sum, act) => sum + act.participantCapacity, 0);
  const totalVolunteerCapacity = activityBreakdown.reduce((sum, act) => sum + act.volunteerCapacity, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Activity Statistics</h2>
        <p className="text-gray-600 text-lg">Detailed participant and volunteer statistics for each activity</p>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-700">Filter by Status:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'ended')}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base font-semibold bg-white"
            >
              <option value="all">All Activities</option>
              <option value="upcoming">Upcoming Only</option>
              <option value="ended">Ended Only</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-bold text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'participantFill' | 'volunteerFill')}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base font-semibold bg-white"
            >
              <option value="date">Date</option>
              <option value="participantFill">Participant Fill Rate</option>
              <option value="volunteerFill">Volunteer Fill Rate</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base font-semibold bg-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Individual Activity Statistics */}
      <div className="space-y-6">
        {sortedActivities.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-500">No activities found matching the selected filter.</p>
          </div>
        ) : (
          sortedActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-sky-500">
              {/* Activity Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{activity.title}</h3>
                    {activity.hasEnded && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-bold">
                        ENDED
                      </span>
                    )}
                    {!activity.hasEnded && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        UPCOMING
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p><strong>Time:</strong> {activity.time}</p>
                    <p><strong>Venue:</strong> {activity.venue}</p>
                    <p><strong>Staff in Charge:</strong> {activity.staffInCharge}</p>
                  </div>
                </div>

                {/* Quick Info Tags */}
                <div className="flex flex-wrap gap-2">
                  {activity.paymentRequired && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      ${activity.paymentAmount} Payment
                    </span>
                  )}
                  {!activity.paymentRequired && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Free
                    </span>
                  )}
                  {activity.wheelchairAccessible && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      Wheelchair
                    </span>
                  )}
                  {activity.signLanguageSupport && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      Sign Language
                    </span>
                  )}
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Participant Statistics */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-8 h-8 text-purple-600" />
                    <h4 className="text-xl font-bold text-purple-900">Participant Statistics</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 font-semibold">Registered:</span>
                      <span className="text-2xl font-bold text-purple-900">{activity.participantSignups}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 font-semibold">Capacity:</span>
                      <span className="text-xl font-bold text-purple-900">{activity.participantCapacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 font-semibold">Remaining Seats:</span>
                      <span className={`text-xl font-bold ${activity.participantVacancy === 0 ? 'text-red-600' : 'text-purple-900'}`}>
                        {activity.participantVacancy}
                      </span>
                    </div>
                    <div className="pt-3 border-t-2 border-purple-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-700 font-semibold">Fill Rate:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-purple-900">
                            {activity.participantFillRate.toFixed(1)}%
                          </span>
                          {activity.participantFillRate >= 100 && <CheckCircle className="w-6 h-6 text-green-600" />}
                          {activity.participantFillRate < 50 && <AlertCircle className="w-6 h-6 text-red-600" />}
                        </div>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activity.participantFillRate >= 100 ? 'bg-green-600' :
                            activity.participantFillRate >= 75 ? 'bg-purple-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(activity.participantFillRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volunteer Statistics */}
                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase className="w-8 h-8 text-orange-600" />
                    <h4 className="text-xl font-bold text-orange-900">Volunteer Statistics</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-semibold">Registered:</span>
                      <span className="text-2xl font-bold text-orange-900">{activity.volunteerSignups}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-semibold">Capacity:</span>
                      <span className="text-xl font-bold text-orange-900">{activity.volunteerCapacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-semibold">Remaining Seats:</span>
                      <span className={`text-xl font-bold ${activity.volunteerVacancy === 0 ? 'text-red-600' : 'text-orange-900'}`}>
                        {activity.volunteerVacancy}
                      </span>
                    </div>
                    <div className="pt-3 border-t-2 border-orange-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-orange-700 font-semibold">Fill Rate:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-orange-900">
                            {activity.volunteerFillRate.toFixed(1)}%
                          </span>
                          {activity.volunteerFillRate >= 100 && <CheckCircle className="w-6 h-6 text-green-600" />}
                          {activity.volunteerFillRate < 50 && <AlertCircle className="w-6 h-6 text-red-600" />}
                        </div>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            activity.volunteerFillRate >= 100 ? 'bg-green-600' :
                            activity.volunteerFillRate >= 75 ? 'bg-orange-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(activity.volunteerFillRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}