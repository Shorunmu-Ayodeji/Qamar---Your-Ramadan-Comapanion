import React, { useEffect, useState } from 'react';

const StreakBadge = ({ reflections }) => {
  const [streak, setStreak] = useState(0);
  const [isNewStreak, setIsNewStreak] = useState(false);

  useEffect(() => {
    if (!reflections?.length) {
      setStreak(0);
      return;
    }

    const dates = reflections.map((r) => new Date(r.date).toDateString()).reverse();
    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (dates[i] === checkDate.toDateString()) currentStreak++;
      else break;
    }

    const previousStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);
    if (currentStreak > previousStreak) {
      setIsNewStreak(true);
      setTimeout(() => setIsNewStreak(false), 2000);
    }

    setStreak(currentStreak);
    localStorage.setItem('streakCount', String(currentStreak));
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
    </div>
  );
};

export default StreakBadge;
