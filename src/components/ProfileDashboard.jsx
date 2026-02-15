import React, { useState, useEffect } from 'react';
import { getGenderEmoji, getCountryByCode } from '../utils/countries';
import BadgesSection from './BadgesSection';
import ProfileEditModal from './ProfileEditModal';
import PublicProfileShare from './PublicProfileShare';
import DigestSettingsModal from './DigestSettingsModal';
import { authService } from '../services/authService';

const ProfileDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDigestModal, setShowDigestModal] = useState(false);

  useEffect(() => {
    // Load profile from localStorage or AuthContext (if using Firebase)
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setProfile(savedProfile);

    // Load reflections
    const savedReflections = JSON.parse(
      localStorage.getItem('reflections') || '[]'
    );
    setReflections(savedReflections);

    // Calculate achievements
    calculateAchievements(savedReflections, savedProfile);
  }, []);

  const calculateAchievements = (reflectionsList, profileData) => {
    const newAchievements = [];

    // Streak achievement
    const streak = profileData?.streak || 0;
    if (streak >= 1) newAchievements.push({ id: 'streak-1', name: '🔥 First Flame', desc: 'Reflect for 1 consecutive day' });
    if (streak >= 7) newAchievements.push({ id: 'streak-7', name: '🌟 Week Warrior', desc: 'Reflect for 7 consecutive days' });
    if (streak >= 17) newAchievements.push({ id: 'streak-17', name: '💎 Half Month Hero', desc: 'Reflect for 17 consecutive days' });
    if (streak >= 30) newAchievements.push({ id: 'streak-30', name: '👑 Ramadan Champion', desc: 'Reflect for 30 consecutive days' });

    // Reflection count
    const reflectionCount = reflectionsList.length;
    if (reflectionCount >= 5) newAchievements.push({ id: 'reflect-5', name: '📝 Writer', desc: 'Log 5 reflections' });
    if (reflectionCount >= 15) newAchievements.push({ id: 'reflect-15', name: '✍️ Journaler', desc: 'Log 15 reflections' });
    if (reflectionCount >= 30) newAchievements.push({ id: 'reflect-30', name: '📚 Story Teller', desc: 'Log 30 reflections' });

    // First reflection
    if (reflectionCount >= 1) newAchievements.push({ id: 'first', name: '🎯 First Step', desc: 'Log your first reflection' });

    // Mood variety
    const moodSet = new Set(reflectionsList.map((r) => r.mood));
    if (moodSet.size >= 3) newAchievements.push({ id: 'mood-3', name: '🎨 Mood Canvas', desc: 'Experience all moods' });

    setAchievements(newAchievements);
  };

  if (!profile || !profile.name) {
    return (
      <div className="page-shell flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No profile data. Please set up your profile first.</p>
        </div>
      </div>
    );
  }

  const country = getCountryByCode(profile.country);
  const genderEmoji = getGenderEmoji(profile.gender);
  const streak = profile.streak || 0;

  return (
    <div className="page-shell">
      {showEditModal && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => {
            setProfile(updated);
            setShowEditModal(false);
          }}
        />
      )}

      {showDigestModal && (
        <DigestSettingsModal
          userId={authService.getCurrentUser()?.uid || 'current-user'}
          email={profile.email || 'user@example.com'}
          onClose={() => setShowDigestModal(false)}
          onSave={() => setShowDigestModal(false)}
        />
      )}

      <div className="page-container max-w-5xl">
        {/* Profile Header */}
        <div className="card bg-gradient-to-r from-ramadan-400 to-ramadan-500 text-white mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="flex items-center gap-2">
                <div className="text-6xl sm:text-7xl">{genderEmoji}</div>
                <div className="text-5xl sm:text-6xl">{country?.flag}</div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {profile.name}
                </h1>
                <p className="text-ramadan-100 text-lg">
                  {country?.name}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold transition-all"
                title="Edit profile"
              >
                ✏️
              </button>
              <button
                onClick={() => setShowDigestModal(true)}
                className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold transition-all"
                title="Digest reminder settings"
              >
                📧
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-ramadan-100 text-sm">Streak</p>
              <p className="text-2xl font-bold">{streak}d</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-ramadan-100 text-sm">Reflections</p>
              <p className="text-2xl font-bold">{reflections.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-ramadan-100 text-sm">Achievements</p>
              <p className="text-2xl font-bold">{achievements.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="space-y-6 sm:space-y-8">
          {/* Quick achievements summary */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🏆 Quick Achievements
            </h2>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {achievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 border-2 border-amber-300 dark:border-amber-600 rounded-lg text-center"
                  >
                    <p className="text-2xl mb-1">{achievement.name.split(' ')[0]}</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {achievement.name.split(' ').slice(1).join(' ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Start logging reflections to unlock achievements! 🌟
              </p>
            )}
          </div>

          {/* Badges section */}
          <div className="card p-0 overflow-hidden">
            <div className="p-6">
              <BadgesSection 
                achievements={achievements} 
                reflectionCount={reflections.length}
                streak={streak}
              />
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reflection Stats */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📊 Reflection Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Total Reflections</span>
                  <span className="font-bold text-ramadan-600 dark:text-ramadan-400">
                    {reflections.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Current Streak</span>
                  <span className="font-bold text-ramadan-600 dark:text-ramadan-400">{streak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Avg Reflections/Week</span>
                  <span className="font-bold text-ramadan-600 dark:text-ramadan-400">
                    {(reflections.length / Math.max(streak / 7, 1)).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                💪 Difficulty Breakdown
              </h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((level) => {
                  const count = reflections.filter(
                    (r) => r.difficulty === level
                  ).length;
                  const percentage =
                    reflections.length > 0
                      ? ((count / reflections.length) * 100).toFixed(0)
                      : 0;
                  return (
                    <div key={level}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {'⭐'.repeat(level)} (Level {level})
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-ramadan-500 dark:bg-ramadan-400 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Share Profile */}
          <PublicProfileShare profile={profile} isYourProfile={true} />

          {/* Recent Reflections */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📝 Recent Reflections
            </h3>

            {reflections.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reflections.slice(-5).reverse().map((reflection, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{reflection.mood}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(reflection.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-ramadan-600 dark:text-ramadan-400">
                        {'⭐'.repeat(reflection.difficulty)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                      {reflection.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reflections yet. Start your Ramadan journey! 🌙
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
