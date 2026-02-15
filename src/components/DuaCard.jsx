import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const categoryEmojis = {
  wealth: '💰',
  family: '👨‍👩‍👧‍👦',
  peace: '☮️',
  discipline: '💪',
  career: '🎯',
  marriage: '💖',
};

const DuaCard = ({ dua, category }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const cardRef = useRef(null);

  const handleShare = async () => {
    if (!dua) return;

    const shareText = `${dua.english}\n\n${dua.arabic}\n\nShared from Qamar`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "A Beautiful Du'a", text: shareText });
      } catch {
        // user canceled
      }
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setShareMessage('Copied to clipboard');
    setTimeout(() => setShareMessage(''), 1800);
  };

  const exportAsImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#fef3e2',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `dua-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!dua) {
    return (
      <div className="card text-center py-10 sm:py-12 opacity-70">
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No du'a selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div
        ref={cardRef}
        className="card rounded-2xl overflow-hidden relative animate-scale-in border border-ramadan-100 dark:border-ramadan-900/40"
        style={{ background: 'linear-gradient(135deg, #fef3e2 0%, #fce8c6 100%)' }}
      >
        <div className="absolute top-0 right-0 text-5xl sm:text-6xl opacity-10">☪️</div>
        <div className="absolute bottom-0 left-0 text-4xl sm:text-5xl opacity-10">☪️</div>

        <div className="relative z-10 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl">{categoryEmojis[category] || '🌙'}</span>
            <span className="text-[11px] sm:text-xs font-semibold text-ramadan-700 uppercase tracking-wider">
              {(category || 'general').charAt(0).toUpperCase() + (category || 'general').slice(1)} Du'a
            </span>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-2xl sm:text-3xl text-ramadan-800 font-bold leading-relaxed break-words" dir="rtl">
              {dua.arabic}
            </p>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-0.5 bg-ramadan-500" />
            <span className="text-ramadan-500">☪️</span>
            <div className="w-8 h-0.5 bg-ramadan-500" />
          </div>

          <p className="text-center text-sm text-gray-700 italic break-words">{dua.transliteration}</p>

          <div className="bg-white/70 rounded-xl p-4">
            <p className="text-center text-gray-800 leading-relaxed break-words">"{dua.english}"</p>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-600">May Allah accept from us.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <button onClick={handleShare} className="btn-secondary text-sm w-full" aria-label="Share du'a">
          Share
        </button>
        <button onClick={exportAsImage} disabled={isExporting} className="btn-secondary text-sm w-full" aria-label="Export du'a as image">
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
      </div>

      {shareMessage && <div role="alert" aria-live="polite" className="text-center text-sm text-green-600 dark:text-green-400 font-medium">{shareMessage}</div>}
    </div>
  );
};

export default DuaCard;
