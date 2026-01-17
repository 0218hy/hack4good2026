import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Activity } from '../types/activity';

interface EditActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onEditActivity: (activity: Activity) => void;
}

export default function EditActivityModal({ activity, isOpen, onClose, onEditActivity }: EditActivityModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    meetingVenue: '',
    description: '',
    participantCapacity: '',
    volunteerCapacity: '',
    wheelchairAccessible: false,
    signLanguageSupport: false,
    paymentRequired: false,
    paymentAmount: '',
    signupDeadline: '',
    jobScope: '',
    specialInstructions: '',
    packingList: '',
    repeat: false,
    repeatFrequency: '',
    repeatEndDate: '',
    staffInCharge: '',
    staffContactNumber: ''
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        date: activity.date,
        time: activity.time,
        venue: activity.venue,
        meetingVenue: activity.meetingVenue || '',
        description: activity.description,
        participantCapacity: String(activity.participantCapacity),
        volunteerCapacity: String(activity.volunteerCapacity),
        wheelchairAccessible: activity.wheelchairAccessible,
        signLanguageSupport: activity.signLanguageSupport,
        paymentRequired: activity.paymentRequired,
        paymentAmount: activity.paymentAmount ? String(activity.paymentAmount) : '',
        signupDeadline: activity.signupDeadline,
        jobScope: activity.jobScope || '',
        specialInstructions: activity.specialInstructions || '',
        packingList: activity.packingList || '',
        repeat: !!activity.repeatFrequency,
        repeatFrequency: activity.repeatFrequency || '',
        repeatEndDate: activity.repeatEndDate || '',
        staffInCharge: activity.staffInCharge || '',
        staffContactNumber: activity.staffContactNumber || ''
      });
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newParticipantCap = parseInt(formData.participantCapacity) || 0;
    const newVolunteerCap = parseInt(formData.volunteerCapacity) || 0;
    
    // Safely cast repeatFrequency to the correct type
    const repeatFreq = formData.repeat && formData.repeatFrequency 
      ? (formData.repeatFrequency as 'weekly' | 'biweekly' | 'monthly')
      : undefined;
    
    const updatedActivity: Activity = {
      ...activity,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      meetingVenue: formData.meetingVenue || activity.meetingVenue,
      description: formData.description,
      participantCapacity: newParticipantCap,
      volunteerCapacity: newVolunteerCap,
      // Preserve the registered counts
      registeredParticipantsCount: activity.registeredParticipantsCount || 0,
      registeredVolunteersCount: activity.registeredVolunteersCount || 0,
      // Recalculate vacancy based on new capacity and existing registered count
      participantVacancy: Math.max(0, newParticipantCap - (activity.registeredParticipantsCount || 0)),
      volunteerVacancy: Math.max(0, newVolunteerCap - (activity.registeredVolunteersCount || 0)),
      wheelchairAccessible: formData.wheelchairAccessible,
      signLanguageSupport: formData.signLanguageSupport,
      paymentRequired: formData.paymentRequired,
      paymentAmount: formData.paymentRequired ? parseFloat(formData.paymentAmount) || 0 : undefined,
      signupDeadline: formData.signupDeadline,
      jobScope: formData.jobScope,
      specialInstructions: formData.specialInstructions,
      packingList: formData.packingList || activity.packingList,
      repeatFrequency: repeatFreq,
      repeatEndDate: formData.repeat && formData.repeatEndDate ? formData.repeatEndDate : undefined,
      staffInCharge: formData.staffInCharge,
      staffContactNumber: formData.staffContactNumber
    };

    onEditActivity(updatedActivity);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Edit Activity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-base font-bold text-gray-700 mb-3">
                  Activity Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-base font-bold text-gray-700 mb-3">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-base font-bold text-gray-700 mb-3">
                  Time *
                </label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 10:00 AM - 12:00 PM"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="venue" className="block text-base font-bold text-gray-700 mb-3">
                  Venue *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="signupDeadline" className="block text-base font-bold text-gray-700 mb-3">
                  Signup Deadline *
                </label>
                <input
                  type="date"
                  id="signupDeadline"
                  name="signupDeadline"
                  value={formData.signupDeadline}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="repeat"
                    checked={formData.repeat}
                    onChange={handleChange}
                    className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <span className="text-gray-700 font-bold text-base">Repeat</span>
                </label>
                {formData.repeat && (
                  <select
                    name="repeatFrequency"
                    value={formData.repeatFrequency}
                    onChange={handleChange}
                    className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  >
                    <option value="">Select frequency</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
                {formData.repeat && (
                  <input
                    type="date"
                    id="repeatEndDate"
                    name="repeatEndDate"
                    value={formData.repeatEndDate}
                    onChange={handleChange}
                    className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                    placeholder="End date"
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-base font-bold text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  required
                />
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Capacity</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="participantCapacity" className="block text-base font-bold text-gray-700 mb-3">
                  Participant Capacity *
                </label>
                <input
                  type="text"
                  id="participantCapacity"
                  name="participantCapacity"
                  value={formData.participantCapacity}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="e.g., 20"
                  required
                />
              </div>

              <div>
                <label htmlFor="volunteerCapacity" className="block text-base font-bold text-gray-700 mb-3">
                  Volunteer Capacity *
                </label>
                <input
                  type="text"
                  id="volunteerCapacity"
                  name="volunteerCapacity"
                  value={formData.volunteerCapacity}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="e.g., 5"
                  required
                />
              </div>
            </div>
          </div>

          {/* Accessibility Features */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Accessibility Features</h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="wheelchairAccessible"
                  checked={formData.wheelchairAccessible}
                  onChange={handleChange}
                  className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-gray-700 text-base">Wheelchair Accessible</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="signLanguageSupport"
                  checked={formData.signLanguageSupport}
                  onChange={handleChange}
                  className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-gray-700 text-base">Sign Language Support</span>
              </label>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment</h3>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                name="paymentRequired"
                checked={formData.paymentRequired}
                onChange={handleChange}
                className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
              />
              <span className="text-gray-700 font-bold text-base">Payment needed?</span>
            </label>
            {formData.paymentRequired && (
              <div>
                <label htmlFor="paymentAmount" className="block text-base font-bold text-gray-700 mb-3">
                  Payment Amount (SGD) *
                </label>
                <input
                  type="text"
                  id="paymentAmount"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="e.g., 10.00"
                  required
                />
              </div>
            )}
          </div>

          {/* Staff Contact */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Staff Contact</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="staffInCharge" className="block text-base font-bold text-gray-700 mb-3">
                  Staff in Charge Name *
                </label>
                <input
                  type="text"
                  id="staffInCharge"
                  name="staffInCharge"
                  value={formData.staffInCharge}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="Enter staff name"
                  required
                />
              </div>

              <div>
                <label htmlFor="staffContactNumber" className="block text-base font-bold text-gray-700 mb-3">
                  Staff Contact Number *
                </label>
                <input
                  type="tel"
                  id="staffContactNumber"
                  name="staffContactNumber"
                  value={formData.staffContactNumber}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="+65 6479 5655"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Details</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="jobScope" className="block text-base font-bold text-gray-700 mb-3">
                  Volunteer Job Scope
                </label>
                <textarea
                  id="jobScope"
                  name="jobScope"
                  value={formData.jobScope}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="Describe what volunteers will do..."
                />
              </div>

              <div>
                <label htmlFor="specialInstructions" className="block text-base font-bold text-gray-700 mb-3">
                  Special Instructions / Notes
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="Any special requirements or instructions..."
                />
              </div>

              <div>
                <label htmlFor="packingList" className="block text-base font-bold text-gray-700 mb-3">
                  Packing List
                </label>
                <textarea
                  id="packingList"
                  name="packingList"
                  value={formData.packingList}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-base"
                  placeholder="List items to bring..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-sky-500 text-white py-4 rounded-xl text-lg font-bold hover:bg-sky-600 transition-colors shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}