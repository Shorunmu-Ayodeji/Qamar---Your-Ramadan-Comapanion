import React, { useEffect, useMemo, useState } from 'react';
import ReflectionTimelinePage from './components/ReflectionTimelinePage';
import DuaPage from './components/DuaPage';
import TogetherPage from './components/TogetherPage';
import ProfileDashboard from './components/ProfileDashboard';
import ProfileSetup from './components/ProfileSetup';
import AuthForm from './components/AuthForm';
import { getThemePreference } from './utils/themeUtils';
import { useAuth } from './contexts/AuthContext';
import { firestoreService } from './services/firestoreService';

const hasCompleteProfile = (profile) => {
  if (!profile) return false;
  const name = typeof profile.name === 'string' ? profile.name.trim() : '';
  const gender = typeof profile.gender === 'string' ? profile.gender.trim() : '';
  const country = typeof profile.country === 'string' ? profile.country.trim() : '';
  return Boolean(name && gender && country);
};

function App() {
  const { user, profile, loading, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('reflection');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = getThemePreference();
    setIsDarkMode(savedTheme === 'dark');

    const htmlElement = document.documentElement;
    if (savedTheme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      htmlElement.classList.add('dark');
    } else {
      htmlElement.removeAttribute('data-theme');
      htmlElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const needsProfileSetup = Boolean(
        user?.uid && localStorage.getItem(`profileSetupRequired_${user.uid}`) === 'true'
      );
      if (needsProfileSetup && !hasCompleteProfile(profile)) {
        setShowProfileSetup(true);
      } else {
        setShowProfileSetup(false);
        if (user?.uid) {
          localStorage.removeItem(`profileSetupRequired_${user.uid}`);
        }
      }
    } else if (!isAuthenticated) {
      setShowProfileSetup(false);
    }
  }, [loading, isAuthenticated, profile, user?.uid]);

  const userProfile = useMemo(() => profile || JSON.parse(localStorage.getItem('userProfile') || '{}'), [profile]);
  const navItems = useMemo(() => {
    const base = [
      { id: 'reflection', label: 'Reflections', aria: 'Go to Reflection Timeline' },
      { id: 'dua', label: "Du'as", aria: "Go to Du'a Generator" },
      { id: 'friends', label: 'Friends', aria: 'Go to Friends, Chat, and Leaderboards' },
    ];
    if (userProfile?.name) {
      base.push({ id: 'profile', label: 'Profile', aria: 'Go to Profile' });
    }
    return base;
  }, [userProfile?.name]);

  const handleThemeToggle = () => {
    const htmlElement = document.documentElement;
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      htmlElement.removeAttribute('data-theme');
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleProfileSetupComplete = async (profileData) => {
    const sanitizedName = (profileData?.name || '').trim();
    const data = {
      ...profileData,
      name: sanitizedName,
      streak: 0,
      totalReflections: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await firestoreService.saveUserProfile(data);
    localStorage.setItem('userProfile', JSON.stringify(data));
    if (user?.uid) {
      localStorage.removeItem(`profileSetupRequired_${user.uid}`);
    }
    setShowProfileSetup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ramadan-50 to-ramadan-100 dark:from-gray-900 dark:to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Qamar</h1>
          <p className="text-center text-gray-600 dark:text-gray-300">Sign in to access your Firestore-backed account.</p>
          <AuthForm mode={authMode} onSwitchMode={(mode) => setAuthMode(mode)} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {showProfileSetup && <ProfileSetup onComplete={handleProfileSetupComplete} />}

      <nav className="sticky top-0 z-40 border-b border-ramadan-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-ramadan-600 dark:text-ramadan-300">Qamar</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">Ramadan Companion</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleThemeToggle}
                className="h-9 px-2.5 rounded-xl border border-ramadan-200 dark:border-gray-700 text-sm font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle dark mode"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <button
                onClick={logout}
                className="h-9 px-3 rounded-xl border border-ramadan-300 dark:border-ramadan-500 text-ramadan-700 dark:text-ramadan-300 text-sm font-semibold hover:bg-ramadan-50 dark:hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400">Toggle Sections</p>
            <div className="nav-toggle w-full">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-toggle-item ${
                    currentPage === item.id ? 'nav-toggle-item-active' : 'nav-toggle-item-inactive'
                  }`}
                  aria-label={item.aria}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'reflection' && <ReflectionTimelinePage />}
        {currentPage === 'dua' && <DuaPage />}
        {currentPage === 'friends' && <TogetherPage />}
        {currentPage === 'profile' && <ProfileDashboard />}
      </main>
    </div>
  );
}

export default App;
