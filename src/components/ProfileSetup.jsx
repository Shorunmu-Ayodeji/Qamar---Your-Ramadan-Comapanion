import React, { useState } from 'react';
import { COUNTRIES, GENDER_OPTIONS, getCountryFlag, getGenderEmoji } from '../utils/countries';

const ProfileSetup = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
    c.code.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const handleSelectCountry = (code) => {
    setCountry(code);
    setShowCountryDropdown(false);
    setStep(3);
  };

  const handleComplete = () => {
    if (name && gender && country) {
      onComplete({ name, gender, country });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="card max-w-md w-full animate-scale-in">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Qamar</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Let&apos;s set up your profile</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">What&apos;s your name?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
                autoFocus
              />
            </div>

            <button onClick={() => name.trim() && setStep(1)} disabled={!name.trim()} className="btn-primary w-full">
              Next
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Gender</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Choose male or female for your profile</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {GENDER_OPTIONS.filter((option) => option.value === 'male' || option.value === 'female').map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setGender(option.value);
                    setStep(2);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gender === option.value
                      ? 'border-ramadan-500 bg-ramadan-50 dark:bg-ramadan-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-ramadan-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</p>
                </button>
              ))}
            </div>

            <button onClick={() => setStep(0)} className="btn-secondary w-full">Back</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Where are you from?</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Select your country</p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchCountry}
                onChange={(e) => {
                  setSearchCountry(e.target.value);
                  setShowCountryDropdown(true);
                }}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Search country..."
                className="input-field"
                autoFocus
              />

              {showCountryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleSelectCountry(c.code)}
                      className="w-full text-left px-4 py-2 hover:bg-ramadan-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <span className="text-lg">{getCountryFlag(c.code)}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {country && (
              <div className="p-3 bg-ramadan-50 dark:bg-ramadan-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Selected:</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getCountryFlag(country)} {COUNTRIES.find((c) => c.code === country)?.name}
                </p>
              </div>
            )}

            <button onClick={() => setStep(1)} className="btn-secondary w-full">Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Preview</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Confirm before continuing</p>

              <div className="card bg-gradient-to-br from-ramadan-50 to-ramadan-100 dark:from-gray-800 dark:to-gray-900 p-6 space-y-4">
                <div className="flex justify-center items-center gap-3">
                  <span className="text-4xl">{getGenderEmoji(gender)}</span>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{name}</p>
                    <p className="text-2xl">{getCountryFlag(country)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button onClick={handleComplete} className="btn-primary w-full">Complete Setup</button>
              <button onClick={() => setStep(0)} className="btn-secondary w-full">Start Over</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
