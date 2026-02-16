import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { suggestedHabits, suggestedDayDetails, suggestedNightDetails } from '../constants/dayTrackerItems';

const TrackerSettings = ({ trackerSettings, onUpdateTrackerSettings }) => {
  const [showAddCustom, setShowAddCustom] = useState(null); // 'habits', 'dayDetails', 'nightDetails'
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('');

  const toggleItem = (section, itemId) => {
    const currentItems = trackerSettings[section] || [];
    const exists = currentItems.find(i => i.id === itemId);
    
    if (exists) {
      // Remove item
      onUpdateTrackerSettings({
        ...trackerSettings,
        [section]: currentItems.filter(i => i.id !== itemId)
      });
    } else {
      // Add item - find it in suggested lists
      let item = null;
      if (section === 'habits') {
        Object.values(suggestedHabits).forEach(category => {
          const found = category.find(i => i.id === itemId);
          if (found) item = found;
        });
      } else if (section === 'dayDetails') {
        Object.values(suggestedDayDetails).forEach(category => {
          const found = category.find(i => i.id === itemId);
          if (found) item = found;
        });
      } else if (section === 'nightDetails') {
        Object.values(suggestedNightDetails).forEach(category => {
          const found = category.find(i => i.id === itemId);
          if (found) item = found;
        });
      }
      
      if (item) {
        onUpdateTrackerSettings({
          ...trackerSettings,
          [section]: [...currentItems, item]
        });
      }
    }
  };

  const addCustomItem = (section) => {
    if (!customName.trim()) return;
    
    const newItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      icon: customIcon || '✓',
      custom: true
    };
    
    const currentItems = trackerSettings[section] || [];
    onUpdateTrackerSettings({
      ...trackerSettings,
      [section]: [...currentItems, newItem]
    });
    
    setCustomName('');
    setCustomIcon('');
    setShowAddCustom(null);
  };

  const removeCustomItem = (section, itemId) => {
    const currentItems = trackerSettings[section] || [];
    onUpdateTrackerSettings({
      ...trackerSettings,
      [section]: currentItems.filter(i => i.id !== itemId)
    });
  };

  const isEnabled = (section, itemId) => {
    const currentItems = trackerSettings[section] || [];
    return currentItems.some(i => i.id === itemId);
  };

  const renderSection = (title, section, suggestedItems) => {
    const currentItems = trackerSettings[section] || [];
    const customItems = currentItems.filter(i => i.custom);

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={() => setShowAddCustom(section)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-semibold"
          >
            <Plus className="w-3 h-3" />
            Add Custom
          </button>
        </div>

        {/* Custom Items */}
        {customItems.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Your Custom Items:</p>
            <div className="flex flex-wrap gap-2">
              {customItems.map(item => (
                <div key={item.id} className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-300 rounded-lg">
                  <span>{item.icon}</span>
                  <span className="text-xs">{item.name}</span>
                  <button
                    onClick={() => removeCustomItem(section, item.id)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Items by Category */}
        {Object.keys(suggestedItems).map(category => (
          <div key={category} className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">{category}:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedItems[category].map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(section, item.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isEnabled(section, item.id)
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Add Custom Modal */}
        {showAddCustom === section && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Add Custom {title.slice(0, -1)}</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    placeholder="💧"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Drink water"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addCustomItem(section)}
                    disabled={!customName.trim()}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCustom(null);
                      setCustomName('');
                      setCustomIcon('');
                    }}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-semibold mb-1">📊 Day Tracker</p>
        <p className="text-xs text-blue-700">Enable suggested items or add your own. Only enabled items appear in your Journal.</p>
      </div>
      
      {renderSection('Habits', 'habits', suggestedHabits)}
      {renderSection('Day Details', 'dayDetails', suggestedDayDetails)}
      {renderSection('Night Details', 'nightDetails', suggestedNightDetails)}
    </div>
  );
};

export default TrackerSettings;