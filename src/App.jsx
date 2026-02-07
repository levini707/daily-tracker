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
  const [selectedTemplate, setSelectedTemplate] = useState('freeform');
  const [userSettings, setUserSettings] = useState({
    theme: 'default',
    visibleCategories: {
      productive: true,
      healthy: true,
      social: true,
      creative: true,
      kind: true,
      mindful: true
    },
    customNames: {
      productive: 'Productive',
      healthy: 'Healthy',
      social: 'Social',
      creative: 'Creative',
      kind: 'Kind',
      mindful: 'Mindful'
    }
  });

  const themePresets = {
    default: {
      name: 'Default',
      background: 'from-blue-50 to-purple-50',
      complete: 'bg-green-600',
      partial: 'bg-green-200',
      categories: {
        productive: 'bg-blue-100 border-blue-300',
        healthy: 'bg-green-100 border-green-300',
        social: 'bg-purple-100 border-purple-300',
        creative: 'bg-pink-100 border-pink-300',
        kind: 'bg-yellow-100 border-yellow-300',
        mindful: 'bg-indigo-100 border-indigo-300'
      }
    },
    ocean: {
      name: 'Ocean',
      background: 'from-cyan-50 to-blue-100',
      complete: 'bg-blue-600',
      partial: 'bg-blue-200',
      categories: {
        productive: 'bg-cyan-100 border-cyan-300',
        healthy: 'bg-teal-100 border-teal-300',
        social: 'bg-sky-100 border-sky-300',
        creative: 'bg-blue-100 border-blue-300',
        kind: 'bg-indigo-100 border-indigo-300',
        mindful: 'bg-violet-100 border-violet-300'
      }
    },
    forest: {
      name: 'Forest',
      background: 'from-green-50 to-emerald-100',
      complete: 'bg-emerald-600',
      partial: 'bg-emerald-200',
      categories: {
        productive: 'bg-lime-100 border-lime-300',
        healthy: 'bg-green-100 border-green-300',
        social: 'bg-emerald-100 border-emerald-300',
        creative: 'bg-teal-100 border-teal-300',
        kind: 'bg-cyan-100 border-cyan-300',
        mindful: 'bg-sky-100 border-sky-300'
      }
    },
    sunset: {
      name: 'Sunset',
      background: 'from-orange-50 to-pink-100',
      complete: 'bg-orange-600',
      partial: 'bg-orange-200',
      categories: {
        productive: 'bg-yellow-100 border-yellow-300',
        healthy: 'bg-orange-100 border-orange-300',
        social: 'bg-red-100 border-red-300',
        creative: 'bg-pink-100 border-pink-300',
        kind: 'bg-rose-100 border-rose-300',
        mindful: 'bg-purple-100 border-purple-300'
      }
    },
    slate: {
      name: 'Slate',
      background: 'from-slate-100 to-slate-200',
      complete: 'bg-slate-600',
      partial: 'bg-slate-300',
      categories: {
        productive: 'bg-slate-100 border-slate-300',
        healthy: 'bg-slate-200 border-slate-400',
        social: 'bg-gray-100 border-gray-300',
        creative: 'bg-zinc-100 border-zinc-300',
        kind: 'bg-stone-100 border-stone-300',
        mindful: 'bg-neutral-100 border-neutral-300'
      }
    },
    lavender: {
      name: 'Deep Lavender',
      background: 'from-purple-100 to-violet-200',
      complete: 'bg-purple-700',
      partial: 'bg-purple-300',
      categories: {
        productive: 'bg-purple-100 border-purple-300',
        healthy: 'bg-violet-100 border-violet-300',
        social: 'bg-fuchsia-100 border-fuchsia-300',
        creative: 'bg-pink-100 border-pink-300',
        kind: 'bg-rose-100 border-rose-300',
        mindful: 'bg-indigo-100 border-indigo-300'
      }
    },
    minimal: {
      name: 'Minimal',
      background: 'from-gray-50 to-slate-100',
      complete: 'bg-slate-700',
      partial: 'bg-slate-300',
      categories: {
        productive: 'bg-gray-100 border-gray-300',
        healthy: 'bg-slate-100 border-slate-300',
        social: 'bg-zinc-100 border-zinc-300',
        creative: 'bg-stone-100 border-stone-300',
        kind: 'bg-neutral-100 border-neutral-300',
        mindful: 'bg-gray-100 border-gray-400'
      }
    }
  };

  const journalTemplates = {
    freeform: {
      name: 'Free Form',
      content: '',
      showPrompt: false
    },
    prompt: {
      name: 'Daily Prompt',
      content: '',
      showPrompt: true
    },
    gratitude: {
      name: 'Gratitude',
      content: `Three things I'm grateful for today:
1. 
2. 
3. 

Why today mattered:
`,
      showPrompt: false
    },
    reflection: {
      name: 'Reflection',
      content: `What went well today:

What could have gone better:

What I learned:

Tomorrow I will:
`,
      showPrompt: false
    },
    wins: {
      name: 'Wins & Challenges',
      content: `Today's wins:
• 
• 

Today's challenges:
• 

How I handled them:
`,
      showPrompt: false
    },
    bullets: {
      name: 'Quick Bullets',
      content: `• 
• 
• 
• 
• 
`,
      showPrompt: false
    }
  };

  const dailyPrompts = [
    "What made you smile today?",
    "What challenged you and how did you handle it?",
    "What are you looking forward to tomorrow?",
    "Who did you help or connect with today?",
    "What's one thing you learned today?",
    "What would you do differently if you could replay today?",
    "What are you proud of accomplishing today?",
    "How did you take care of yourself today?",
    "What moment today will you remember?",
    "What are you letting go of from today?",
    "What made today unique or special?",
    "How did you grow today?",
    "What brought you peace or calm today?",
    "What would you tell your future self about today?",
    "What energized you today?",
    "What drained your energy today?",
    "What kindness did you witness or receive?",
    "What are you curious about after today?",
    "What pattern did you notice about yourself today?",
    "What would make tomorrow even better?"
  ];

  const getDailyPrompt = (date) => {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dailyPrompts[dayOfYear % dailyPrompts.length];
  };

  const applyTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
    const template = journalTemplates[templateKey];
    // Apply template content, replacing current notes
    handleInputChange('notes', template.content);
  };

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

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Journal</h3>
                <select
                  value={selectedTemplate}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                >
                  {Object.keys(journalTemplates).map((key) => (
                    <option key={key} value={key}>{journalTemplates[key].name}</option>
                  ))}
                </select>
              </div>

              {/* Daily Prompt - Only show when Prompt template is selected */}
              {journalTemplates[selectedTemplate].showPrompt && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-blue-800 mb-1">💭 Today's Prompt:</p>
                  <p className="text-sm text-blue-900 italic">{getDailyPrompt(selectedDate)}</p>
                </div>
              )}

              <textarea
                value={currentEntry.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder={
                  selectedTemplate === 'freeform' 
                    ? "Any other thoughts, reflections, or notes about your day..." 
                    : selectedTemplate === 'prompt'
                    ? "Answer the prompt above or write about your day..."
                    : "Fill in the template or write freely..."
                }
                className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                rows="8"
              />
            </div>

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