import React from 'react';

const MoodRating = ({ mood, onMoodChange, theme }) => {
  const moods = [
    { 
      value: 1, 
      label: 'Awful',
      bgColor: 'bg-gradient-to-br from-red-100 to-red-200',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#fca5a5"/>
          {/* Sad eyes - no tears */}
          <circle cx="35" cy="38" r="3" fill="#7f1d1d"/>
          <circle cx="65" cy="38" r="3" fill="#7f1d1d"/>
          {/* Big frown */}
          <path d="M 25 68 Q 50 50 75 68" stroke="#7f1d1d" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Sad eyebrows */}
          <path d="M 22 28 Q 30 24 38 28" stroke="#7f1d1d" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M 62 28 Q 70 24 78 28" stroke="#7f1d1d" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        </svg>
      )
    },
    { 
      value: 2, 
      label: 'Bad',
      bgColor: 'bg-gradient-to-br from-orange-100 to-orange-200',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#fdba74"/>
          {/* Worried eyes */}
          <circle cx="35" cy="40" r="4.5" fill="#7c2d12"/>
          <circle cx="65" cy="40" r="4.5" fill="#7c2d12"/>
          {/* Downward frown */}
          <path d="M 28 70 Q 50 58 72 70" stroke="#7c2d12" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Concerned eyebrows */}
          <path d="M 23 30 L 42 26" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M 77 30 L 58 26" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round"/>
        </svg>
      )
    },
    { 
      value: 3, 
      label: 'Okay',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#fde047"/>
          {/* Round sparkly eyes */}
          <circle cx="35" cy="43" r="6" fill="#713f12"/>
          <circle cx="65" cy="43" r="6" fill="#713f12"/>
          <circle cx="37" cy="40" r="2.5" fill="white"/>
          <circle cx="67" cy="40" r="2.5" fill="white"/>
          {/* Wavy gentle smile */}
          <path d="M 30 62 C 42 68, 58 68, 70 62" stroke="#713f12" strokeWidth="4" fill="none" strokeLinecap="round"/>
          {/* Pink rosy cheeks */}
          <circle cx="16" cy="55" r="7" fill="#f472b6" opacity="0.7"/>
          <circle cx="84" cy="55" r="7" fill="#f472b6" opacity="0.7"/>
        </svg>
      )
    },
    { 
      value: 4, 
      label: 'Good',
      bgColor: 'bg-gradient-to-br from-lime-200 to-green-200',
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#bef264"/>
          {/* Happy crescent eyes */}
          <path d="M 26 38 Q 35 46 44 38" stroke="#365314" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 56 38 Q 65 46 74 38" stroke="#365314" strokeWidth="4" fill="none" strokeLinecap="round"/>
          {/* Happy smile */}
          <path d="M 26 56 Q 50 74 74 56" stroke="#365314" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Pink rosy cheeks */}
          <circle cx="16" cy="52" r="8" fill="#f472b6" opacity="0.7"/>
          <circle cx="84" cy="52" r="8" fill="#f472b6" opacity="0.7"/>
        </svg>
      )
    },
    { 
      value: 5, 
      label: 'Great',
      bgColor: 'bg-gradient-to-br from-emerald-200 to-green-300',
      hasSparkles: true,
      icon: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#6ee7b7"/>
          {/* Excited eyebrows */}
          <path d="M 20 32 Q 28 24 36 32" stroke="#064e3b" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d="M 64 32 Q 72 24 80 32" stroke="#064e3b" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          {/* Happy crescent eyes - normal, not stars */}
          <path d="M 26 40 Q 35 48 44 40" stroke="#064e3b" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 56 40 Q 65 48 74 40" stroke="#064e3b" strokeWidth="4" fill="none" strokeLinecap="round"/>
          {/* Big excited smile */}
          <path d="M 20 50 Q 50 88 80 50" stroke="#064e3b" strokeWidth="6" fill="none" strokeLinecap="round"/>
          {/* Pink cheeks */}
          <circle cx="15" cy="56" r="9" fill="#f472b6" opacity="0.8"/>
          <circle cx="85" cy="56" r="9" fill="#f472b6" opacity="0.8"/>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 flex-shrink-0">
      <h3 className="text-sm font-medium text-gray-700 mb-2">How do you feel today?</h3>
      <div className="flex gap-0.5 sm:gap-2 justify-center">
        {moods.map((moodOption) => (
          <div key={moodOption.value} className="relative flex-shrink-0">
            {/* Sparkles around the box for Great mood when selected */}
            {mood === moodOption.value && moodOption.hasSparkles && (
              <>
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-1/2 -left-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
              </>
            )}
            <button
              onClick={() => onMoodChange(moodOption.value)}
              className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl border-2 transition-all ${
                mood === moodOption.value
                  ? `${moodOption.bgColor} border-gray-400 shadow-lg scale-115`
                  : `${moodOption.bgColor} border-gray-300 hover:border-gray-400 hover:scale-105 opacity-60 hover:opacity-90`
              }`}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12">
                {moodOption.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-gray-800 whitespace-nowrap hidden sm:block">
                {moodOption.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodRating;