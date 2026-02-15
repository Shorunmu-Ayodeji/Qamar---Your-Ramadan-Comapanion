import React from 'react';

const DifficultyRating = ({ rating, onRatingChange }) => {
  const handleKeyDown = (e, starValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRatingChange(starValue);
    }
    // Arrow keys support
    if (e.key === 'ArrowRight' && starValue < 5) {
      onRatingChange(starValue + 1);
    } else if (e.key === 'ArrowLeft' && starValue > 1) {
      onRatingChange(starValue - 1);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Difficulty Level
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            aria-label={`Rate difficulty as ${star} out of 5 stars`}
            aria-pressed={rating === star}
            className={`text-3xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ramadan-500 focus:ring-offset-2 rounded p-2 ${
              rating >= star
                ? 'text-ramadan-500 drop-shadow-lg hover:scale-110'
                : 'text-gray-300 hover:text-ramadan-300'
            }`}
            tabIndex={rating === star ? 0 : -1}
          >
            ★
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-sm text-gray-600">
          {rating === 1 && 'Easy'}
          {rating === 2 && 'Manageable'}
          {rating === 3 && 'Moderate'}
          {rating === 4 && 'Challenging'}
          {rating === 5 && 'Very Challenging'}
        </p>
      )}
    </div>
  );
};

export default DifficultyRating;
