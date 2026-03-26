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
  const [friendships, setFriendships] = useState([]);
  const [userId, setUserId] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [friendNameInput, setFriendNameInput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserId(user?.uid || '');
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setUserName(profile?.name || user?.displayName || 'User');

    const onboardingSeen = localStorage.getItem('togetherOnboardingSeen');
    if (!onboardingSeen) {
      setShowOnboarding(true);
    }
  }, [user?.uid, user?.displayName]);

  useEffect(() => {
    if (!userId) return () => {};
    return socialService.subscribeToFriendships(userId, setFriendships);
  }, [userId]);

  const acceptedFriends = friendships
    .filter((item) => item.status === 'accepted')
    .map((item) => {
      const otherId = item.users.find((id) => id !== userId) || '';
      const otherName =
        item.requesterId === userId
          ? (item.recipientName || otherId)
          : (item.requesterName || otherId);
      return {
        id: otherId,
        name: otherName,
        addedDate: item.updatedAt?.toDate ? item.updatedAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

  const pendingSent = friendships.filter((item) => item.status === 'pending' && item.requesterId === userId);
  const pendingReceived = friendships.filter((item) => item.status === 'pending' && item.requesterId !== userId);

  const handleSendFriendRequest = async (friendId, friendName = '') => {
    if (!friendId || !userId || friendId === userId) return;
    setRequestStatus('');
    try {
      await socialService.sendFriendRequest(userId, friendId, userName, friendName);
      socialService.sendFriendNotification(
        friendId,
        userId,
        'friend_request',
        `${userName} sent you a friend request`
      ).catch(() => {});
      socialService.recordActivity(userId, 'friend_request', `Sent friend request to ${friendName || friendId}`).catch(() => {});
      setRequestStatus('Friend request sent.');
    } catch (error) {
      setRequestStatus(error?.message || 'Could not send friend request.');
    }
  };

  const handleAcceptRequest = async (otherUserId) => {
    try {
      await socialService.acceptFriendRequest(userId, otherUserId);
      await socialService.sendFriendNotification(
        otherUserId,
        userId,
        'friend_accept',
        `${userName} accepted your friend request`
      );
      await socialService.recordActivity(userId, 'friend_accept', `Accepted friend request from ${otherUserId}`);
    } catch (error) {
      setRequestStatus('Could not accept request.');
    }
  };

  const handleDeclineRequest = async (otherUserId) => {
    try {
      await socialService.declineFriendRequest(userId, otherUserId);
      await socialService.recordActivity(userId, 'friend_decline', `Declined friend request from ${otherUserId}`);
    } catch (error) {
      setRequestStatus('Could not decline request.');
    }
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
                  handleSendFriendRequest(friendIdInput.trim(), friendNameInput.trim());
                  setFriendIdInput('');
                  setFriendNameInput('');
                }}
                disabled={!friendIdInput.trim()}
              >
                Send Friend Request
              </button>
              {requestStatus && <p className="text-xs text-gray-600 dark:text-gray-300">{requestStatus}</p>}
            </div>

            {pendingReceived.length > 0 && (
              <div className="mt-6 card space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Friend Requests</h3>
                <div className="space-y-2">
                  {pendingReceived.map((item) => {
                    const otherId = item.users.find((id) => id !== userId) || '';
                    const requesterName = item.requesterName || otherId;
                    return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{requesterName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{otherId}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAcceptRequest(otherId)} className="btn-primary text-xs px-2 py-1">Accept</button>
                        <button onClick={() => handleDeclineRequest(otherId)} className="btn-secondary text-xs px-2 py-1">Decline</button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pendingSent.length > 0 && (
              <div className="mt-6 card space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Sent Requests</h3>
                <div className="space-y-2">
                  {pendingSent.map((item) => {
                    const otherId = item.users.find((id) => id !== userId) || '';
                    const recipientName = item.recipientName || otherId;
                    return (
                      <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{recipientName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{otherId}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Pending approval</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {acceptedFriends.length > 0 && (
              <div className="mt-6 card space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Connected Friends</h3>
                <div className="space-y-2">
                  {acceptedFriends.map((friend) => (
                    <div key={friend.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{friend.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Approved</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <SharedStreak userId={userId} friends={acceptedFriends} />
            <Leaderboard friends={acceptedFriends} />
            <SocialHub currentUserId={userId} friends={acceptedFriends} />
            <SocialAchievements friends={acceptedFriends} />
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
