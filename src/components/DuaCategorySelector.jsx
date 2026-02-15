import React from 'react';

const categories = [
  { name: 'Wealth', emoji: '💰', value: 'wealth' },
  { name: 'Family', emoji: '👨‍👩‍👧‍👦', value: 'family' },
  { name: 'Peace', emoji: '☮️', value: 'peace' },
  { name: 'Discipline', emoji: '💪', value: 'discipline' },
  { name: 'Career', emoji: '🎯', value: 'career' },
  { name: 'Marriage', emoji: '💕', value: 'marriage' },
];

const DuaCategorySelector = ({ selectedCategory, onCategoryChange }) => {
  const handleKeyDown = (e, categoryValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategoryChange(categoryValue);
    }
    
    // Arrow key navigation
    const currentIndex = categories.findIndex(c => c.value === categoryValue);
    if (e.key === 'ArrowRight' && currentIndex < categories.length - 1) {
      onCategoryChange(categories[currentIndex + 1].value);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      onCategoryChange(categories[currentIndex - 1].value);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        What do you need du'a for?
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            onKeyDown={(e) => handleKeyDown(e, category.value)}
            aria-label={`Select ${category.name} category`}
            aria-pressed={selectedCategory === category.value}
            className={`p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ramadan-500 focus:ring-offset-2 flex flex-col items-center gap-2 ${
              selectedCategory === category.value
                ? 'bg-ramadan-500 text-white shadow-lg scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-ramadan-300 hover:bg-ramadan-50'
            }`}
            tabIndex={selectedCategory === category.value ? 0 : -1}
          >
            <span className="text-2xl">{category.emoji}</span>
            <span className="text-xs sm:text-sm font-semibold">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DuaCategorySelector;
