import React, { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';

interface StaffAccountCreationProps {
  onBack: () => void;
  onAccountCreated: (newUser: any) => void;
}

export default function StaffAccountCreation({ onBack, onAccountCreated }: StaffAccountCreationProps) {
  const [role, setRole] = useState<'participant' | 'caregiver' | 'volunteer'>('participant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    accessibilityNeeds: [] as string[],
    careReceiverName: '', // For caregivers
    skills: '', // For volunteers
    availability: '', // For volunteers
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleAccessibilityToggle = (need: string) => {
    setFormData(prev => ({
      ...prev,
      accessibilityNeeds: prev.accessibilityNeeds.includes(need)
        ? prev.accessibilityNeeds.filter(n => n !== need)
        : [...prev.accessibilityNeeds, need]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser = {
      id: Date.now().toString(),
      role,
      ...formData,
      createdAt: new Date().toISOString(),
      registeredActivities: [],
    };

    onAccountCreated(newUser);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        emergencyContact: '',
        emergencyPhone: '',
        accessibilityNeeds: [],
        careReceiverName: '',
        skills: '',
        availability: '',
      });
    }, 2000);
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
              <span className="text-lg font-semibold text-gray-700">Create User Account</span>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-lg bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg z-50 text-lg">
          Account created successfully!
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-8">
            <UserPlus className="w-8 h-8 text-sky-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create New User Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-xl font-semibold text-gray-900 mb-4">User Role</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('participant')}
                  className={`p-6 rounded-lg border-2 text-lg font-semibold transition-all ${
                    role === 'participant'
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-sky-300'
                  }`}
                >
                  Participant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  className={`p-6 rounded-lg border-2 text-lg font-semibold transition-all ${
                    role === 'caregiver'
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-sky-300'
                  }`}
                >
                  Caregiver
                </button>
                <button
                  type="button"
                  onClick={() => setRole('volunteer')}
                  className={`p-6 rounded-lg border-2 text-lg font-semibold transition-all ${
                    role === 'volunteer'
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-sky-300'
                  }`}
                >
                  Volunteer
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="+65 XXXX XXXX"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {role === 'participant' ? 'Caregiver Contact' : 'Emergency Contact'}
              </h2>
              
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  {role === 'participant' ? 'Caregiver Name *' : 'Emergency Contact Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder={role === 'participant' ? 'Caregiver name' : 'Emergency contact name'}
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  {role === 'participant' ? 'Caregiver Phone *' : 'Emergency Contact Phone *'}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="+65 XXXX XXXX"
                />
              </div>
            </div>

            {/* Accessibility Needs (Participants and Caregivers) */}
            {(role === 'participant' || role === 'caregiver') && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Accessibility Needs</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accessibilityNeeds.includes('wheelchair')}
                      onChange={() => handleAccessibilityToggle('wheelchair')}
                      className="w-5 h-5 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-lg">Wheelchair Access Required</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accessibilityNeeds.includes('signLanguage')}
                      onChange={() => handleAccessibilityToggle('signLanguage')}
                      className="w-5 h-5 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-lg">Sign Language Support Required</span>
                  </label>
                </div>
              </div>
            )}

            {/* Caregiver-specific fields */}
            {role === 'caregiver' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Caregiver Information</h2>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Name of Care Receiver *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.careReceiverName}
                    onChange={(e) => setFormData({ ...formData, careReceiverName: e.target.value })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Enter care receiver name"
                  />
                </div>
              </div>
            )}

            {/* Volunteer-specific fields */}
            {role === 'volunteer' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Volunteer Information</h2>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">Skills & Interests</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., Sports coaching, Arts & crafts, Music, etc."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">Availability</label>
                  <textarea
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., Weekday evenings, Weekends, etc."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-sky-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-sky-600 transition-colors"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-8 py-4 rounded-lg text-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}