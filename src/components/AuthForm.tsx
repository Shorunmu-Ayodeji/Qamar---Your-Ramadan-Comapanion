import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
  onSwitchMode?: (mode: 'login' | 'register') => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, onSwitchMode }) => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md w-full mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900">
        {mode === 'login' ? '🔐 Log In' : '✨ Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="input-field"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? '⏳ Processing...' : mode === 'login' ? '🔐 Log In' : '✨ Create Account'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => onSwitchMode?.('register')}
              className="text-ramadan-600 hover:text-ramadan-700 font-semibold"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => onSwitchMode?.('login')}
              className="text-ramadan-600 hover:text-ramadan-700 font-semibold"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
