import { useState } from 'react';
import { X, FileDown, Trash2, Edit } from 'lucide-react';
import { Activity } from '../types/activity';

interface AdminActivityPanelProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteActivity: (activityId: string) => void;
  onEditActivity: () => void;
}

export default function AdminActivityPanel({ activity, isOpen, onClose, onDeleteActivity, onEditActivity }: AdminActivityPanelProps) {
  // Mock participant signups
  const mockParticipantSignups = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', attended: false, paymentStatus: 'unpaid' as const, caregiverAccompanying: true },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', attended: true, paymentStatus: 'paid' as const, caregiverAccompanying: false },
    { id: '3', name: 'Carol White', email: 'carol@example.com', attended: false, paymentStatus: 'paid' as const, caregiverAccompanying: undefined },
  ];

  const mockVolunteerSignups = [
    { id: '1', name: 'Emily Chen', email: 'emily@example.com', attended: true },
    { id: '2', name: 'Frank Wong', email: 'frank@example.com', attended: false },
  ];

  const mockCaregiverInfo = [
    { participantId: '1', caregiverName: 'Mary Johnson', caregiverEmail: 'mary@example.com' },
  ];

  const [participants, setParticipants] = useState(mockParticipantSignups);
  const [volunteers, setVolunteers] = useState(mockVolunteerSignups);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !activity) return null;

  const toggleAttendance = (id: string, type: 'participant' | 'volunteer') => {
    if (type === 'participant') {
      setParticipants(participants.map(p => 
        p.id === id ? { ...p, attended: !p.attended } : p
      ));
    } else {
      setVolunteers(volunteers.map(v => 
        v.id === id ? { ...v, attended: !v.attended } : v
      ));
    }
  };

  const togglePaymentStatus = (id: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, paymentStatus: p.paymentStatus === 'paid' ? 'unpaid' : 'paid' } : p
    ));
  };

  const deleteParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const downloadCSV = (type: 'participants' | 'volunteers' | 'combined') => {
    let csvContent = '';
    
    if (type === 'participants') {
      csvContent = 'Name,Email,Attended\n';
      participants.forEach(p => {
        csvContent += `${p.name},${p.email},${p.attended ? 'Yes' : 'No'}\n`;
      });
    } else if (type === 'volunteers') {
      csvContent = 'Name,Email,Attended\n';
      volunteers.forEach(v => {
        csvContent += `${v.name},${v.email},${v.attended ? 'Yes' : 'No'}\n`;
      });
    } else {
      csvContent = 'Type,Name,Email,Caregiver Name,Caregiver Email,Attended\n';
      participants.forEach(p => {
        const caregiver = mockCaregiverInfo.find(c => c.participantId === p.id);
        csvContent += `Participant,${p.name},${p.email},${caregiver?.caregiverName || 'N/A'},${caregiver?.caregiverEmail || 'N/A'},${p.attended ? 'Yes' : 'No'}\n`;
      });
      volunteers.forEach(v => {
        csvContent += `Volunteer,${v.name},${v.email},N/A,N/A,${v.attended ? 'Yes' : 'No'}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activity.title.replace(/\s+/g, '_')}_${type}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activity.title}</h2>
            <p className="text-gray-600">
              {new Date(activity.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {activity.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Activity Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-sky-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Participants</h3>
              <p className="text-2xl font-bold text-sky-600">
                {activity.registeredParticipantsCount} / {activity.participantCapacity}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {Math.max(0, activity.participantCapacity - activity.registeredParticipantsCount)} spots remaining
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Volunteers</h3>
              <p className="text-2xl font-bold text-emerald-600">
                {activity.registeredVolunteersCount} / {activity.volunteerCapacity}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {Math.max(0, activity.volunteerCapacity - activity.registeredVolunteersCount)} spots remaining
              </p>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={onEditActivity}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Activity
            </button>
            <button
              onClick={() => downloadCSV('participants')}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              Download Participants
            </button>
            <button
              onClick={() => downloadCSV('volunteers')}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              Download Volunteers
            </button>
            <button
              onClick={() => downloadCSV('combined')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              Download Combined List
            </button>
          </div>

          {/* Participants List */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Participant List</h3>
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Caregiver Accompanying?</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Attendance</th>
                    {activity.paymentRequired && (
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                    )}
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{participant.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{participant.email}</td>
                      <td className="px-4 py-3 text-sm">
                        {participant.caregiverAccompanying === true ? 'Yes' : participant.caregiverAccompanying === false ? 'No' : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={participant.attended}
                            onChange={() => toggleAttendance(participant.id, 'participant')}
                            className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                          />
                          <span className="text-gray-700">
                            {participant.attended ? 'Present' : 'Absent'}
                          </span>
                        </label>
                      </td>
                      {activity.paymentRequired && (
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => togglePaymentStatus(participant.id)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              participant.paymentStatus === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {participant.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                          </button>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => deleteParticipant(participant.id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Delete Entry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Volunteers List */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Volunteer List</h3>
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{volunteer.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{volunteer.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={volunteer.attended}
                            onChange={() => toggleAttendance(volunteer.id, 'volunteer')}
                            className="w-5 h-5 text-emerald-500 border-2 border-gray-300 rounded focus:ring-emerald-500"
                          />
                          <span className="text-gray-700">
                            {volunteer.attended ? 'Present' : 'Absent'}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t-2 border-red-200 pt-6">
            <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-gray-600 mb-4">
              Deleting this activity will remove all associated signups and cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Activity
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Activity? 删除活动?</h2>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete "{activity.title}"? This action cannot be undone and will remove all associated signups.
            </p>
            <p className="text-gray-600 mb-6">
              您确定要删除 \"{activity.title}\" 吗？此操作无法撤销，将删除所有相关报名。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel 取消
              </button>
              <button
                onClick={() => {
                  onDeleteActivity(activity.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Delete 删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}