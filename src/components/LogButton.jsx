import React from 'react';

const LogButton = ({ isDisabled, onClick, loading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || loading}
      aria-label="Log reflection entry"
      aria-busy={loading}
      className="btn-primary w-full"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving...
        </span>
      ) : (
        '📝 Log Reflection'
      )}
    </button>
  );
};

export default LogButton;
