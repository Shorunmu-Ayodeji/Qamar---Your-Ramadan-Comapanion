import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PublicProfileShare = ({ profile, isYourProfile = false }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Generate public profile URL
  const profileUrl = `${window.location.origin}?profile=${profile.id || btoa(profile.name)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Qamar Profile`,
          text: `Check out my Ramadan reflection journey!`,
          url: profileUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          📱 Share Your Profile
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Let others see your Ramadan journey and achievements
        </p>
      </div>

      {/* Share buttons */}
      <div className="space-y-2">
        <button
          onClick={handleCopyLink}
          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          {copied ? '✓ Link Copied!' : '🔗 Copy Profile Link'}
        </button>

        {navigator.share && (
          <button
            onClick={handleShare}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            📤 Share Profile
          </button>
        )}

        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          {showQR ? '✕ Hide QR Code' : '📲 Generate QR Code'}
        </button>
      </div>

      {/* QR Code preview */}
      {showQR && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            📷 Scan to view profile
          </p>
          <div className="inline-block p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <QRCodeSVG
              value={profileUrl}
              size={180}
              bgColor="transparent"
              fgColor="#111827"
              includeMargin
              title={`${profile.name} profile QR code`}
            />
          </div>
        </div>
      )}

      {/* Profile preview */}
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
        <p className="font-semibold text-gray-900 dark:text-white">
          {profile.name} 📊 {profile.streak} day streak
        </p>
      </div>
    </div>
  );
};

export default PublicProfileShare;
