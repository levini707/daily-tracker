import React, { useState, useEffect } from 'react';
import { Calendar, Check, Sparkles, User, LogOut, Mail, Lock, Eye, EyeOff, Settings } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzrqbqc9BsIzzn5e_9ewS1Ji7r4BBzV7w",
  authDomain: "daily-tracker-abd4f.firebaseapp.com",
  projectId: "daily-tracker-abd4f",
  storageBucket: "daily-tracker-abd4f.firebasestorage.app",
  messagingSenderId: "818106842625",
  appId: "1:818106842625:web:7f6eb24d33465cad930a00",
  measurementId: "G-5K3N55RRBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DailyTracker = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState({});
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
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
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

  const categories = [
    { key: 'productive', label: userSettings.customNames.productive, color: themePresets[userSettings.theme].categories.productive },
    { key: 'healthy', label: userSettings.customNames.healthy, color: themePresets[userSettings.theme].categories.healthy },
    { key: 'social', label: userSettings.customNames.social, color: themePresets[userSettings.theme].categories.social },
    { key: 'creative', label: userSettings.customNames.creative, color: themePresets[userSettings.theme].categories.creative },
    { key: 'kind', label: userSettings.customNames.kind, color: themePresets[userSettings.theme].categories.kind },
    { key: 'mindful', label: userSettings.customNames.mindful, color: themePresets[userSettings.theme].categories.mindful }
  ].filter(cat => userSettings.visibleCategories[cat.key]);

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadUserData(user.uid);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data().entries || {};
        setEntries(data);
        const today = formatDateKey(selectedDate);
        if (data[today]) {
          setCurrentEntry(data[today]);
        }
        
        // Load user settings
        const settings = docSnap.data().settings;
        if (settings) {
          setUserSettings(settings);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const saveUserSettings = async (userId, settings) => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, { settings: settings }, { merge: true });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const saveUserData = async (userId, data) => {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, { entries: data }, { merge: true });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

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

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Email already in use. Try logging in instead.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError('Invalid email or password.');
      } else {
        setAuthError('Authentication failed. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEntries({});
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
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleInputChange = (field, value) => {
    const newEntry = { ...currentEntry, [field]: value };
    setCurrentEntry(newEntry);
    
    const dateKey = formatDateKey(selectedDate);
    const newEntries = { ...entries, [dateKey]: newEntry };
    setEntries(newEntries);
    
    if (currentUser) {
      saveUserData(currentUser.uid, newEntries);
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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-14"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getCompletionStatus(date);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      const theme = themePresets[userSettings.theme];
      let bgColor = 'bg-gray-50 hover:bg-gray-100';
      if (status === 'complete') bgColor = `${theme.complete} hover:bg-opacity-90 text-white font-bold`;
      else if (status === 'partial') bgColor = `${theme.partial} hover:bg-opacity-90`;
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-14 border rounded-lg flex items-center justify-center text-base transition-all ${bgColor} ${
            isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold">{monthNames[month]} {year}</h2>
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-center font-semibold text-gray-600 text-sm">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    );
  };

  // Login/Signup Screen
  if (!currentUser) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Daily Tracker</h1>
          </div>
          <p className="text-gray-600 text-center mb-6">
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="flex-1 outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500">
                <Lock className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  className="flex-1 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError('');
              }}
              className="text-blue-500 hover:text-blue-600"
            >
              {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const completionCount = getCompletionCount(currentEntry);
  const totalVisible = getTotalVisibleCategories();
  const progressPercentage = totalVisible > 0 ? (completionCount / totalVisible) * 100 : 0;

  return (
    <div className={`h-screen bg-gradient-to-br ${themePresets[userSettings.theme].background} flex flex-col overflow-hidden`}>
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-6 py-4 bg-white shadow-sm border-b">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Daily Tracker</h1>
            <p className="text-gray-600 text-sm">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">{currentUser.email}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Calendar */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            {renderCalendar()}
            
            {/* Legend */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
              <h3 className="font-bold text-gray-800 mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${themePresets[userSettings.theme].complete} rounded`}></div>
                  <span>All areas complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${themePresets[userSettings.theme].partial} rounded`}></div>
                  <span>More than half complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-50 border border-gray-300 rounded"></div>
                  <span>Half or less</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Entry Fields */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-lg p-5 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-700">Daily Progress</span>
                <span className="text-sm font-bold text-blue-600">{completionCount}/{totalVisible} Complete</span>
              </div>
              <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Day Rating */}
            <div className="bg-white rounded-xl shadow-lg p-5 flex-shrink-0">
              <h3 className="font-semibold text-gray-700 mb-3">Day Rating</h3>
              <div className="flex gap-2 flex-wrap justify-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleInputChange('rating', num)}
                    className={`w-12 h-12 rounded-lg border-2 font-bold transition-all ${
                      currentEntry.rating === num
                        ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-110'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-blue-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {currentEntry.rating && (
                <p className="text-center mt-3 text-sm text-gray-600">
                  You rated today: <span className="font-bold text-blue-600">{currentEntry.rating}/10</span>
                </p>
              )}
            </div>

            {/* Celebration Message */}
            {showCelebration && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl shadow-lg p-4 flex items-center animate-bounce flex-shrink-0">
                <Sparkles className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="text-lg font-bold">Congratulations!</h3>
                  <p className="text-sm">You've completed all 6 areas today! 🎉</p>
                </div>
              </div>
            )}

            {/* Category Cards */}
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => {
                const isComplete = currentEntry[category.key]?.trim() !== '';
                return (
                  <div
                    key={category.key}
                    className={`rounded-xl shadow-lg p-4 border-2 transition-all ${
                      isComplete 
                        ? 'bg-green-100 border-green-400' 
                        : `${category.color}`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{category.label}</h3>
                      {isComplete && (
                        <div className="bg-green-500 rounded-full p-1">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <textarea
                      value={currentEntry[category.key] || ''}
                      onChange={(e) => handleInputChange(category.key, e.target.value)}
                      placeholder={`What did you do that was ${category.label.toLowerCase()}?`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none bg-white"
                      rows="2"
                    />
                  </div>
                );
              })}
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-lg p-5 flex-shrink-0">
              <h3 className="font-bold text-lg text-gray-800 mb-3">Other Notes on Today:</h3>
              <textarea
                value={currentEntry.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any other thoughts, reflections, or notes about your day..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                rows="4"
              />
            </div>

            {/* Auto-save indicator */}
            <div className="text-center text-sm text-gray-500 flex-shrink-0 pb-2">
              ✓ Changes saved automatically to cloud
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
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
                      onClick={() => {
                        const newSettings = { ...userSettings, theme: themeKey };
                        setUserSettings(newSettings);
                        if (currentUser) {
                          saveUserSettings(currentUser.uid, newSettings);
                        }
                      }}
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
                        onChange={(e) => {
                          const newSettings = {
                            ...userSettings,
                            visibleCategories: {
                              ...userSettings.visibleCategories,
                              [key]: e.target.checked
                            }
                          };
                          setUserSettings(newSettings);
                          if (currentUser) {
                            saveUserSettings(currentUser.uid, newSettings);
                          }
                        }}
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
                        onChange={(e) => {
                          const newSettings = {
                            ...userSettings,
                            customNames: {
                              ...userSettings.customNames,
                              [key]: e.target.value
                            }
                          };
                          setUserSettings(newSettings);
                        }}
                        onBlur={() => {
                          if (currentUser) {
                            saveUserSettings(currentUser.uid, userSettings);
                          }
                        }}
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
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTracker;