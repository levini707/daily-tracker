import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { monthNames } from '../utils/dateUtils';

const MonthlyFeedCard = ({ monthStats, customNames, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState('summary');
  
  if (!monthStats) return null;
  
  const { year, month, daysTracked, totalDays, avgMood, avgRating, categoryStats, moodBreakdown, longestStreak, dayOfWeekStats, moodCorrelations, ratingCorrelations, journalCorrelation } = monthStats;
  
  const moodEmojis = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };
  const moodLabels = { 1: 'Awful', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great' };
  
  const moodColors = {
    1: 'bg-red-400',
    2: 'bg-orange-400',
    3: 'bg-yellow-400',
    4: 'bg-lime-400',
    5: 'bg-emerald-400'
  };
  
  const avgMoodRounded = avgMood ? Math.round(avgMood) : null;
  const completionPercentage = (daysTracked / totalDays) * 100;

  return (
    <div className={`bg-gradient-to-br ${theme.background} rounded-xl shadow-md border-2 border-gray-200 overflow-hidden transition-all hover:shadow-lg`}>
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
            {avgRating && <span className="text-xs font-bold text-blue-600">{avgRating}/10</span>}
            <span className="text-xs text-gray-600">{daysTracked}/{totalDays} days</span>
          </div>
          {longestStreak > 1 && (
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-orange-600 font-semibold">{longestStreak} day streak</span>
            </div>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-white bg-opacity-30">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'summary', label: 'Summary' },
              { id: 'dayAnalysis', label: 'Day Analysis' },
              { id: 'insights', label: 'Insights' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex-1 py-2 text-xs font-semibold transition-all ${
                  activeView === tab.id ? `${theme.complete} text-white` : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {activeView === 'summary' && (
              <>
                <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Tracking Consistency:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${theme.complete}`} style={{ width: `${completionPercentage}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{Math.round(completionPercentage)}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Category Completion:</p>
                  <div className="space-y-1.5">
                    {Object.keys(categoryStats).map(key => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs text-gray-700 w-20">{customNames[key]}:</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${theme.complete}`} style={{ width: `${categoryStats[key].percentage}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-10 text-right">{Math.round(categoryStats[key].percentage)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

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
                            <div className="h-full bg-gradient-to-r from-blue-400 to-green-400" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-xs text-gray-600">{count}d</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeView === 'dayAnalysis' && (
              <div>
                {dayOfWeekStats && Object.keys(dayOfWeekStats).length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {Object.keys(dayOfWeekStats).map(day => {
                        const stats = dayOfWeekStats[day];
                        if (!stats.avgRating && !stats.avgMood) return null;
                        
                        return (
                          <div key={day} className="bg-white bg-opacity-60 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700 mb-2">{stats.name}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Rating */}
                              {stats.avgRating && (
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Rating</p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                      <div className={`h-full ${theme.complete}`} style={{ width: `${(stats.avgRating / 10) * 100}%` }} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 w-8">{stats.avgRating.toFixed(1)}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Mood Squares */}
                              {stats.moods && stats.moods.length > 0 && (
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Mood</p>
                                  <div className="flex gap-1 flex-wrap items-center">
                                    {stats.moods.map((mood, idx) => (
                                      <div 
                                        key={idx} 
                                        className={`w-5 h-5 rounded ${moodColors[mood]} shadow-sm`}
                                        title={moodLabels[mood]}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600">No day of week data yet, keep logging to start discovering insights about your days!</p>
                  </div>
                )}
              </div>
            )}

            {activeView === 'insights' && (
              <div className="space-y-3">
                {(() => {
                  let strongest = null;
                  let strongestType = null;
                  
                  if (moodCorrelations) {
                    Object.keys(moodCorrelations).forEach(cat => {
                      const diff = Math.abs(moodCorrelations[cat].difference);
                      if (diff >= 0.3 && (!strongest || diff > strongest.diff)) {
                        strongest = { cat, diff, actualDiff: moodCorrelations[cat].difference };
                        strongestType = 'mood';
                      }
                    });
                  }
                  
                  if (ratingCorrelations) {
                    Object.keys(ratingCorrelations).forEach(cat => {
                      const diff = Math.abs(ratingCorrelations[cat].difference);
                      if (diff >= 0.5 && (!strongest || diff > strongest.diff)) {
                        strongest = { cat, diff, actualDiff: ratingCorrelations[cat].difference };
                        strongestType = 'rating';
                      }
                    });
                  }
                  
                  if (strongest) {
                    const isPositive = strongest.actualDiff > 0;
                    return (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border-2 border-purple-300">
                        <p className="text-xs font-bold text-purple-800 mb-1 flex items-center gap-1">
                          💡 Key Insight
                          {isPositive ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}
                        </p>
                        <p className="text-sm text-gray-800">
                          {strongestType === 'mood' 
                            ? (isPositive 
                                ? `Completing ${customNames[strongest.cat]} has the biggest positive impact on your mood!`
                                : `Completing ${customNames[strongest.cat]} has the biggest negative impact on your mood.`)
                            : (isPositive
                                ? `${customNames[strongest.cat]} activities make your best days!`
                                : `Completing ${customNames[strongest.cat]} tends to lower your day ratings.`)
                          }
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Mood Impact by Activity:</p>
                  {(() => {
                    if (!moodCorrelations || Object.keys(moodCorrelations).length === 0) {
                      return (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600">No mood correlations found yet, keep logging to start discovering insights about your days!</p>
                        </div>
                      );
                    }
                    
                    const meaningful = Object.keys(moodCorrelations)
                      .filter(cat => Math.abs(moodCorrelations[cat].difference) >= 0.3)
                      .sort((a, b) => Math.abs(moodCorrelations[b].difference) - Math.abs(moodCorrelations[a].difference));
                    
                    if (meaningful.length === 0) {
                      return (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600">No mood correlations found yet, keep logging to start discovering insights about your days!</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-2">
                        {meaningful.map(cat => {
                          const corr = moodCorrelations[cat];
                          const isPositive = corr.difference > 0;
                          
                          return (
                            <div key={cat} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                {isPositive ? (
                                  <ArrowUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 text-red-600 flex-shrink-0" />
                                )}
                                <span className="text-sm font-semibold text-gray-800">
                                  {isPositive 
                                    ? `You're in a better mood when you complete ${customNames[cat]}.`
                                    : `Your mood is worse when you complete ${customNames[cat]}.`
                                  }
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 ml-6">
                                Your mood averages {moodEmojis[Math.round(corr.avgWith)]} {corr.avgWith.toFixed(1)} on days with {customNames[cat]}, 
                                compared to {moodEmojis[Math.round(corr.avgWithout)]} {corr.avgWithout.toFixed(1)} without it.
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Rating Impact by Activity:</p>
                  {(() => {
                    if (!ratingCorrelations || Object.keys(ratingCorrelations).length === 0) {
                      return (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600">No rating correlations found yet, keep logging to start discovering insights about your days!</p>
                        </div>
                      );
                    }
                    
                    const meaningful = Object.keys(ratingCorrelations)
                      .filter(cat => Math.abs(ratingCorrelations[cat].difference) >= 0.5)
                      .sort((a, b) => Math.abs(ratingCorrelations[b].difference) - Math.abs(ratingCorrelations[a].difference));
                    
                    if (meaningful.length === 0) {
                      return (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600">No rating correlations found yet, keep logging to start discovering insights about your days!</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-2">
                        {meaningful.map(cat => {
                          const corr = ratingCorrelations[cat];
                          const isPositive = corr.difference > 0;
                          
                          return (
                            <div key={cat} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                {isPositive ? (
                                  <ArrowUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 text-red-600 flex-shrink-0" />
                                )}
                                <span className="text-sm font-semibold text-gray-800">
                                  {isPositive
                                    ? `You rate days higher when you complete ${customNames[cat]}.`
                                    : `You rate days lower when you complete ${customNames[cat]}.`
                                  }
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 ml-6">
                                Days with {customNames[cat]} average {corr.avgWith.toFixed(1)}/10, 
                                while days without average {corr.avgWithout.toFixed(1)}/10.
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Journaling Impact:</p>
                  {(() => {
                    if (!journalCorrelation || (!journalCorrelation.mood && !journalCorrelation.rating)) {
                      return (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600">No journaling correlations found yet, keep logging to start discovering insights about your days!</p>
                        </div>
                      );
                    }
                    
                    const hasMeaningfulMood = journalCorrelation.mood && Math.abs(journalCorrelation.mood.difference) >= 0.3;
                    const hasMeaningfulRating = journalCorrelation.rating && Math.abs(journalCorrelation.rating.difference) >= 0.5;
                    
                    if (!hasMeaningfulMood && !hasMeaningfulRating) {
                      return (
                        <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600">No journaling correlations found yet, keep logging to start discovering insights about your days!</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-2">
                        {hasMeaningfulMood && (() => {
                          const isPositive = journalCorrelation.mood.difference > 0;
                          return (
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                {isPositive ? (
                                  <ArrowUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 text-red-600 flex-shrink-0" />
                                )}
                                <span className="text-sm font-semibold text-gray-800">
                                  {isPositive ? 'Journaling boosts your mood.' : 'Journaling lowers your mood.'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 ml-6">
                                Your mood is {moodEmojis[Math.round(journalCorrelation.mood.avgWith)]} {journalCorrelation.mood.avgWith.toFixed(1)} when you journal, 
                                versus {moodEmojis[Math.round(journalCorrelation.mood.avgWithout)]} {journalCorrelation.mood.avgWithout.toFixed(1)} when you don't.
                              </p>
                            </div>
                          );
                        })()}
                        {hasMeaningfulRating && (() => {
                          const isPositive = journalCorrelation.rating.difference > 0;
                          return (
                            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                {isPositive ? (
                                  <ArrowUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                                ) : (
                                  <ArrowDown className="w-4 h-4 text-red-600 flex-shrink-0" />
                                )}
                                <span className="text-sm font-semibold text-gray-800">
                                  {isPositive ? 'You rate days higher when you journal.' : 'You rate days lower when you journal.'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 ml-6">
                                Days with journaling average {journalCorrelation.rating.avgWith.toFixed(1)}/10, 
                                compared to {journalCorrelation.rating.avgWithout.toFixed(1)}/10 without.
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyFeedCard;