import React from 'react';

const SocialAchievements = ({ friends = [], messageCount = 0 }) => {
  const items = [
    {
      id: 'social-first-friend',
      title: 'First Connection',
      description: 'Add your first friend',
      unlocked: friends.length >= 1,
    },
    {
      id: 'social-circle',
      title: 'Social Circle',
      description: 'Add 3 friends',
      unlocked: friends.length >= 3,
    },
    {
      id: 'social-messenger',
      title: 'Messenger',
      description: 'Send your first direct message',
      unlocked: messageCount >= 1,
    },
    {
      id: 'social-active',
      title: 'Active Supporter',
      description: 'Send 10 direct messages',
      unlocked: messageCount >= 10,
    },
  ];

  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${
              item.unlocked
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">{item.description}</p>
            <p className={`text-xs mt-2 ${item.unlocked ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {item.unlocked ? 'Unlocked' : 'Locked'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialAchievements;
