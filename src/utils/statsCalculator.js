import { formatDateKey } from './dateUtils';

export const calculateDailyStats = (entry, visibleCategories) => {
  if (!entry) return null;
  
  const completedCount = visibleCategories.filter(key => entry[key]?.trim() !== '').length;
  const totalCategories = visibleCategories.length;
  
  return {
    mood: entry.mood || null,
    rating: entry.rating || null,
    completedCount,
    totalCategories,
    notes: entry.notes || '',
    hasData: completedCount > 0 || entry.mood || entry.rating || entry.notes
  };
};

export const calculateWeeklyStats = (entries, visibleCategories, weekStart, weekEnd) => {
  const weekEntries = [];
  const currentDate = new Date(weekStart);
  
  while (currentDate <= weekEnd) {
    const dateKey = formatDateKey(currentDate);
    if (entries[dateKey]) {
      weekEntries.push({
        date: new Date(currentDate),
        ...entries[dateKey]
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  if (weekEntries.length === 0) return null;
  
  // Calculate averages
  const moods = weekEntries.filter(e => e.mood).map(e => e.mood);
  const ratings = weekEntries.filter(e => e.rating).map(e => e.rating);
  const avgMood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : null;
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  
  // Category completion
  const categoryStats = {};
  visibleCategories.forEach(cat => {
    const completed = weekEntries.filter(e => e[cat]?.trim() !== '').length;
    categoryStats[cat] = {
      completed,
      total: weekEntries.length,
      percentage: (completed / weekEntries.length) * 100
    };
  });
  
  // Most/least complete days
  const dayCompletions = weekEntries.map(e => {
    const completed = visibleCategories.filter(key => e[key]?.trim() !== '').length;
    return { date: e.date, completed, total: visibleCategories.length };
  });
  const mostComplete = dayCompletions.sort((a, b) => b.completed - a.completed)[0];
  const leastComplete = dayCompletions.sort((a, b) => a.completed - b.completed)[0];
  
  // Mood breakdown
  const moodBreakdown = {
    1: weekEntries.filter(e => e.mood === 1).length,
    2: weekEntries.filter(e => e.mood === 2).length,
    3: weekEntries.filter(e => e.mood === 3).length,
    4: weekEntries.filter(e => e.mood === 4).length,
    5: weekEntries.filter(e => e.mood === 5).length
  };
  
  return {
    weekStart,
    weekEnd,
    daysTracked: weekEntries.length,
    totalDays: 7,
    avgMood: avgMood ? Math.round(avgMood * 10) / 10 : null,
    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    categoryStats,
    mostComplete,
    leastComplete,
    moodBreakdown
  };
};

export const calculateMonthlyStats = (entries, visibleCategories, year, month) => {
  const monthEntries = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    if (entries[dateKey]) {
      monthEntries.push({
        date,
        ...entries[dateKey]
      });
    }
  }
  
  if (monthEntries.length === 0) return null;
  
  // Calculate averages
  const moods = monthEntries.filter(e => e.mood).map(e => e.mood);
  const ratings = monthEntries.filter(e => e.rating).map(e => e.rating);
  const avgMood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : null;
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  
  // Category completion
  const categoryStats = {};
  visibleCategories.forEach(cat => {
    const completed = monthEntries.filter(e => e[cat]?.trim() !== '').length;
    categoryStats[cat] = {
      completed,
      total: monthEntries.length,
      percentage: (completed / monthEntries.length) * 100
    };
  });
  
  // Mood breakdown
  const moodBreakdown = {
    1: monthEntries.filter(e => e.mood === 1).length,
    2: monthEntries.filter(e => e.mood === 2).length,
    3: monthEntries.filter(e => e.mood === 3).length,
    4: monthEntries.filter(e => e.mood === 4).length,
    5: monthEntries.filter(e => e.mood === 5).length
  };
  
  // Calculate streaks
  const sortedDates = monthEntries
    .map(e => e.date)
    .sort((a, b) => a - b);
  
  let currentStreak = 1;
  let maxStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const diffDays = Math.floor((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return {
    year,
    month,
    daysTracked: monthEntries.length,
    totalDays: daysInMonth,
    avgMood: avgMood ? Math.round(avgMood * 10) / 10 : null,
    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    categoryStats,
    moodBreakdown,
    longestStreak: maxStreak
  };
};

export const getWeekRange = (date) => {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay(); // First day is Sunday
  const weekStart = new Date(curr.setDate(first));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  weekStart.setHours(0, 0, 0, 0);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
};

export const getAllWeeks = (entries) => {
  const dates = Object.keys(entries).map(key => new Date(key)).sort((a, b) => b - a);
  if (dates.length === 0) return [];
  
  const weeks = [];
  const seenWeeks = new Set();
  
  dates.forEach(date => {
    const { weekStart } = getWeekRange(date);
    const weekKey = formatDateKey(weekStart);
    
    if (!seenWeeks.has(weekKey)) {
      seenWeeks.add(weekKey);
      weeks.push(getWeekRange(date));
    }
  });
  
  return weeks;
};

export const getAllMonths = (entries) => {
  const dates = Object.keys(entries).map(key => new Date(key));
  if (dates.length === 0) return [];
  
  const months = new Set();
  dates.forEach(date => {
    months.add(`${date.getFullYear()}-${date.getMonth()}`);
  });
  
  return Array.from(months)
    .map(m => {
      const [year, month] = m.split('-').map(Number);
      return { year, month };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
};