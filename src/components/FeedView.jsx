import React, { useState } from 'react';
import DailyFeedCard from './DailyFeedCard';
import WeeklyFeedCard from './WeeklyFeedCard';
import MonthlyFeedCard from './MonthlyFeedCard';
import { calculateWeeklyStats, calculateMonthlyStats, getAllWeeks, getAllMonths } from '../utils/statsCalculator';
import { formatDateKey } from '../utils/dateUtils';

const FeedView = ({ entries, visibleCategories, customNames, theme }) => {
  const [feedView, setFeedView] = useState('daily'); // 'daily', 'weekly', 'monthly'
  
  const visibleCategoryKeys = Object.keys(visibleCategories).filter(key => visibleCategories[key]);
  
  // Get all dates with entries, sorted most recent first
  const allDates = Object.keys(entries)
    .map(key => new Date(key))
    .sort((a, b) => b - a);
  
  // Get all weeks and months
  const allWeeks = getAllWeeks(entries);
  const allMonths = getAllMonths(entries);

  return (
    <div className="h-full flex flex-col">
      {/* View Switcher */}
      <div className="flex-shrink-0 bg-white rounded-xl shadow-md p-1 mb-4 flex gap-1">
        <button
          onClick={() => setFeedView('daily')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            feedView === 'daily'
              ? `${theme.complete} text-white shadow-md`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setFeedView('weekly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            feedView === 'weekly'
              ? `${theme.complete} text-white shadow-md`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setFeedView('monthly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            feedView === 'monthly'
              ? `${theme.complete} text-white shadow-md`
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Feed Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {feedView === 'daily' && (
          <>
            {allDates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">No entries yet. Start tracking your days!</p>
              </div>
            ) : (
              allDates.map(date => {
                const dateKey = formatDateKey(date);
                const entry = entries[dateKey];
                return (
                  <DailyFeedCard
                    key={dateKey}
                    date={date}
                    entry={entry}
                    visibleCategories={visibleCategoryKeys}
                    customNames={customNames}
                    theme={theme}
                  />
                );
              })
            )}
          </>
        )}

        {feedView === 'weekly' && (
          <>
            {allWeeks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">No weekly data yet. Keep tracking!</p>
              </div>
            ) : (
              allWeeks.map((week, index) => {
                const weekStats = calculateWeeklyStats(entries, visibleCategoryKeys, week.weekStart, week.weekEnd);
                if (!weekStats) return null;
                return (
                  <WeeklyFeedCard
                    key={index}
                    weekStats={weekStats}
                    customNames={customNames}
                    theme={theme}
                  />
                );
              })
            )}
          </>
        )}

        {feedView === 'monthly' && (
          <>
            {allMonths.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">No monthly data yet. Keep tracking!</p>
              </div>
            ) : (
              allMonths.map((monthData, index) => {
                const monthStats = calculateMonthlyStats(entries, visibleCategoryKeys, monthData.year, monthData.month);
                if (!monthStats) return null;
                return (
                  <MonthlyFeedCard
                    key={index}
                    monthStats={monthStats}
                    customNames={customNames}
                    theme={theme}
                  />
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedView;