import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import VocabularyListSidebar from "../VocabularyLexicon/VocabularyListSidebar";
import { removeSavedVocabularyForUser } from "../../redux/vocabulary/vocabularyThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

interface QuizComponentProps {
  savedVocabularyIds: string[];
  vocabularyItems: { [id: string]: VocabularyItemInterface };
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  savedVocabularyIds,
  vocabularyItems,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const currentWord =
    savedVocabularyIds.length > 0 && vocabularyItems
      ? vocabularyItems[savedVocabularyIds[currentIndex]]
      : null;

  // Filter vocabulary items based on savedVocabularyIds
  const filteredVocabularyItems = useMemo(() => {
    return savedVocabularyIds.reduce((acc, id) => {
      if (vocabularyItems[id]) {
        acc[id] = vocabularyItems[id];
      }
      return acc;
    }, {} as { [id: string]: VocabularyItemInterface });
  }, [savedVocabularyIds, vocabularyItems]);

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
      alert(
        `Quiz completed! Your score: ${score}/${savedVocabularyIds.length}`
      );
    }
  };

  const handleShowTooltip = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    vocabularyItem: VocabularyItemInterface
  ) => {
    // Implement tooltip logic here
    console.log("Show tooltip for:", vocabularyItem.term);
  };

  const handleRemoveWord = async (wordId: string) => {
    try {
      // Dispatch the removeSavedVocabularyForUser thunk
      await dispatch(removeSavedVocabularyForUser([wordId]));

      // If the removed word is the current word, move to the next question
      if (wordId === currentWord?.id) {
        handleNext();
      }
    } catch (error) {
      console.error("Failed to remove vocabulary item:", error);
      // Optionally, show an error message to the user
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (savedVocabularyIds.length > 0 && vocabularyItems) {
    return (
      <div className="flex flex-col md:flex-row items-start justify-center p-4 md:p-8 bg-gray-100 min-h-screen">
        <div className={`md:hidden mb-4 ${showSidebar ? "w-full" : ""}`}>
          <Button
            onClick={toggleSidebar}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
          >
            {showSidebar ? "Hide Vocabulary List" : "Show Vocabulary List"}
          </Button>
        </div>

        <div
          className={`${
            showSidebar ? "block" : "hidden"
          } md:block md:w-1/3 mr-0 md:mr-8 mb-4 md:mb-0`}
        >
          <VocabularyListSidebar
            filteredVocabulary={Object.values(filteredVocabularyItems)}
            groupedVocabulary={{
              [currentWord?.category || ""]: Object.values(
                filteredVocabularyItems
              ),
            }}
            category={currentWord?.category || ""}
            handleShowTooltip={handleShowTooltip}
            handleRemoveWord={handleRemoveWord}
          />
        </div>

        <div
          className={`flex-grow ${showSidebar ? "hidden md:block" : "block"}`}
        >
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Learn</h2>
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
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
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

            <div className="mt-6">
              <p className="text-sm text-gray-500">
                {currentIndex + 1} of {savedVocabularyIds.length} words
              </p>
              <progress
                value={currentIndex + 1}
                max={savedVocabularyIds.length}
                className="w-full h-2 bg-gray-300 rounded-lg"
              />
            </div>

            <p className="mt-4 text-lg font-semibold">
              Score: {score}/{currentIndex + 1}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (savedVocabularyIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No Vocabulary Selected</h2>
        <p className="text-gray-700 mb-4">
          No vocabulary was chosen for the quiz. Please add some vocabulary to
          start the quiz.
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
