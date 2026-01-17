import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

export default function CaregiverRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    caregiverName: '',
    caregiverEmail: '',
    phone: '',
    participantName: '',
    participantEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-gray-900">Incredi</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Caregiver Registration</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-rose-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Caregiver Information</h3>
            </div>

            <div>
              <label htmlFor="caregiverName" className="block text-sm font-semibold text-gray-700 mb-2">
                Caregiver Name *
              </label>
              <input
                type="text"
                id="caregiverName"
                name="caregiverName"
                value={formData.caregiverName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="caregiverEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Caregiver Email *
              </label>
              <input
                type="email"
                id="caregiverEmail"
                name="caregiverEmail"
                value={formData.caregiverEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-2">Care Receiver Information</h3>
            </div>

            <div>
              <label htmlFor="participantName" className="block text-sm font-semibold text-gray-700 mb-2">
                Participant Name *
              </label>
              <input
                type="text"
                id="participantName"
                name="participantName"
                value={formData.participantName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="participantEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Participant Email *
              </label>
              <input
                type="email"
                id="participantEmail"
                name="participantEmail"
                value={formData.participantEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-sky-500 text-white py-4 rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow-md"
              >
                Create Account
              </button>
              <Link
                to="/register"
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Back
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}