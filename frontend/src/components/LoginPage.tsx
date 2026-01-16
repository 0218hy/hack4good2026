import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'participant' | 'caregiver' | 'volunteer' | 'staff'>('participant');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <img src={"assets/logo.png"} alt="Activity Hub Logo" className="h-10" />
            <span className="text-3xl font-bold text-gray-900">Activity Hub</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-gray-900 mb-12"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover inclusive activities with MINDS
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Find and register for MINDS activities that support meaningful engagement for participants, caregivers, and volunteers.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Log In</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-lg font-bold text-gray-700 mb-3">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'participant' | 'caregiver' | 'volunteer' | 'staff')}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-gray-900 text-lg"
              >
                <option value="participant">Participant</option>
                <option value="caregiver">Caregiver</option>
                <option value="volunteer">Volunteer</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-gray-700 mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-lg"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {role === 'staff' ? (
              <div key="password-field">
                <label htmlFor="password" className="block text-lg font-bold text-gray-700 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>
            ) : (
              <div key="phone-field">
                <label htmlFor="phone" className="block text-lg font-bold text-gray-700 mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-sky-500 focus:outline-none text-lg"
                  placeholder="+65 1234 5678"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-5 rounded-xl text-xl font-bold hover:bg-sky-600 transition-colors shadow-lg mt-8"
            >
              Log In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}