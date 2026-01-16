import React from 'react';
import { Activity, User, Heart, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';

export default function RegisterRoleSelector() {
  const roles = [
    {
      id: 'participant',
      title: 'Participant',
      description: 'Join activities and connect with the community',
      icon: User,
      path: '/register/participant',
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      id: 'caregiver',
      title: 'Caregiver',
      description: 'Support your care receiver with activities',
      icon: Heart,
      path: '/register/caregiver',
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'Help facilitate activities and support participants',
      icon: Users,
      path: '/register/volunteer',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Manage activities and coordinate programs',
      icon: Briefcase,
      path: '/register/staff',
      color: 'bg-amber-500 hover:bg-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Activity Hub Logo" className="h-10" />
            <span className="text-3xl font-bold text-gray-900">Activity Hub</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-gray-900 mb-12"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">I am a...</h1>
          <p className="text-2xl text-gray-600">Select your role to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.title}
                to={role.path}
                className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-sky-400"
              >
                <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-10 h-10 text-sky-600" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-gray-900">{role.title}</h3>
                <p className="text-xl text-gray-600">{role.description}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}