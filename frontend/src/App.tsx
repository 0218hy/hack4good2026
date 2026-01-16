import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('http://localhost:8080/activities'); // replace with your backend URL
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: Activity[] = await res.json();
        setActivities(data)

        // // Expand recurring activities if needed
        // const expandedActivities = getAllActivitiesWithRecurring(data);
        // setActivities(expandedActivities);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load activities from backend.');
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div>Loading activities...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage activities={activities} />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
