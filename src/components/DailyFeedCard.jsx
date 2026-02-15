import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DailyFeedCard = ({ date, entry, visibleCategories, customNames, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  
  // Calculate completion
  const completedCount = visibleCategories.filter(key => entry[key]?.trim() !== '').length;
  const totalCategories = visibleCategories.length;
  
  // Mood emoji mapping
  const moodEmojis = {
    1: '😢',
    2: '😕', 
    3: '😐',
    4: '🙂',
    5: '😄'
  };
  
  const truncateNotes = (text, maxLength = 60) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`bg-gradient-to-br ${theme.background} rounded-xl shadow-md border-2 border-gray-200 overflow-hidden transition-all hover:shadow-lg`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white hover:bg-opacity-20 transition-all"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 text-sm">{dateStr}</h3>
            <div className="flex items-center gap-3 mt-1">
              {entry.mood && (
                <span className="text-xl">{moodEmojis[entry.mood]}</span>
              )}
              {entry.rating && (
                <span className="text-xs font-bold text-blue-600">{entry.rating}/10</span>
              )}
              <span className="text-xs text-gray-600">{completedCount}/{totalCategories} complete</span>
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Notes Preview - Always Visible */}
      {!isExpanded && entry.notes && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-700 italic">"{truncateNotes(entry.notes)}"</p>
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-3 bg-white bg-opacity-30">
          {/* Categories */}
          <div className="space-y-2">
            {visibleCategories.map(key => {
              const value = entry[key];
              const isCompleted = value?.trim() !== '';
              return (
                <div key={key} className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100 border border-green-300' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">{customNames[key]}:</span>
                    {isCompleted && <span className="text-green-600 text-xs">✓</span>}
                  </div>
                  {isCompleted && (
                    <p className="text-xs text-gray-600 mt-1">{value}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Full Notes */}
          {entry.notes && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-gray-700 mb-1">Journal:</p>
              <p className="text-xs text-gray-700 whitespace-pre-wrap">{entry.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyFeedCard;