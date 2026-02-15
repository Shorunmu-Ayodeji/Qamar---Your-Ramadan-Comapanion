import React, { useState } from 'react';
import { authService } from '../services/authService';

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const credential = await authService.signInWithGoogle();
      onSuccess(credential);
    } catch (error) {
      console.error('Google sign-in error:', error);
      onError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span>
          Signing in...
        </>
      ) : (
        <>
          <span>🔵</span>
          Sign in with Google
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;
