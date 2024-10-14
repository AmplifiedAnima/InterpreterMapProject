import React from 'react';

interface QuizScoreProps {
  score: number;
  currentIndex: number;
}

const QuizScore: React.FC<QuizScoreProps> = ({ score, currentIndex }) => {
  return (
    <p className="mt-4 text-lg font-semibold">
      Score: {score}/{currentIndex + 1}
    </p>
  );
};

export default QuizScore;