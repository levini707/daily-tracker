import React from 'react';

const DayRating = ({ rating, onRatingChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
      <h3 className="text-sm font-medium text-gray-600 mb-3">Day Rating</h3>
      <div className="flex gap-2 flex-wrap justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => onRatingChange(num)}
            className={`w-10 h-10 rounded-lg border-2 font-semibold text-sm transition-all ${
              rating === num
                ? 'bg-blue-500 text-white border-blue-600 shadow-md scale-105'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-blue-300'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      {rating && (
        <p className="text-center mt-2 text-xs text-gray-600">
          You rated today: <span className="font-bold text-blue-600">{rating}/10</span>
        </p>
      )}
    </div>
  );
};

export default DayRating;