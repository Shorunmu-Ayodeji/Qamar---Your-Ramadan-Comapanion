import React from 'react';

const ReflectionInput = ({ value, onChange }) => {
  const maxLength = 200;
  const characterCount = value.length;

  return (
    <div className="space-y-2">
      <label htmlFor="reflection-textarea" className="block text-sm font-semibold text-gray-700">
        Your Reflection
      </label>
      <textarea
        id="reflection-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder="How are you feeling today?"
        maxLength={maxLength}
        aria-label="Reflection input"
        aria-describedby="char-count"
        className="input-field resize-none h-32 focus:ring-offset-2"
      />
      <div className="flex justify-between items-center">
        <span id="char-count" className="text-xs text-gray-500">
          {characterCount} / {maxLength} characters
        </span>
        {characterCount > 150 && (
          <span className="text-xs text-ramadan-600 font-medium">
            ⚠️ Nearing limit
          </span>
        )}
      </div>
    </div>
  );
};

export default ReflectionInput;
