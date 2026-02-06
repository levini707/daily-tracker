import React, { useState, useEffect } from 'react';
import { Calendar, Check, Sparkles, User, LogOut, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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

  const categories = [
    { key: 'productive', label: 'Productive', color: 'bg-blue-100 border-blue-300' },
    { key: 'healthy', label: 'Healthy', color: 'bg-green-100 border-green-300' },
    { key: 'social', label: 'Social', color: 'bg-purple-100 border-purple-300' },
    { key: 'creative', label: 'Creative', color: 'bg-pink-100 border-pink-300' },
    { key: 'kind', label: 'Kind', color: 'bg-yellow-100 border-yellow-300' },
    { key: 'mindful', label: 'Mindful', color: 'bg-indigo-100 border-indigo-300' }
  ];

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
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
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

    const isComplete = categories.every(cat => newEntry[cat.key]?.trim() !== '');
    if (isComplete && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const getCompletionCount = (entry) => {
    if (!entry) return 0;
    return categories.filter(cat => entry[cat.key]?.trim() !== '').length;
  };

  const getCompletionStatus = (date) => {
    const dateKey = formatDateKey(date);
    const entry = entries[dateKey];
    if (!entry) return 'empty';
    const count = getCompletionCount(entry);
    if (count === 6) return 'complete';
    if (count > 3) return 'partial';
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
      
      let bgColor = 'bg-gray-50 hover:bg-gray-100';
      if (status === 'complete') bgColor = 'bg-green-600 hover:bg-green-700 text-white font-bold';
      else if (status === 'partial') bgColor = 'bg-green-200 hover:bg-green-300';
      
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
  const progressPercentage = (completionCount / 6) * 100;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-6 py-4 bg-white shadow-sm border-b">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Daily Tracker</h1>
            <p className="text-gray-600 text-sm">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">{currentUser.email}</span>
          </button>
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
                  <div className="w-6 h-6 bg-green-600 rounded"></div>
                  <span>All 6 areas complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-200 rounded"></div>
                  <span>More than half complete (4-5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-50 border border-gray-300 rounded"></div>
                  <span>Half or less (0-3)</span>
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
                <span className="text-sm font-bold text-blue-600">{completionCount}/6 Complete</span>
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
    </div>
  );
};

export default DailyTracker;