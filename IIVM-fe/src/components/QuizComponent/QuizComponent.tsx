import React, { useState, useEffect } from "react";

import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
interface QuizComponentProps {
  savedVocabularyIds: string[];
  vocabularyItems: { [id: string]: VocabularyItemInterface };
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  savedVocabularyIds,
  vocabularyItems,
}) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentWord =
    savedVocabularyIds.length > 0 && vocabularyItems
      ? vocabularyItems[savedVocabularyIds[currentIndex]]
      : null;

  useEffect(() => {
    if (currentWord) {
      generateChoices();
    }
  }, [currentIndex, vocabularyItems, savedVocabularyIds]);

  const generateChoices = () => {
    const correctAnswer = Object.values(currentWord!.primary_translations)[0];
    const wrongChoices = Object.values(vocabularyItems)
      .filter((word) => word.id !== currentWord!.id)
      .map((word) => Object.values(word.primary_translations)[0])
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allChoices = [correctAnswer, ...wrongChoices].sort(
      () => 0.5 - Math.random()
    );
    setChoices(allChoices);
  };

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
  };

  const handleSubmit = () => {
    if (selectedChoice === null || !currentWord) return;

    const correctAnswer = Object.values(currentWord.primary_translations)[0];
    if (selectedChoice === correctAnswer) {
      setScore(score + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentIndex < savedVocabularyIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz completed
      alert(
        `Quiz completed! Your score: ${score}/${savedVocabularyIds.length}`
      );
      // You can add logic here to navigate to a results page or restart the quiz
    }
  };

  if (savedVocabularyIds.length > 0 && vocabularyItems) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Learn</h2>

        <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-gray-900 mb-4">
            {currentWord?.term}
          </p>

          <div className="flex flex-col gap-4 mb-4">
            {choices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => handleChoiceSelect(choice)}
                className={`p-2 rounded-lg ${
                  selectedChoice === choice
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } ${
                  showFeedback && currentWord
                    ? choice ===
                      Object.values(currentWord.primary_translations)[0]
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

          {!showFeedback ? (
            <Button
              onClick={handleSubmit}
              className="w-full text-white px-4 py-2 rounded-lg shadow-md"
              disabled={selectedChoice === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Next Question
            </Button>
          )}
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            {currentIndex + 1} of {savedVocabularyIds.length} words
          </p>
          <progress
            value={currentIndex + 1}
            max={savedVocabularyIds.length}
            className="w-full max-w-lg h-2 bg-gray-300 rounded-lg"
          />
        </div>

        <p className="mt-4 text-lg font-semibold">
          Score: {score}/{currentIndex + 1}
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No Vocabulary Selected</h2>
        <p className="text-gray-700 mb-4">
          No vocabulary was chosen for the quiz.
        </p>
        <Button
          onClick={() => navigate("/vocabulary-map")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Go to Vocabulary
        </Button>
      </div>
    );
  }
};
