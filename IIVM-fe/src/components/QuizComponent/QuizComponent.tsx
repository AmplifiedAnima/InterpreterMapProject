import React from "react";
import { Button } from "../UI/Button";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import VocabularyListSidebar from "./VocabularyListSidebar";
import QuizQuestion from "./QuizQuestion";
import QuizChoices from "./QuizChoices";
import QuizProgress from "./QuizProgress";
import QuizScore from "./QuizScore";
import QuizCompletedScreen from "./QuizCompletedScreen";
import { useQuizLogic } from "../../utils/useQuizLogic";

interface QuizComponentProps {
  savedVocabularyIds: string[];
  vocabularyItems: { [id: string]: VocabularyItemInterface };
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  savedVocabularyIds,
  vocabularyItems,
}) => {
  const {
    currentIndex,
    choices,
    selectedChoice,
    showFeedback,
    score,
    showSidebar,
    isMobile,
    quizCompleted,
    currentWord,
    filteredVocabularyItems,
    handleChoiceSelect,
    handleSubmit,
    handleNext,
    handleShowTooltip,
    handleRemoveWord,
    toggleSidebar,
    resetQuiz,
    navigate
  } = useQuizLogic(savedVocabularyIds, vocabularyItems);

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

  if (quizCompleted) {
    return (
      <QuizCompletedScreen
        score={score}
        totalWords={savedVocabularyIds.length}
        onResetQuiz={resetQuiz}
        onReturnToVocabularyMap={() => navigate("/vocabulary-map")}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-start p-4 md:p-8 bg-gray-100 min-h-screen">
      {isMobile && (
        <div className="w-full mb-4">
          <Button
            onClick={toggleSidebar}
            className="w-full"
          >
            {showSidebar ? "Hide Vocabulary List" : "Show Vocabulary List"}
          </Button>
        </div>
      )}

      <div className={`${showSidebar ? "block" : "hidden"}  w-full`}>
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
        className={`w-full ${isMobile && showSidebar ? "hidden" : "flex flex-col flex-grow"} `}
      >
        <div className={`bg-white w-full max-w-lg mx-8 p-8 rounded-lg shadow-lg`}>
          <QuizQuestion term={currentWord?.term || ""} />

          <QuizChoices
            choices={choices}
            selectedChoice={selectedChoice}
            showFeedback={showFeedback}
            correctAnswer={Object.values(currentWord?.primary_translations || {})[0]}
            onChoiceSelect={handleChoiceSelect}
          />

          {!showFeedback ? (
            <Button
              onClick={handleSubmit}
              className="w-full mt-4"
              disabled={selectedChoice === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Next Question
            </Button>
          )}

          <QuizProgress
            currentIndex={currentIndex}
            totalWords={savedVocabularyIds.length}
          />

          <QuizScore score={score} currentIndex={currentIndex} />
        </div>
      </div>
    </div>
  );
};