import React, { useEffect, useState } from 'react';
import Onboarding from './Onboarding';
import ReflectionForm from './ReflectionForm';
import StreakBadge from './StreakBadge';
import ReflectionSummary from './ReflectionSummary';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

const ReflectionTimelinePage = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) setShowOnboarding(true);

    const loadReflections = async () => {
      const localReflections = JSON.parse(localStorage.getItem('reflections') || '[]');
      setReflections(localReflections);

      if (!user?.uid) return;

      try {
        const cloudReflections = await firestoreService.getUserReflections(user.uid);
        if (cloudReflections.length > 0) {
          setReflections(cloudReflections);
          localStorage.setItem('reflections', JSON.stringify(cloudReflections));
        }
      } catch (error) {
        console.error('Failed to load cloud reflections:', error);
      }
    };

    loadReflections();
  }, [user?.uid]);

  const handleReflectionSaved = (newReflection) => {
    setReflections([newReflection, ...reflections]);
  };

  return (
    <div className="page-shell">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

      <div className="page-container max-w-5xl">
        <div className="page-header">
          <h1 className="page-title">Qamar</h1>
          <p className="page-subtitle">Your Ramadan reflection journal</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <StreakBadge reflections={reflections} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <ReflectionForm onReflectionSaved={handleReflectionSaved} />
            </div>
            <div className="lg:col-span-2">
              <ReflectionSummary reflections={reflections} />
            </div>
          </div>
        </div>

        <footer className="mt-10 sm:mt-12 py-6 border-t border-ramadan-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-300 text-sm">
          <p>May your reflections bring you closer to your spiritual goals.</p>
        </footer>
      </div>
    </div>
  );
};

export default ReflectionTimelinePage;
