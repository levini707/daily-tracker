import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { monthNames } from '../utils/dateUtils';

const MonthlyFeedCard = ({ monthStats, customNames, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!monthStats) return null;
  
  const { year, month, daysTracked, totalDays, avgMood, avgRating, categoryStats, moodBreakdown, longestStreak } = monthStats;
  
  const moodEmojis = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😄'
  };
  
  const moodLabels = {
    1: 'Awful',
    2: 'Bad',
    3: 'Okay',
    4: 'Good',
    5: 'Great'
  };
  
  const avgMoodRounded = avgMood ? Math.round(avgMood) : null;
  const completionPercentage = (daysTracked / totalDays) * 100;

  return (
    <div className={`bg-gradient-to-br ${theme.background} rounded-xl shadow-md border-2 border-gray-200 overflow-hidden transition-all hover:shadow-lg`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white hover:bg-opacity-20 transition-all"
      >
        <div className="flex-1 text-left">
          <h3 className="font-bold text-gray-800">{monthNames[month]} {year}</h3>
          <div className="flex items-center gap-4 mt-2">
            {avgMoodRounded && (
              <div className="flex items-center gap-1">
                <span className="text-xl">{moodEmojis[avgMoodRounded]}</span>
                <span className="text-xs text-gray-600">{avgMood}</span>
              </div>
            )}
            {avgRating && (
              <span className="text-xs font-bold text-blue-600">{avgRating}/10</span>
            )}
            <span className="text-xs text-gray-600">{daysTracked}/{totalDays} days</span>
          </div>
          {longestStreak > 1 && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-orange-600 font-semibold">{longestStreak} day streak</span>
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-3 bg-white bg-opacity-30">
          {/* Tracking Consistency */}
          <div className="bg-white bg-opacity-60 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-1">Tracking Consistency:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${theme.complete} transition-all`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700">{Math.round(completionPercentage)}%</span>
            </div>
          </div>

          {/* Category Completion */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Category Completion:</p>
            <div className="space-y-1.5">
              {Object.keys(categoryStats).map(key => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-gray-700 w-20">{customNames[key]}:</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${theme.complete} transition-all`}
                      style={{ width: `${categoryStats[key].percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-10 text-right">
                    {Math.round(categoryStats[key].percentage)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Distribution */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Mood Distribution:</p>
            <div className="space-y-1">
              {Object.keys(moodBreakdown).reverse().map(mood => {
                const count = moodBreakdown[mood];
                if (count === 0) return null;
                const percentage = (count / daysTracked) * 100;
                return (
                  <div key={mood} className="flex items-center gap-2">
                    <span className="text-sm">{moodEmojis[mood]}</span>
                    <span className="text-xs text-gray-700 w-12">{moodLabels[mood]}:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{count}d</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyFeedCard;