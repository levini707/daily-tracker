import React from 'react';
import { Check } from 'lucide-react';

const CategoryCard = ({ category, value, onChange }) => {
  const isComplete = value?.trim() !== '';

  return (
    <div
      className={`rounded-xl shadow-lg p-3 border-2 transition-all ${
        isComplete 
          ? 'bg-green-100 border-green-400' 
          : `${category.color}`
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-medium text-gray-700">{category.label}</h3>
        {isComplete && (
          <div className="bg-green-500 rounded-full p-0.5">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`What did you do that was ${category.label.toLowerCase()}?`}
        className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none bg-white"
        rows="2"
      />
    </div>
  );
};

export default CategoryCard;