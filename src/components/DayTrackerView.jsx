import React from 'react';

const DayTrackerView = ({ trackerData, onTrackerChange, enabledItems }) => {
  const { habits, dayDetails, nightDetails } = enabledItems;
  const currentTrackers = trackerData || { habits: {}, dayDetails: {}, nightDetails: {} };

  const handleCheck = (section, itemId, checked) => {
    onTrackerChange({
      ...currentTrackers,
      [section]: {
        ...currentTrackers[section],
        [itemId]: checked
      }
    });
  };

  const renderSection = (title, items, section) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map(item => (
            <label
              key={item.id}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                currentTrackers[section]?.[item.id]
                  ? 'bg-green-50 border border-green-300'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={currentTrackers[section]?.[item.id] || false}
                onChange={(e) => handleCheck(section, item.id, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-gray-800">{item.name}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {renderSection('Habits', habits, 'habits')}
      {renderSection('Day Details', dayDetails, 'dayDetails')}
      {renderSection('Night Details', nightDetails, 'nightDetails')}
      
      {(!habits || habits.length === 0) && (!dayDetails || dayDetails.length === 0) && (!nightDetails || nightDetails.length === 0) && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-2">No tracker items enabled yet.</p>
          <p className="text-xs text-gray-500">Go to Settings to add habits and details to track!</p>
        </div>
      )}
    </div>
  );
};

export default DayTrackerView;