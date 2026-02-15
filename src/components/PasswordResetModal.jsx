import React, { useState } from 'react';
import { authService } from '../services/authService';

const PasswordResetModal = ({ email, onClose, onSuccess }) => {
  const [step, setStep] = useState('confirm'); // 'confirm', 'email-sent', 'done'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendReset = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Firebase sendPasswordResetEmail
      await authService.resetPassword(email);
      
      setStep('email-sent');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        {step === 'confirm' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <p className="text-gray-600">
              We'll send a password reset link to:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{email}</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-3 rounded text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleSendReset}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
              <button
                onClick={onClose}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 'email-sent' && (
          <div className="space-y-4 text-center">
            <p className="text-4xl">📧</p>
            <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
            <button
              onClick={onClose}
              className="btn-primary w-full"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
