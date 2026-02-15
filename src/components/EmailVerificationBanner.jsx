import React, { useState } from 'react';

const EmailVerificationBanner = ({ email, isVerified, onSendEmail }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    try {
      setLoading(true);
      await onSendEmail();
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error('Error sending verification:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold text-green-800 dark:text-green-200">
            Email Verified
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Your account is fully verified
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
            Verify Your Email
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            Confirm your email address to unlock all features
          </p>
          <button
            onClick={handleSendVerification}
            disabled={loading || sent}
            className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white font-semibold transition-all disabled:opacity-50"
          >
            {sent ? '✓ Email Sent!' : loading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
