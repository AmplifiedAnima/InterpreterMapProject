import React from "react";

interface QuizQuestionProps {
  term: string;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ term }) => {
  return (
    <div className=" grid place-items-center">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      <p className="text-xl font-semibold text-gray-900 mb-4">{term}</p>
    </div>
  );
};

export default QuizQuestion;
