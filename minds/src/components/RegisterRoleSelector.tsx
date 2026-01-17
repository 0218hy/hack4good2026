import React from 'react';
import { Activity, User, Heart, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function RegisterRoleSelector() {
  const { t } = useLanguage();
  
  const roles = [
    {
      id: 'participant',
      titleKey: 'participant',
      descriptionKey: 'participantDesc',
      icon: User,
      path: '/register/participant',
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      id: 'caregiver',
      titleKey: 'caregiver',
      descriptionKey: 'caregiverDesc',
      icon: Heart,
      path: '/register/caregiver',
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      id: 'volunteer',
      titleKey: 'volunteer',
      descriptionKey: 'volunteerDesc',
      icon: Users,
      path: '/register/volunteer',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'staff',
      titleKey: 'staff',
      descriptionKey: 'staffDesc',
      icon: Briefcase,
      path: '/register/staff',
      color: 'bg-amber-500 hover:bg-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Activity Hub Logo" className="h-10" />
              <span className="text-3xl font-bold text-gray-900">{t('activityHub')}</span>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-xl text-gray-600 hover:text-gray-900 mb-12 font-semibold bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          aria-label="Go back to home page"
        >
          <ArrowLeft className="w-7 h-7" />
          {t('backToHome')}
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">{t('iAmA')}</h1>
          <p className="text-2xl text-gray-600">{t('selectRole')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.titleKey}
                to={role.path}
                className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-4 border-transparent hover:border-sky-400"
                aria-label={`Register as ${t(role.titleKey)}: ${t(role.descriptionKey)}`}
              >
                {/* Much larger icon with colorful background */}
                <div className="bg-sky-100 w-32 h-32 rounded-3xl flex items-center justify-center mb-6 border-4 border-sky-300">
                  <Icon className="w-20 h-20 text-sky-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-gray-900">{t(role.titleKey)}</h3>
                <p className="text-xl text-gray-600 leading-relaxed">{t(role.descriptionKey)}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}