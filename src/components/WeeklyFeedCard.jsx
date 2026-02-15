import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const WeeklyFeedCard = ({ weekStats, customNames, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!weekStats) return null;
  
  const { weekStart, weekEnd, daysTracked, totalDays, avgMood, avgRating, categoryStats, mostComplete, leastComplete, moodBreakdown } = weekStats;
  
  const weekRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
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

  return (
    <div className={`bg-gradient-to-br ${theme.background} rounded-xl shadow-md border-2 border-gray-200 overflow-hidden transition-all hover:shadow-lg`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white hover:bg-opacity-20 transition-all"
      >
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-gray-800 text-sm">Week of {weekRange}</h3>
          <div className="flex items-center gap-4 mt-2">
            {avgMoodRounded && (
              <div className="flex items-center gap-1">
                <span className="text-lg">{moodEmojis[avgMoodRounded]}</span>
                <span className="text-xs text-gray-600">{avgMood}</span>
              </div>
            )}
            {avgRating && (
              <span className="text-xs font-bold text-blue-600">{avgRating}/10</span>
            )}
            <span className="text-xs text-gray-600">{daysTracked}/{totalDays} days</span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-3 bg-white bg-opacity-30">
          {/* Most/Least Complete Days */}
          {mostComplete && leastComplete && (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-gray-700">Best Day:</p>
                <p className="text-xs text-gray-600">
                  {mostComplete.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-green-700 font-bold">{mostComplete.completed}/{mostComplete.total}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg border border-orange-200">
                <p className="text-xs font-semibold text-gray-700">Needs Work:</p>
                <p className="text-xs text-gray-600">
                  {leastComplete.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-orange-700 font-bold">{leastComplete.completed}/{leastComplete.total}</p>
              </div>
            </div>
          )}

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

          {/* Mood Breakdown */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Mood Breakdown:</p>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(moodBreakdown).map(mood => {
                const count = moodBreakdown[mood];
                if (count === 0) return null;
                return (
                  <div key={mood} className="bg-white bg-opacity-60 px-2 py-1 rounded-lg border border-gray-300">
                    <span className="text-sm">{moodEmojis[mood]}</span>
                    <span className="text-xs text-gray-700 ml-1">{count}d</span>
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

export default WeeklyFeedCard;