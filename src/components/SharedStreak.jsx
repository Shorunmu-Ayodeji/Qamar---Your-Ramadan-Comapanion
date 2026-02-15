import React, { useEffect, useState } from 'react';
import { getCountryFlag, getGenderEmoji } from '../utils/countries';

const SharedStreak = ({ userId = 'current-user', friends = [] }) => {
  const [streaks, setStreaks] = useState([]);
  const [topStreaker, setTopStreaker] = useState(null);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const currentStreak = userProfile?.streak || parseInt(localStorage.getItem('streakCount') || '0', 10);

    const rows = [
      {
        id: userId,
        name: userProfile?.name || 'You',
        genderEmoji: getGenderEmoji(userProfile?.gender),
        countryFlag: getCountryFlag(userProfile?.country),
        streak: currentStreak,
        isYou: true,
      },
      ...friends.map((friend) => ({
        id: friend.id,
        name: friend.name || 'Friend',
        genderEmoji: getGenderEmoji(friend.gender),
        countryFlag: getCountryFlag(friend.country),
        streak: friend.streak || 0,
        isYou: false,
      })),
    ];

    setStreaks(rows);
    setTopStreaker(rows.reduce((prev, current) => (current.streak > prev.streak ? current : prev), rows[0]));
  }, [userId, friends]);

  const maxStreak = Math.max(...streaks.map((s) => s.streak), 1);

  return (
    <div className="card space-y-5 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Community Streak</h2>

      {topStreaker && (
        <div
          className={`p-4 rounded-xl text-center border ${
            topStreaker.isYou
              ? 'bg-gradient-to-r from-ramadan-50 to-ramadan-100 dark:from-ramadan-900/20 dark:to-ramadan-800/20 border-ramadan-400 dark:border-ramadan-700'
              : 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-400 dark:border-yellow-700'
          }`}
        >
          <div className="flex justify-center items-center gap-2 text-2xl sm:text-3xl mb-2">
            <span>{topStreaker.genderEmoji}</span>
            <span>{topStreaker.countryFlag}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Leading the streak</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{topStreaker.name}</p>
          <div className="text-3xl sm:text-4xl font-bold text-ramadan-600 mt-1">{topStreaker.streak}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">days strong</p>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {streaks.map((item, index) => (
          <div key={item.id} className="space-y-2 animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base sm:text-lg">{item.genderEmoji}</span>
                <span className="text-base sm:text-lg">{item.countryFlag}</span>
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {item.name}
                  {item.isYou && <span className="ml-2 text-[10px] sm:text-xs bg-ramadan-500 text-white px-2 py-0.5 rounded">You</span>}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-bold text-ramadan-600">{item.streak}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  item.isYou ? 'bg-gradient-to-r from-ramadan-500 to-ramadan-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${(item.streak / maxStreak) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {streaks.length > 1 ? (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-ramadan-600">{(streaks.reduce((sum, s) => sum + s.streak, 0) / streaks.length).toFixed(0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{streaks.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-700 dark:text-blue-200">
          <p className="font-semibold mb-1">Invite friends</p>
          <p>Connect with friends to compare streaks together.</p>
        </div>
      )}
    </div>
  );
};

export default SharedStreak;
