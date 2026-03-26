import React, { useEffect, useState } from 'react';
import { firestoreService } from '../services/firestoreService';

const StreakBadge = ({ reflections }) => {
  const [streak, setStreak] = useState(0);
  const [isNewStreak, setIsNewStreak] = useState(false);
  const [lastCountedLabel, setLastCountedLabel] = useState('No reflection yet');

  const formatLastCounted = (timestamp) => {
    const target = new Date(timestamp);
    if (Number.isNaN(target.getTime())) return 'Unknown';

    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((today.getTime() - target.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return target.toLocaleDateString();
  };

  useEffect(() => {
    if (!reflections?.length) {
      setStreak(0);
      setLastCountedLabel('No reflection yet');
      localStorage.setItem('streakCount', '0');
      const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      if (existingProfile && typeof existingProfile === 'object') {
        localStorage.setItem(
          'userProfile',
          JSON.stringify({
            ...existingProfile,
            streak: 0,
            totalReflections: 0,
            updatedAt: new Date().toISOString(),
          })
        );
      }
      firestoreService.saveUserProfile({ streak: 0, totalReflections: 0 }).catch(() => {});
      return;
    }

    const dayTimestamps = Array.from(
      new Set(
        reflections
          .map((r) => new Date(r.date))
          .filter((d) => !Number.isNaN(d.getTime()))
          .map((d) => {
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          })
      )
    ).sort((a, b) => b - a);
    setLastCountedLabel(formatLastCounted(dayTimestamps[0]));

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let expectedDay = today.getTime();

    for (let i = 0; i < dayTimestamps.length; i++) {
      const reflectionDay = dayTimestamps[i];

      if (reflectionDay === expectedDay) {
        currentStreak++;
        expectedDay -= 24 * 60 * 60 * 1000;
        continue;
      }

      if (reflectionDay > expectedDay) {
        continue;
      }

      break;
    }

    const previousStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);
    if (currentStreak > previousStreak) {
      setIsNewStreak(true);
      setTimeout(() => setIsNewStreak(false), 2000);
    }

    setStreak(currentStreak);
    localStorage.setItem('streakCount', String(currentStreak));

    const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (existingProfile && typeof existingProfile === 'object') {
      localStorage.setItem(
        'userProfile',
        JSON.stringify({
          ...existingProfile,
          streak: currentStreak,
          totalReflections: reflections.length,
          updatedAt: new Date().toISOString(),
        })
      );
    }

    firestoreService.saveUserProfile({
      streak: currentStreak,
      totalReflections: reflections.length,
    }).catch(() => {});
  }, [reflections]);

  const subtitle = (() => {
    if (streak === 0) return 'Start your journey today';
    if (streak === 1) return 'Great start';
    if (streak < 7) return 'Keep it going';
    if (streak < 14) return 'One week strong';
    if (streak < 21) return 'Two weeks power';
    return 'Amazing streak';
  })();

  return (
    <div className={`card text-center transition-all duration-300 ${isNewStreak ? 'ring-2 ring-ramadan-500 animate-pulse-slow' : ''}`}>
      <div className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-ramadan-600 dark:text-ramadan-300 mb-2">
        Current Streak
      </div>
      <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-ramadan-600 transition-transform ${isNewStreak ? 'scale-110 animate-scale-in' : ''}`}>
        {streak}
      </div>
      <div className="text-gray-600 dark:text-gray-300 text-sm mt-2">{subtitle}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last counted: {lastCountedLabel}</div>
    </div>
  );
};

export default StreakBadge;
