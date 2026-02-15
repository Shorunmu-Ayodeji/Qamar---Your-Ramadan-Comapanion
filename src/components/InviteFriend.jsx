import React, { useMemo, useState } from 'react';

const InviteFriend = ({ userId = '' }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [shareMethod, setShareMethod] = useState('link');

  const shareLink = useMemo(
    () => `${window.location.origin}?ref=${userId || 'unknown-user'}`,
    [userId]
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyMessage('Link copied to clipboard');
    } catch {
      setCopyMessage('Copy failed. Please copy manually.');
    }
    setTimeout(() => setCopyMessage(''), 1800);
  };

  const handleSendEmail = () => {
    if (!inviteEmail.trim()) return;
    const subject = 'Join me on Qamar';
    const body = `I am using Qamar to track Ramadan reflections. Join me:\n\n${shareLink}`;
    window.location.href = `mailto:${inviteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setInviteEmail('');
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Invite Friends</h2>

      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setShareMethod('link')}
          className={`flex-1 px-3 py-2 rounded-lg transition-all text-sm font-semibold ${
            shareMethod === 'link'
              ? 'bg-ramadan-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Share via link"
        >
          Link
        </button>
        <button
          onClick={() => setShareMethod('email')}
          className={`flex-1 px-3 py-2 rounded-lg transition-all text-sm font-semibold ${
            shareMethod === 'email'
              ? 'bg-ramadan-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-label="Share via email"
        >
          Email
        </button>
      </div>

      {shareMethod === 'link' && (
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Your shareable link</p>
            <p className="text-sm text-gray-900 dark:text-white break-all font-mono font-semibold">{shareLink}</p>
          </div>

          <button onClick={handleCopyLink} className="btn-primary w-full" aria-label="Copy link to clipboard">
            Copy Link
          </button>

          {copyMessage && <div role="alert" aria-live="polite" className="text-center text-sm text-green-600 dark:text-green-400 font-medium">{copyMessage}</div>}

          <div className="bg-ramadan-50 dark:bg-ramadan-900/20 p-4 sm:p-5 rounded-xl border border-dashed border-ramadan-300 dark:border-ramadan-700 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Share this link via messaging apps or social platforms.</p>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Join Qamar', text: `Join me on Qamar: ${shareLink}` });
                } else {
                  handleCopyLink();
                }
              }}
              className="btn-secondary text-sm w-full sm:w-auto"
              aria-label="Open native share dialog"
            >
              Share
            </button>
          </div>
        </div>
      )}

      {shareMethod === 'email' && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="invite-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Friend&apos;s Email
            </label>
            <input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
              placeholder="friend@example.com"
              className="input-field"
              aria-label="Friend's email address"
            />
          </div>
          <button onClick={handleSendEmail} disabled={!inviteEmail.trim()} className="btn-primary w-full" aria-label="Send invitation email">
            Send Invitation
          </button>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-700 dark:text-blue-200">
        <p className="font-semibold mb-1">How it works</p>
        <p>Share your link with friends, then connect using user IDs in Together.</p>
      </div>
    </div>
  );
};

export default InviteFriend;
