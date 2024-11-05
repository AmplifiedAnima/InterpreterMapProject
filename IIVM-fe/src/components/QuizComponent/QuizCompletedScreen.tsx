import React from 'react';
import { Button } from "../UI/Button";

interface QuizCompletedScreenProps {
  score: number;
  totalWords: number;
  onResetQuiz: () => void;
  onReturnToVocabularyMap: () => void;
}

const QuizCompletedScreen: React.FC<QuizCompletedScreenProps> = ({
  score,
  totalWords,
  onResetQuiz,
  onReturnToVocabularyMap,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Quiz Completed!</h2>
      <p className="text-2xl mb-4">
        Your final score: {score}/{totalWords}
      </p>
      <p className="text-xl mb-6">
        Correct answers: {score}
        <br />
        Incorrect answers: {totalWords - score}
      </p>
      <div className="flex gap-4">
        <Button onClick={onResetQuiz}>Retake Quiz</Button>
        <Button onClick={onReturnToVocabularyMap}>
          Return to Vocabulary Map
        </Button>
      </div>
    </div>
  );
};

export default QuizCompletedScreen;