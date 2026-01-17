import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import RegisterRoleSelector from './components/RegisterRoleSelector';
import ParticipantRegister from './components/ParticipantRegister';
import CaregiverRegister from './components/CaregiverRegister';
import VolunteerRegister from './components/VolunteerRegister';
import StaffRegister from './components/StaffRegister';
import LoginPage from './components/LoginPage';
import ParticipantDashboard from './components/ParticipantDashboard';
import CaregiverDashboard from './components/CaregiverDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import StaffDashboard from './components/StaffDashboard';
import { mockActivities } from './data/mockActivities';
import { Activity } from './types/activity';
import { getAllActivitiesWithRecurring } from './utils/recurringActivities';

export default function App() {
  // Store base activities (including recurring patterns)
  const [baseActivities, setBaseActivities] = useState<Activity[]>(mockActivities);
  
  // Expanded activities with all recurring instances
  const [activities, setActivities] = useState<Activity[]>([]);

  // Generate all recurring instances whenever base activities change
  useEffect(() => {
    const expandedActivities = getAllActivitiesWithRecurring(baseActivities);
    setActivities(expandedActivities);
  }, [baseActivities]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterRoleSelector />} />
        <Route path="/register/participant" element={<ParticipantRegister />} />
        <Route path="/register/caregiver" element={<CaregiverRegister />} />
        <Route path="/register/volunteer" element={<VolunteerRegister />} />
        <Route path="/register/staff" element={<StaffRegister />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/participant" element={<ParticipantDashboard activities={activities} setActivities={setActivities} />} />
        <Route path="/dashboard/caregiver" element={<CaregiverDashboard activities={activities} setActivities={setActivities} />} />
        <Route path="/dashboard/volunteer" element={<VolunteerDashboard activities={activities} setActivities={setActivities} />} />
        <Route path="/dashboard/staff" element={<StaffDashboard activities={activities} setActivities={setActivities} baseActivities={baseActivities} setBaseActivities={setBaseActivities} />} />
      </Routes>
    </Router>
  );
}