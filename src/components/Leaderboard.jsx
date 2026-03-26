import React, { useEffect, useMemo, useState } from 'react';
import { getCountryFlag, getGenderEmoji } from '../utils/countries';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

const formatLastActive = (value) => {
  if (!value) return 'Unknown';
  const asDate = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(asDate.getTime())) return 'Unknown';

  const now = new Date();
  return asDate.toDateString() === now.toDateString() ? 'Today' : asDate.toLocaleDateString();
};

const sortRows = (rows, sortBy) =>
  [...rows].sort((a, b) => (sortBy === 'streak' ? b.streak - a.streak : b.reflections - a.reflections));

const Leaderboard = ({ friends = [] }) => {
  const { user } = useAuth();
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [boardMode, setBoardMode] = useState('global');
  const [sortBy, setSortBy] = useState('streak');
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadGlobalLeaderboard = async () => {
      setLoadingGlobal(true);
      setGlobalError('');

      try {
        const globalRows = await firestoreService.getGlobalLeaderboard(200);
        const rows = globalRows.map((item) => ({
          id: item.userId,
          name: item.name || item.displayName || 'User',
          genderEmoji: getGenderEmoji(item.gender),
          countryFlag: getCountryFlag(item.country),
          streak: item.streak || 0,
          reflections: item.totalReflections || 0,
          lastActive: formatLastActive(item.updatedAt),
          isYou: item.userId === user?.uid,
        }));

        if (isMounted) setGlobalLeaderboard(rows);
      } catch (error) {
        console.error('Failed to load global leaderboard', error);
        if (isMounted) {
          setGlobalError('Could not load global leaderboard right now.');
          setGlobalLeaderboard([]);
        }
      } finally {
        if (isMounted) setLoadingGlobal(false);
      }
    };

    loadGlobalLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const friendsLeaderboard = useMemo(() => {
    const reflections = JSON.parse(localStorage.getItem('reflections') || '[]');
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    const rows = friends.map((friend) => ({
      id: friend.id,
      name: friend.name || 'Friend',
      genderEmoji: getGenderEmoji(friend.gender),
      countryFlag: getCountryFlag(friend.country),
      streak: friend.streak || 0,
      reflections: friend.reflectionCount || 0,
      lastActive: friend.lastActive || 'Unknown',
      isYou: false,
    }));

    if (userProfile?.name) {
      rows.unshift({
        id: user?.uid || 'current-user',
        name: userProfile.name,
        genderEmoji: getGenderEmoji(userProfile.gender),
        countryFlag: getCountryFlag(userProfile.country),
        streak: userProfile.streak || parseInt(localStorage.getItem('streakCount') || '0', 10),
        reflections: reflections.length,
        lastActive: 'Today',
        isYou: true,
      });
    }

    return rows;
  }, [friends, user?.uid]);

  const leaderboard = useMemo(() => {
    const source = boardMode === 'global' ? globalLeaderboard : friendsLeaderboard;
    return sortRows(source, sortBy);
  }, [boardMode, globalLeaderboard, friendsLeaderboard, sortBy]);

  const rankColor = (index) => {
    if (index === 0) return 'from-yellow-100 to-yellow-50 border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/20 dark:border-yellow-700';
    if (index === 1) return 'from-gray-100 to-gray-50 border-gray-300 dark:from-gray-800 dark:to-gray-700/50 dark:border-gray-600';
    if (index === 2) return 'from-orange-100 to-orange-50 border-orange-300 dark:from-orange-900/30 dark:to-orange-800/20 dark:border-orange-700';
    return 'from-blue-50 to-blue-50 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/10 dark:border-blue-700';
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
      </div>

      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setBoardMode('global')}
          className={`flex-1 px-3 py-2 rounded transition-all text-sm font-semibold ${
            boardMode === 'global'
              ? 'bg-ramadan-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Show global leaderboard"
        >
          Global
        </button>
        <button
          onClick={() => setBoardMode('friends')}
          className={`flex-1 px-3 py-2 rounded transition-all text-sm font-semibold ${
            boardMode === 'friends'
              ? 'bg-ramadan-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Show friends leaderboard"
        >
          Friends
        </button>
      </div>

      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setSortBy('streak')}
          className={`flex-1 px-3 py-2 rounded transition-all text-sm font-semibold ${
            sortBy === 'streak'
              ? 'bg-ramadan-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Sort by streak"
        >
          Streak
        </button>
        <button
          onClick={() => setSortBy('days')}
          className={`flex-1 px-3 py-2 rounded transition-all text-sm font-semibold ${
            sortBy === 'days'
              ? 'bg-ramadan-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Sort by reflections"
        >
          Reflections
        </button>
      </div>

      {boardMode === 'global' && loadingGlobal ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading global leaderboard...</p>
        </div>
      ) : boardMode === 'global' && globalError ? (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">{globalError}</p>
        </div>
      ) : leaderboard.length > 0 ? (
        <div className="space-y-3">
          {leaderboard.map((person, index) => (
            <div
              key={person.id}
              className={`bg-gradient-to-br ${rankColor(index)} border-2 p-4 rounded-lg transition-all duration-300 hover:shadow-lg animate-scale-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white min-w-[2rem]">#{index + 1}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl">{person.genderEmoji}</span>
                      <span className="text-xl" title={person.countryFlag}>{person.countryFlag}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {person.name}
                          {person.isYou && <span className="ml-2 text-[10px] sm:text-xs bg-ramadan-500 text-white px-2 py-0.5 rounded">You</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last active: {person.lastActive}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 ml-11">
                <div className="bg-white/70 dark:bg-gray-900/70 rounded p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Streak</p>
                  <p className="text-lg font-bold text-ramadan-600">{person.streak}</p>
                </div>
                <div className="bg-white/70 dark:bg-gray-900/70 rounded p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Reflections</p>
                  <p className="text-lg font-bold text-blue-600">{person.reflections}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-3">
            {boardMode === 'global' ? 'No users on leaderboard yet' : 'No friends on leaderboard yet'}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {boardMode === 'global'
              ? 'Ask users to complete profile setup and add reflections.'
              : 'Add friends by user ID to compare streaks.'}
          </p>
        </div>
      )}

      {leaderboard.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg p-4 text-center border-2 border-purple-200 dark:border-purple-700">
            <p className="font-semibold text-gray-900 dark:text-white">Top Performer</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {leaderboard[0].name} {leaderboard[0].countryFlag} is leading with a {leaderboard[0].streak}-day streak!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
