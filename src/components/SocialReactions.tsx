import React, { useState, useEffect } from 'react';
import { firestoreService, SocialReaction } from '../services/firestoreService';

interface SocialReactionsProps {
  reflectionId: string;
  isAuthenticated: boolean;
}

const REACTION_EMOJIS = ['❤️', '😊', '🙏', '💪', '✨', '🔥'];

const SocialReactions: React.FC<SocialReactionsProps> = ({ reflectionId, isAuthenticated }) => {
  const [reactions, setReactions] = useState<SocialReaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReactions();
  }, [reflectionId]);

  const loadReactions = async () => {
    try {
      const data = await firestoreService.getReflectionReactions(reflectionId);
      setReactions(data);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleAddReaction = async (emoji: string) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await firestoreService.addReaction(reflectionId, emoji);
      await loadReactions();
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group reactions by emoji
  const reactionGroups = REACTION_EMOJIS.map((emoji) => ({
    emoji,
    count: reactions.filter((r) => r.emoji === emoji).length,
  })).filter((group) => group.count > 0);

  return (
    <div className="mt-4 space-y-2">
      {reactionGroups.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {reactionGroups.map((group) => (
            <button
              key={group.emoji}
              onClick={() => handleAddReaction(group.emoji)}
              disabled={loading || !isAuthenticated}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-semibold transition-all disabled:opacity-50"
              title={`${group.count} reaction${group.count !== 1 ? 's' : ''}`}
            >
              {group.emoji} {group.count}
            </button>
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="flex gap-2 flex-wrap">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleAddReaction(emoji)}
              disabled={loading}
              className="text-xl p-2 hover:bg-gray-100 rounded transition-all disabled:opacity-50"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialReactions;
