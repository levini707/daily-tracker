import React, { useState } from 'react';
import { journalTemplates } from '../constants/journalTemplates';
import { dailyPrompts } from '../constants/dailyPrompts';
import { getDailyPrompt } from '../utils/dateUtils';

const JournalSection = ({ notes, onNotesChange, selectedDate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('freeform');

  const applyTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
    const template = journalTemplates[templateKey];
    onNotesChange(template.content);
  };

  const currentPrompt = getDailyPrompt(selectedDate, dailyPrompts);

  return (
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
          <p className="text-sm text-blue-900 italic">{currentPrompt}</p>
        </div>
      )}

      <textarea
        value={notes || ''}
        onChange={(e) => onNotesChange(e.target.value)}
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
  );
};

export default JournalSection;