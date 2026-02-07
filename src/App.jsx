import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Sparkles } from 'lucide-react';
import LoginForm from './components/auth/LoginForm';
import Calendar from './components/Calendar';
import CategoryCard from './components/CategoryCard';
import DayRating from './components/DayRating';
import ProgressBar from './components/ProgressBar';
import JournalSection from './components/JournalSection';
import SettingsModal from './components/SettingsModal';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { themePresets } from './constants/themes';
import { formatDateKey } from './utils/dateUtils';

const DailyTracker = () => {
  const { currentUser, loading: authLoading, authError, signup, login, logout, setAuthError } = useAuth();
  const { entries, userSettings, loading: dataLoading, saveEntry, saveSettings, setUserSettings } = useUserData(currentUser?.uid);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentEntry, setCurrentEntry] = useState({
    productive: '',
    healthy: '',
    social: '',
    creative: '',
    kind: '',
    mindful: '',
    notes: '',
    rating: null
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Get visible categories based on user settings
  const categories = [
    { key: 'productive', label: userSettings.customNames.productive, color: themePresets[userSettings.theme].categories.productive },
    { key: 'healthy', label: userSettings.customNames.healthy, color: themePresets[userSettings.theme].categories.healthy },
    { key: 'social', label: userSettings.customNames.social, color: themePresets[userSettings.theme].categories.social },
    { key: 'creative', label: userSettings.customNames.creative, color: themePresets[userSettings.theme].categories.creative },
    { key: 'kind', label: userSettings.customNames.kind, color: themePresets[userSettings.theme].categories.kind },
    { key: 'mindful', label: userSettings.customNames.mindful, color: themePresets[userSettings.theme].categories.mindful }
  ].filter(cat => userSettings.visibleCategories[cat.key]);

  // Load entry for selected date
  useEffect(() => {
    if (currentUser) {
      const dateKey = formatDateKey(selectedDate);
      if (entries[dateKey]) {
        setCurrentEntry(entries[dateKey]);
      } else {
        setCurrentEntry({
          productive: '',
          healthy: '',
          social: '',
          creative: '',
          kind: '',
          mindful: '',
          notes: '',
          rating: null
        });
      }
    }
  }, [selectedDate, currentUser, entries]);

  const handleInputChange = (field, value) => {
    const newEntry = { ...currentEntry, [field]: value };
    setCurrentEntry(newEntry);
    
    const dateKey = formatDateKey(selectedDate);
    
    if (currentUser) {
      saveEntry(currentUser.uid, dateKey, newEntry);
    }

    // Check if all visible categories are complete
    const visibleCats = ['productive', 'healthy', 'social', 'creative', 'kind', 'mindful']
      .filter(key => userSettings.visibleCategories[key]);
    const isComplete = visibleCats.every(key => newEntry[key]?.trim() !== '');
    
    if (isComplete && !showCelebration && visibleCats.length > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const getCompletionCount = (entry) => {
    if (!entry) return 0;
    const visibleCategories = ['productive', 'healthy', 'social', 'creative', 'kind', 'mindful']
      .filter(key => userSettings.visibleCategories[key]);
    return visibleCategories.filter(key => entry[key]?.trim() !== '').length;
  };

  const getTotalVisibleCategories = () => {
    return Object.values(userSettings.visibleCategories).filter(v => v).length;
  };

  const getCompletionStatus = (date) => {
    const dateKey = formatDateKey(date);
    const entry = entries[dateKey];
    if (!entry) return 'empty';
    const count = getCompletionCount(entry);
    const total = getTotalVisibleCategories();
    if (count === total && total > 0) return 'complete';
    if (count > total / 2) return 'partial';
    return 'empty';
  };

  const handleMonthChange = (direction) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1));
  };

  const handleUpdateSettings = (newSettings) => {
    if (currentUser) {
      saveSettings(currentUser.uid, newSettings);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentEntry({
      productive: '',
      healthy: '',
      social: '',
      creative: '',
      kind: '',
      mindful: '',
      notes: '',
      rating: null
    });
  };

  // Show login screen if not authenticated
  if (!currentUser) {
    return (
      <LoginForm
        onLogin={login}
        onSignup={signup}
        authError={authError}
        setAuthError={setAuthError}
      />
    );
  }

  // Show loading screen while fetching data
  if (authLoading || dataLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const completionCount = getCompletionCount(currentEntry);
  const totalVisible = getTotalVisibleCategories();

  return (
    <div className={`h-screen bg-gradient-to-br ${themePresets[userSettings.theme].background} flex flex-col overflow-hidden`}>
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-6 py-3 bg-white shadow-sm border-b">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daily Tracker</h1>
            <p className="text-gray-500 text-xs">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{currentUser.email}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Calendar */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-2">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onMonthChange={handleMonthChange}
              getCompletionStatus={getCompletionStatus}
              theme={themePresets[userSettings.theme]}
            />
          </div>

          {/* Right Side - Entry Fields */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-2">
            <ProgressBar
              completionCount={completionCount}
              totalVisible={totalVisible}
            />

            <DayRating
              rating={currentEntry.rating}
              onRatingChange={(rating) => handleInputChange('rating', rating)}
            />

            {/* Celebration Message */}
            {showCelebration && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl shadow-lg p-3 flex items-center animate-bounce flex-shrink-0">
                <Sparkles className="w-5 h-5 mr-2.5" />
                <div>
                  <h3 className="text-base font-semibold">Congratulations!</h3>
                  <p className="text-xs">You've completed all areas today! 🎉</p>
                </div>
              </div>
            )}

            {/* Category Cards */}
            <div className="grid grid-cols-1 gap-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category.key}
                  category={category}
                  value={currentEntry[category.key]}
                  onChange={(value) => handleInputChange(category.key, value)}
                />
              ))}
            </div>

            <JournalSection
              notes={currentEntry.notes}
              onNotesChange={(value) => handleInputChange('notes', value)}
              selectedDate={selectedDate}
            />

            {/* Auto-save indicator */}
            <div className="text-center text-xs text-gray-500 flex-shrink-0 pb-2">
              ✓ Changes saved automatically to cloud
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        userSettings={userSettings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
};

export default DailyTracker;