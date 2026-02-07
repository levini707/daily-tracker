import React from 'react';
import { themePresets } from '../constants/themes';

const SettingsModal = ({ show, onClose, userSettings, onUpdateSettings }) => {
  if (!show) return null;

  const updateTheme = (themeKey) => {
    onUpdateSettings({ ...userSettings, theme: themeKey });
  };

  const toggleCategory = (categoryKey, checked) => {
    onUpdateSettings({
      ...userSettings,
      visibleCategories: {
        ...userSettings.visibleCategories,
        [categoryKey]: checked
      }
    });
  };

  const updateCategoryName = (categoryKey, name) => {
    onUpdateSettings({
      ...userSettings,
      customNames: {
        ...userSettings.customNames,
        [categoryKey]: name
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Presets */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Theme</h3>
            <p className="text-sm text-gray-600 mb-4">Choose a color scheme for your tracker</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.keys(themePresets).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => updateTheme(themeKey)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userSettings.theme === themeKey
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className={`h-8 rounded bg-gradient-to-r ${themePresets[themeKey].background} mb-2`}></div>
                  <p className="font-semibold text-sm text-gray-800">{themePresets[themeKey].name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Categories */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Visible Categories</h3>
            <p className="text-sm text-gray-600 mb-4">Choose which categories to track</p>
            <div className="space-y-3">
              {['productive', 'healthy', 'social', 'creative', 'kind', 'mindful'].map((key) => (
                <label key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.visibleCategories[key]}
                    onChange={(e) => toggleCategory(key, e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-800 capitalize">{userSettings.customNames[key]}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Note: You need at least one category visible</p>
          </div>

          {/* Custom Category Names */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Change Your Categories</h3>
            <p className="text-sm text-gray-600 mb-4">Name your categories</p>
            <div className="space-y-3">
              {['productive', 'healthy', 'social', 'creative', 'kind', 'mindful'].map((key, index) => (
                <div key={key} className="flex items-center gap-3">
                  <label className="w-28 text-sm font-medium text-gray-600">
                    Category {index + 1}:
                  </label>
                  <input
                    type="text"
                    value={userSettings.customNames[key]}
                    onChange={(e) => updateCategoryName(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder={`Enter name for category ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;