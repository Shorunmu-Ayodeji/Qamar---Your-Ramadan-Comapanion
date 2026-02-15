import React, { useEffect, useState } from 'react';
import { digestService } from '../services/digestService';

const DigestSettingsModal = ({ userId, email, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    enabled: false,
    time: '08:00',
    frequency: 'daily',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadSettings = async () => {
      const existing = await digestService.getDigestSettings(userId);
      if (mounted && existing) {
        setSettings(existing);
      }
    };
    loadSettings();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleSave = async () => {
    if (settings.enabled) {
      await digestService.scheduleDigestEmail(
        userId,
        email,
        settings.time,
        settings.frequency
      );
    } else {
      await digestService.disableDigest(userId);
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSave();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full animate-scale-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Daily Digest Reminders
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-900 dark:text-white">
              Enable Digest Reminders
            </label>
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  enabled: !prev.enabled,
                }))
              }
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                settings.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {settings.enabled ? 'On' : 'Off'}
            </button>
          </div>

          {settings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder time
                </label>
                <input
                  type="time"
                  value={settings.time}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  This sends browser notifications only
                </p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-xs">
                  <li>Notification permission is required</li>
                  <li>No backend email service needed</li>
                  <li>Works on this device/browser</li>
                </ul>
              </div>
            </>
          )}

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 rounded-lg bg-ramadan-500 text-white font-semibold hover:bg-ramadan-600 transition-all"
          >
            {saved ? 'Saved' : 'Save Settings'}
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export { DigestSettingsModal };
export default DigestSettingsModal;
