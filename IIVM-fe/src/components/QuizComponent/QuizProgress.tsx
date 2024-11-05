import React from 'react';

interface QuizProgressProps {
  currentIndex: number;
  totalWords: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ currentIndex, totalWords }) => {
  return (
    <div className="mt-6">
      <p className="text-sm text-gray-500">
        {currentIndex + 1} of {totalWords} words
      </p>
      <progress
        value={currentIndex + 1}
        max={totalWords}
        className="w-full h-2 bg-gray-300 rounded-lg"
      />
    </div>
  );
};

export default QuizProgress;