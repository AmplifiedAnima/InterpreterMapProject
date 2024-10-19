import React from 'react';
import { motion } from 'framer-motion';
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
  const getButtonColor = (choice: string) => {
    if (showFeedback) {
      if (choice === correctAnswer) {
        return 'bg-[#66bb6a] hover:bg-[#4caf50] text-white';
      } else if (selectedChoice === choice) {
        return 'bg-[#ef5350] hover:bg-[#e53935] text-white';
      }
    }
    return selectedChoice === choice
      ? 'bg-[#5e67aa] hover:bg-[#4a5396] text-white'
      : 'bg-[#f5f5f5] hover:bg-[#e0e0e0] text-[#333333]';
  };

  return (
    <div className="flex flex-col gap-4 mb-4 max-w-md mx-auto">
      {choices.map((choice, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Button
            onClick={() => onChoiceSelect(choice)}
            className={`
              rounded-lg w-full px-4 text-left transition-colors duration-200
              ${getButtonColor(choice)}
              ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
              shadow-md hover:shadow-lg
              flex items-center justify-between
            `}
            disabled={showFeedback}
          >
            <span className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#333333] mr-3 font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-center">{choice}</span>
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuizChoices;
