import React, { useEffect, useState } from 'react';
import DuaCategorySelector from './DuaCategorySelector';
import { DuaGenerator } from './DuaGenerator';
import DuaCard from './DuaCard';

const DuaTooltip = ({ content, visible }) => {
  if (!visible) return null;
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-200 p-3 rounded text-sm space-y-2 animate-scale-in">
      <p className="font-semibold">Tip</p>
      <p>{content}</p>
    </div>
  );
};

const DuaPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentDua, setCurrentDua] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    const tutorialSeen = localStorage.getItem('duaPageTutorialSeen');
    if (!tutorialSeen) {
      setShowTutorial(true);
      localStorage.setItem('duaPageTutorialSeen', 'true');
    }
  }, []);

  const tutorialSteps = [
    { title: "Welcome to Du'a Generator", description: "Generate beautiful du'as based on your needs." },
    { title: 'Choose a Category', description: "Select a category that matches what you're seeking help for." },
    { title: "Generate Du'a", description: "Click the button to generate a du'a." },
    { title: 'Share or Export', description: "Share your du'a with others or save it." },
  ];

  return (
    <div className="page-shell">
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="card max-w-md w-full animate-scale-in">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tutorialSteps[tutorialStep].title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{tutorialSteps[tutorialStep].description}</p>
              <div className="flex gap-1">
                {tutorialSteps.map((_, index) => (
                  <div key={index} className={`h-1 flex-1 rounded-full ${index <= tutorialStep ? 'bg-ramadan-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                {tutorialStep > 0 && (
                  <button onClick={() => setTutorialStep(tutorialStep - 1)} className="btn-secondary flex-1 text-sm">Back</button>
                )}
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <button onClick={() => setTutorialStep(tutorialStep + 1)} className="btn-primary flex-1 text-sm">Next</button>
                ) : (
                  <button onClick={() => setShowTutorial(false)} className="btn-primary flex-1 text-sm">Start</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-container max-w-6xl">
        <div className="page-header">
          <h1 className="page-title">Du'a Generator</h1>
          <p className="page-subtitle">Discover supplications for every need</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-5 sm:space-y-6">
            <div className="card">
              <DuaCategorySelector selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
              <DuaTooltip
                visible={!selectedCategory}
                content="Start by selecting a category. Each category has tailored du'as."
              />
            </div>

            {selectedCategory && (
              <div className="card">
                <DuaGenerator category={selectedCategory} onDuaGenerate={setCurrentDua} />
              </div>
            )}

            <div className="card bg-white/70 dark:bg-gray-900/70 text-sm">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">About Du'a</p>
              <p className="text-gray-600 dark:text-gray-300">
                Du'a is a direct conversation with Allah. Make du'a with sincerity, humility, and hope.
              </p>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <DuaCard dua={currentDua} category={selectedCategory} />
            {!selectedCategory && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Tips</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>Be sincere and humble</li>
                  <li>Speak from the heart</li>
                  <li>Ask with conviction</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card text-center"><div className="text-3xl font-bold text-ramadan-600">6</div><p className="text-sm text-gray-600 dark:text-gray-300">Categories</p></div>
          <div className="card text-center"><div className="text-3xl font-bold text-ramadan-600">18+</div><p className="text-sm text-gray-600 dark:text-gray-300">Supplications</p></div>
          <div className="card text-center"><div className="text-3xl font-bold text-ramadan-600">∞</div><p className="text-sm text-gray-600 dark:text-gray-300">Blessings</p></div>
        </div>

        <footer className="mt-10 sm:mt-12 py-6 border-t border-ramadan-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-300 text-sm">
          <p>And when My servants ask concerning Me, indeed I am near.</p>
        </footer>
      </div>
    </div>
  );
};

export default DuaPage;
