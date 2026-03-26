import React, { useEffect, useMemo, useState } from 'react';
import socialService from '../services/socialService';

const formatDate = (value) => {
  if (!value) return 'just now';
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleString();
};

const SocialHub = ({ currentUserId, friends = [] }) => {
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);

  const selectedFriend = useMemo(
    () => friends.find((friend) => friend.id === selectedFriendId),
    [friends, selectedFriendId]
  );

  useEffect(() => {
    if (!currentUserId) {
      setMessages([]);
      return () => {};
    }

    if (!selectedFriendId) {
      setMessages([]);
      return () => {};
    }
    return socialService.subscribeToConversation(currentUserId, selectedFriendId, setMessages);
  }, [currentUserId, selectedFriendId]);

  useEffect(() => {
    if (!currentUserId) {
      setNotifications([]);
      return () => {};
    }
    return socialService.subscribeToFriendNotifications(currentUserId, setNotifications);
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      setActivities([]);
      return () => {};
    }
    const visibleIds = [currentUserId, ...friends.map((friend) => friend.id)];
    return socialService.subscribeToActivityFeed(visibleIds, setActivities);
  }, [currentUserId, friends]);

  const handleSendMessage = async () => {
    if (!selectedFriendId || !messageText.trim()) return;

    const text = messageText.trim();
    await socialService.sendDirectMessage(currentUserId, selectedFriendId, text);
    await socialService.sendFriendNotification(
      selectedFriendId,
      currentUserId,
      'message',
      `New message: ${text.slice(0, 60)}${text.length > 60 ? '...' : ''}`
    );
    await socialService.recordActivity(currentUserId, 'message', `Sent a message to ${selectedFriend?.name || 'friend'}`, {
      toUserId: selectedFriendId,
    });
    setMessageText('');
  };

  if (!friends.length) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Social Hub</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Add friends to unlock direct messages, notifications, and activity feed.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="card xl:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Direct Messages</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedFriendId}
            onChange={(e) => setSelectedFriendId(e.target.value)}
            className="input-field flex-1"
          >
            <option value="">Select a friend</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name || friend.id}
              </option>
            ))}
          </select>
          <div className="flex gap-2 flex-1">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={selectedFriendId ? 'Write a message...' : 'Select a friend first'}
              className="input-field flex-1"
              disabled={!selectedFriendId}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedFriendId || !messageText.trim()}
              className="btn-primary"
            >
              Send
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 max-h-72 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet.</p>
          ) : (
            messages.map((message) => {
              const isMine = message.fromUserId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg text-sm ${isMine ? 'bg-ramadan-100 dark:bg-ramadan-900/30 ml-8' : 'bg-white dark:bg-gray-900 mr-8 border border-gray-200 dark:border-gray-700'}`}
                >
                  <p className="text-gray-900 dark:text-white">{message.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(message.createdAt)}</p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
            Firestore Free Tier (Spark) Chat Limits
          </h3>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            50,000 reads/day, 20,000 writes/day, 20,000 deletes/day, 1 GiB storage, 10 GiB egress/month.
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Current chat flow writes about 3 docs per message, so about 6,600 messages/day before hitting write limits.
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Roughly: 600-700 active users/day at 10 messages each, or 2,000+ users/day at 3 messages each.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Friend Notifications</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-900 dark:text-white">{item.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Real-time Activity</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet.</p>
            ) : (
              activities.map((item) => (
                <div key={item.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-900 dark:text-white">{item.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialHub;
