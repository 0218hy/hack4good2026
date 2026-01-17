import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

export default function ParticipantRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    membership: '',
    wheelchairBound: false,
    signLanguage: false,
    otherNeeds: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Participant Registration</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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

            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="membership" className="block text-sm font-semibold text-gray-700 mb-2">
                Type of Membership *
              </label>
              <select
                id="membership"
                name="membership"
                value={formData.membership}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none text-gray-900"
                required
              >
                <option value="">Select membership type</option>
                <option value="adhoc">Ad hoc engagement</option>
                <option value="once">Once a week engagement</option>
                <option value="twice">Twice a week engagement</option>
                <option value="3plus">3 or more times a week engagement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Accessibility Needs
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="wheelchairBound"
                    checked={formData.wheelchairBound}
                    onChange={handleChange}
                    className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <span className="text-gray-700">Wheelchair-bound</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="signLanguage"
                    checked={formData.signLanguage}
                    onChange={handleChange}
                    className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <span className="text-gray-700">Sign language support needed</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="otherNeeds" className="block text-sm font-semibold text-gray-700 mb-2">
                Other Needs (Optional)
              </label>
              <textarea
                id="otherNeeds"
                name="otherNeeds"
                value={formData.otherNeeds}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none"
                placeholder="Please describe any other accessibility needs..."
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