import React from 'react';
import { Button } from "../UI/Button";

interface QuizChoicesProps {
  choices: string[];
  selectedChoice: string | null;
  showFeedback: boolean;
  correctAnswer: string;
  onChoiceSelect: (choice: string) => void;
}

const QuizChoices: React.FC<QuizChoicesProps> = ({
  choices,
  selectedChoice,
  showFeedback,
  correctAnswer,
  onChoiceSelect,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {choices.map((choice, index) => (
        <Button
          key={index}
          onClick={() => onChoiceSelect(choice)}
          className={`p-2 rounded-lg ${
            selectedChoice === choice
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          } ${
            showFeedback
              ? choice === correctAnswer
                ? "bg-green-500 text-white"
                : selectedChoice === choice
                ? "bg-red-500 text-white"
                : ""
              : ""
          }`}
          disabled={showFeedback}
        >
          {String.fromCharCode(65 + index)}. {choice}
        </Button>
      ))}
    </div>
  );
};

export default QuizChoices;