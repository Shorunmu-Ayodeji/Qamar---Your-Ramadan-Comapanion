import React, { useState } from 'react';

const onboardingSteps = [
  {
    title: 'Welcome to Qamar',
    description: 'Track your daily reflections during Ramadan and build meaningful insights.',
    icon: '🌙',
  },
  {
    title: 'Express Your Feelings',
    description: 'Choose from 5 moods to express how you\'re feeling: peaceful, sad, happy, tired, or confused.',
    icon: '😊',
  },
  {
    title: 'Share Your Thoughts',
    description: 'Write up to 200 characters about your day and what you\'re thankful for.',
    icon: '✍️',
  },
  {
    title: 'Rate Your Journey',
    description: 'Rate the difficulty of your day using 1-5 stars to track your progress.',
    icon: '⭐',
  },
  {
    title: 'Build Your Streak',
    description: 'Reflect daily to build a streak and stay consistent on your spiritual journey.',
    icon: '🔥',
  },
  {
    title: 'Export Your Story',
    description: 'Download your reflections as a PDF to keep a lasting record of your journey.',
    icon: '📥',
  },
];

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Onboarding tutorial">
      <div className="card max-w-2xl w-full animate-scale-in">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="text-6xl">{step.icon}</div>
          <h2 className="text-3xl font-bold text-gray-900">{step.title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>

          {/* Progress Indicator */}
          <div className="w-full flex gap-1">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-ramadan-500' : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Step Counter */}
          <p className="text-sm text-gray-500 font-medium">
            Step {currentStep + 1} of {onboardingSteps.length}
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-3 w-full mt-6">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="btn-secondary flex-1"
                aria-label="Go to previous step"
              >
                ← Back
              </button>
            )}
            {currentStep === onboardingSteps.length - 1 ? (
              <button
                onClick={handleComplete}
                className="btn-primary flex-1"
                aria-label="Complete onboarding and start reflecting"
              >
                Get Started 🚀
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary flex-1"
                aria-label="Continue to next step"
              >
                Next →
              </button>
            )}
          </div>

          <button
            onClick={handleComplete}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
            aria-label="Skip onboarding tutorial"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
