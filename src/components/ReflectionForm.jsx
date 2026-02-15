import React, { useState } from 'react';
import MoodSelector from './MoodSelector';
import ReflectionInput from './ReflectionInput';
import DifficultyRating from './DifficultyRating';
import LogButton from './LogButton';
import { firestoreService } from '../services/firestoreService';

const ReflectionForm = ({ onReflectionSaved }) => {
  const [mood, setMood] = useState('');
  const [reflection, setReflection] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isFormValid = mood && reflection.trim() && difficulty > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      const nowIso = new Date().toISOString();
      const reflectionPayload = {
        mood,
        reflection,
        difficulty,
        date: nowIso,
      };

      let savedId = Date.now();
      try {
        const firestoreId = await firestoreService.saveReflection(reflectionPayload);
        savedId = firestoreId;
      } catch (cloudError) {
        console.warn('Cloud reflection save failed, using local fallback', cloudError);
      }

      const newEntry = {
        id: savedId,
        mood,
        reflection,
        difficulty,
        date: nowIso,
      };

      // Get existing reflections from localStorage
      const existingReflections = JSON.parse(
        localStorage.getItem('reflections') || '[]'
      );
      const updatedReflections = [newEntry, ...existingReflections];

      // Save to localStorage
      localStorage.setItem('reflections', JSON.stringify(updatedReflections));

      // Show success message
      setSuccessMessage('✨ Reflection saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reset form
      setMood('');
      setReflection('');
      setDifficulty(0);

      // Call parent callback
      onReflectionSaved?.(newEntry);
    } catch (error) {
      console.error('Error saving reflection:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Daily Reflection</h2>

      <MoodSelector selectedMood={mood} onMoodChange={setMood} />
      <ReflectionInput value={reflection} onChange={setReflection} />
      <DifficultyRating rating={difficulty} onRatingChange={setDifficulty} />

      <LogButton isDisabled={!isFormValid} onClick={handleSubmit} loading={loading} />

      {successMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded animate-scale-in"
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ReflectionForm;
