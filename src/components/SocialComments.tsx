import React, { useState, useEffect } from 'react';
import { firestoreService, SocialComment } from '../services/firestoreService';

interface SocialCommentsProps {
  reflectionId: string;
  isAuthenticated: boolean;
}

const SocialComments: React.FC<SocialCommentsProps> = ({ reflectionId, isAuthenticated }) => {
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadComments();
  }, [reflectionId]);

  const loadComments = async () => {
    try {
      const data = await firestoreService.getReflectionComments(reflectionId);
      setComments(data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setLoading(true);
    try {
      await firestoreService.addComment(reflectionId, newComment);
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-ramadan-600 transition-all"
      >
        💬 Comments ({comments.length})
        <span>{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="space-y-2 mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                maxLength={200}
                className="input-field resize-none h-20 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="btn-primary text-sm w-full"
              >
                {loading ? '⏳ Posting...' : '💬 Post Comment'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-600">Log in to comment</p>
          )}

          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {comment.displayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {comment.createdAt.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-3">
              No comments yet. Be the first to share!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialComments;
