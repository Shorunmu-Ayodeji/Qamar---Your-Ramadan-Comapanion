import React, { useState } from 'react';

const BadgesSection = ({ achievements = [], reflectionCount = 0, streak = 0 }) => {
  const [expandedCategory, setExpandedCategory] = useState('all');

  // Generate all possible badges
  const allBadges = {
    streaks: [
      {
        id: 'streak-1',
        name: '🔥 First Flame',
        description: 'Complete 1 day streak',
        unlocked: streak >= 1,
      },
      {
        id: 'streak-7',
        name: '🌟 Week Warrior',
        description: 'Complete 7 day streak',
        unlocked: streak >= 7,
      },
      {
        id: 'streak-17',
        name: '💎 Half Month',
        description: 'Complete 17 day streak',
        unlocked: streak >= 17,
      },
      {
        id: 'streak-30',
        name: '👑 Ramadan Champion',
        description: 'Complete 30 day streak',
        unlocked: streak >= 30,
      },
    ],
    reflections: [
      {
        id: 'reflect-1',
        name: '🎯 First Step',
        description: 'Log your first reflection',
        unlocked: reflectionCount >= 1,
      },
      {
        id: 'reflect-5',
        name: '📝 Writer',
        description: 'Log 5 reflections',
        unlocked: reflectionCount >= 5,
      },
      {
        id: 'reflect-15',
        name: '✍️ Journaler',
        description: 'Log 15 reflections',
        unlocked: reflectionCount >= 15,
      },
      {
        id: 'reflect-30',
        name: '📚 Story Teller',
        description: 'Log 30 reflections',
        unlocked: reflectionCount >= 30,
      },
      {
        id: 'reflect-50',
        name: '🎖️ Philosopher',
        description: 'Log 50 reflections',
        unlocked: reflectionCount >= 50,
      },
    ],
    special: [
      {
        id: 'consistent',
        name: '⚡ Consistent',
        description: 'Never miss a day for a week',
        unlocked: streak >= 7,
      },
      {
        id: 'focused',
        name: '🎯 Focused',
        description: 'Log reflections with high difficulty',
        unlocked: reflectionCount >= 10,
      },
      {
        id: 'mindful',
        name: '🧘 Mindful',
        description: 'Write detailed reflections',
        unlocked: reflectionCount >= 5,
      },
      {
        id: 'connected',
        name: '🤝 Connected',
        description: 'Share reflections with the community',
        unlocked: false,
      },
    ],
  };

  const categories = [
    { id: 'all', name: 'All Badges', count: Object.values(allBadges).flat().length },
    { id: 'streaks', name: 'Streak Badges', count: allBadges.streaks.length },
    { id: 'reflections', name: 'Reflection Badges', count: allBadges.reflections.length },
    { id: 'special', name: 'Special Badges', count: allBadges.special.length },
  ];

  const displayBadges = expandedCategory === 'all' 
    ? Object.values(allBadges).flat()
    : allBadges[expandedCategory] || [];

  const unlockedCount = displayBadges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏅 Badges & Milestones
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {unlockedCount} of {displayBadges.length} badges unlocked
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setExpandedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              expandedCategory === category.id
                ? 'bg-ramadan-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayBadges.map(badge => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              badge.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 border-amber-300 dark:border-amber-600'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60'
            }`}
          >
            <div className={`text-3xl mb-2 ${badge.unlocked ? '' : 'grayscale opacity-30'}`}>
              {badge.name.split(' ')[0]}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {badge.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {badge.description}
            </p>
            {badge.unlocked && (
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                ✓ Unlocked
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress info */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Keep going!</strong> Continue your reflection journey to unlock more badges and milestones. Each achievement brings you closer to becoming a Ramadan Champion! 🌟
        </p>
      </div>
    </div>
  );
};

export default BadgesSection;
