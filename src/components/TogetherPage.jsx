import React, { useState, useEffect } from 'react';
import InviteFriend from './InviteFriend';
import SharedStreak from './SharedStreak';
import Leaderboard from './Leaderboard';
import SocialHub from './SocialHub';
import SocialAchievements from './SocialAchievements';
import socialService from '../services/socialService';
import { useAuth } from '../contexts/AuthContext';

const TogetherOnboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Qamar Together',
      description: 'Connect with friends and support each other on your Ramadan journey.',
      icon: 'People',
    },
    {
      title: 'Share Your Journey',
      description: 'Invite friends using a link or email to join your community.',
      icon: 'Connect',
    },
    {
      title: 'Track Together',
      description: 'See shared streaks and compete on the leaderboard.',
      icon: 'Track',
    },
    {
      title: 'Motivate Each Other',
      description: "Build accountability and celebrate each other's progress.",
      icon: 'Support',
    },
  ];

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="card max-w-md w-full animate-scale-in">
        <div className="text-center space-y-6">
          <div className="text-3xl font-semibold">{step.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= currentStep ? 'bg-ramadan-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="btn-secondary flex-1 text-sm"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn-primary flex-1 text-sm"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="btn-primary flex-1 text-sm"
              >
                Get Started
              </button>
            )}
          </div>

          <button
            onClick={onComplete}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

const TogetherPage = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [friendNameInput, setFriendNameInput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const friendsStorageKey = user?.uid ? `togetherFriends_${user.uid}` : 'togetherFriends';

  useEffect(() => {
    setUserId(user?.uid || '');

    const onboardingSeen = localStorage.getItem('togetherOnboardingSeen');
    if (!onboardingSeen) {
      setShowOnboarding(true);
    }

    const savedFriends = JSON.parse(localStorage.getItem(friendsStorageKey) || '[]');
    setFriends(savedFriends);
  }, [user?.uid, friendsStorageKey]);

  const handleAddFriend = (friendId, friendName = 'Friend') => {
    if (!friendId || friends.some((friend) => friend.id === friendId)) {
      return;
    }

    const newFriend = {
      id: friendId,
      name: friendName,
      emoji: ['Friend', 'Buddy', 'Pal'][Math.floor(Math.random() * 3)],
      addedDate: new Date().toISOString(),
    };

    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    localStorage.setItem(friendsStorageKey, JSON.stringify(updatedFriends));

    socialService.sendFriendNotification(
      friendId,
      userId,
      'friend_request',
      `${newFriend.name || 'A friend'} connected with you on Qamar`
    ).catch(() => {});
    socialService.recordActivity(
      userId,
      'friend_added',
      `Connected with ${newFriend.name || 'a friend'}`
    ).catch(() => {});
  };

  const handleRemoveFriend = (friendId) => {
    const updatedFriends = friends.filter((f) => f.id !== friendId);
    setFriends(updatedFriends);
    localStorage.setItem(friendsStorageKey, JSON.stringify(updatedFriends));
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('togetherOnboardingSeen', 'true');
  };

  const handleCopyUserId = async () => {
    if (!userId) return;

    try {
      await navigator.clipboard.writeText(userId);
      setCopyStatus('User ID copied');
    } catch (error) {
      const input = document.createElement('input');
      input.value = userId;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopyStatus('User ID copied');
    }

    window.setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <div className="page-shell">
      {showOnboarding && <TogetherOnboarding onComplete={handleOnboardingComplete} />}

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">
            Qamar Together
          </h1>
          <p className="page-subtitle">
            Connect with friends and support each other&apos;s Ramadan journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <InviteFriend userId={userId} />

            <div className="mt-6 card space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Connect Friend by ID</h3>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">Your User ID</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">{userId || 'Loading...'}</p>
                <button
                  className="btn-secondary w-full mt-2"
                  onClick={handleCopyUserId}
                  disabled={!userId}
                >
                  Copy My User ID
                </button>
                {copyStatus && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">{copyStatus}</p>
                )}
              </div>
              <input
                value={friendIdInput}
                onChange={(e) => setFriendIdInput(e.target.value)}
                placeholder="Friend user ID"
                className="input-field"
              />
              <input
                value={friendNameInput}
                onChange={(e) => setFriendNameInput(e.target.value)}
                placeholder="Friend name (optional)"
                className="input-field"
              />
              <button
                className="btn-primary w-full"
                onClick={() => {
                  handleAddFriend(friendIdInput.trim(), friendNameInput.trim() || 'Friend');
                  setFriendIdInput('');
                  setFriendNameInput('');
                }}
                disabled={!friendIdInput.trim()}
              >
                Add Friend
              </button>
            </div>

            {friends.length > 0 && (
              <div className="mt-6 card space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Connected Friends</h3>
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{friend.emoji}</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {friend.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        aria-label={`Remove ${friend.name}`}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <SharedStreak userId={userId} friends={friends} />
            <Leaderboard friends={friends} />
            <SocialHub currentUserId={userId} friends={friends} />
            <SocialAchievements friends={friends} />
          </div>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Set Goals</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Decide how many days you want to reflect with your group.
            </p>
          </div>
          <div className="card text-center">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Stay Accountable</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Reflect daily and watch your streak grow with friends.
            </p>
          </div>
          <div className="card text-center">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">Celebrate</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Recognize achievements and support each other&apos;s growth.
            </p>
          </div>
        </div>

        <footer className="mt-10 sm:mt-12 py-6 border-t border-ramadan-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-300 text-sm">
          <p>Together, we grow stronger.</p>
        </footer>
      </div>
    </div>
  );
};

export default TogetherPage;
