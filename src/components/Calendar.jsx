import React from 'react';
import { getDaysInMonth, monthNames } from '../utils/dateUtils';

const Calendar = ({ selectedDate, onDateSelect, onMonthChange, getCompletionStatus, theme }) => {
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate);
  const days = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-12"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const status = getCompletionStatus(date);
    const isSelected = date.toDateString() === selectedDate.toDateString();
    
    let bgColor = 'bg-gray-50 hover:bg-gray-100';
    if (status === 'complete') bgColor = `${theme.complete} hover:bg-opacity-90 text-white font-bold`;
    else if (status === 'partial') bgColor = `${theme.partial} hover:bg-opacity-90`;
    
    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(date)}
        className={`h-12 border rounded-lg flex items-center justify-center text-sm font-medium transition-all ${bgColor} ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(-1)}
          className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">{monthNames[month]} {year}</h2>
        <button
          onClick={() => onMonthChange(1)}
          className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={idx} className="text-center font-medium text-gray-600 text-xs">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
};

export default Calendar;