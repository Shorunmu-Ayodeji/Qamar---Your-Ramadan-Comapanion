import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const moodEmojis = {
  peaceful: '😌',
  sad: '😔',
  happy: '😃',
  tired: '😴',
  confused: '😕',
};

const ReflectionSummary = ({ reflections }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const difficultyColor = (difficulty) => {
    const map = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800',
    };
    return map[difficulty] || map[3];
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('reflections-export');
      const canvas = await html2canvas(element, { backgroundColor: '#fef3e2', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save('reflection-timeline.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Reflection Timeline</h2>
        {reflections.length > 0 && (
          <button onClick={exportToPDF} disabled={isExporting} className="btn-secondary text-sm w-full sm:w-auto">
            {isExporting ? 'Exporting...' : 'Export to PDF'}
          </button>
        )}
      </div>

      {reflections.length === 0 ? (
        <div className="card text-center py-10 sm:py-12">
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No reflections yet. Start your journey above.</p>
        </div>
      ) : (
        <div id="reflections-export" className="space-y-3">
          {reflections.map((reflection) => (
            <div
              key={reflection.id}
              className="card cursor-pointer hover:shadow-xl transition-all duration-200"
              onClick={() => setExpandedId(expandedId === reflection.id ? null : reflection.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="text-3xl sm:text-4xl pt-1">{moodEmojis[reflection.mood] || '🌙'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <time className="text-xs text-gray-500 dark:text-gray-400 font-medium">{formatDate(reflection.date)}</time>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${difficultyColor(reflection.difficulty)}`}>
                        {'★'.repeat(reflection.difficulty)}
                      </div>
                    </div>
                    {expandedId === reflection.id ? (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-2 break-words">{reflection.reflection}</p>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 break-words">{reflection.reflection}</p>
                    )}
                  </div>
                </div>
                <div className="text-lg sm:text-xl text-gray-400 dark:text-gray-500 ml-2">{expandedId === reflection.id ? '▼' : '▶'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReflectionSummary;
