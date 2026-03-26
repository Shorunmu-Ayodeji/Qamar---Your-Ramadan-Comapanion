import React, { useState } from 'react';
import { firestoreService } from '../services/firestoreService';
import CountrySelect from './CountrySelect';
import { GENDER_OPTIONS } from '../utils/countries';

const ProfileEditModal = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    gender: profile.gender || '',
    country: profile.country || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const updated = {
        ...profile,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      await firestoreService.saveUserProfile(updated);
      localStorage.setItem('userProfile', JSON.stringify(updated));
      onSave(updated);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full animate-scale-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Profile
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-ramadan-500"
              placeholder="Your name"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-ramadan-500"
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <CountrySelect
              value={formData.country}
              onChange={(code) => handleChange('country', code)}
            />
          </div>
          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-3 rounded text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Other profile details cannot be changed after setup
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
