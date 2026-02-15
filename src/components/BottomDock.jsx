import React from 'react';
import { BookOpen, BarChart3, Settings } from 'lucide-react';

const BottomDock = ({ activeTab, onTabChange, theme }) => {
  const tabs = [
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'feed', label: 'Feed', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-[1800px] mx-auto flex justify-around items-center py-2 px-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all ${
                isActive 
                  ? `${theme.complete} text-white shadow-md` 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomDock;