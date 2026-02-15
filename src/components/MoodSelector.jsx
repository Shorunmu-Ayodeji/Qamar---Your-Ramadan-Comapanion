import React from 'react';

const moods = [
  { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😃', label: 'Happy', value: 'happy' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '😕', label: 'Confused', value: 'confused' },
];

const MoodSelector = ({ selectedMood, onMoodChange }) => {
  const handleKeyDown = (e, moodValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMoodChange(moodValue);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        How are you feeling?
      </label>
      <div className="flex gap-3 flex-wrap">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onMoodChange(mood.value)}
            onKeyDown={(e) => handleKeyDown(e, mood.value)}
            aria-label={`Select ${mood.label} mood`}
            aria-pressed={selectedMood === mood.value}
            className={`text-4xl p-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ramadan-500 focus:ring-offset-2 ${
              selectedMood === mood.value
                ? 'bg-ramadan-100 scale-110 shadow-lg'
                : 'bg-gray-100 hover:scale-105'
            }`}
            tabIndex={selectedMood === mood.value ? 0 : -1}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
