import React from 'react';

const ProgressBar = ({ completionCount, totalVisible }) => {
  const progressPercentage = totalVisible > 0 ? (completionCount / totalVisible) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Daily Progress</span>
        <span className="text-xs font-bold text-blue-600">{completionCount}/{totalVisible} Complete</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;