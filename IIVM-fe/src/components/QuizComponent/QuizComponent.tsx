import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../UI/Button";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import VocabularyListSidebar from "./VocabularyListSidebar";
import QuizQuestion from "./QuizQuestion";
import QuizChoices from "./QuizChoices";
import QuizProgress from "./QuizProgress";
import QuizScore from "./QuizScore";
import QuizCompletedScreen from "./QuizCompletedScreen";
import { useQuizLogic } from "../../utils/useQuizLogic";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    navigate,
  } = useQuizLogic(savedVocabularyIds, vocabularyItems);

  if (savedVocabularyIds.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-lg min-h-screen"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#5e67aa]">
          No Vocabulary Selected
        </h2>
        <p className="text-gray-700 mb-6 ">
          No vocabulary was chosen for the quiz. Please add some vocabulary to
          start the quiz.
        </p>
        <Button
          onClick={() => navigate("/vocabulary-map")}
          className="bg-[#5e67aa] hover:bg-[#4a5396] text-white px-4  rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Vocabulary
        </Button>
      </motion.div>
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
    <div className="flex flex-col md:flex-row items-start justify-start p-4 md:p-8 bg-gray-50 min-h-screen">
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full mb-4"
          >
            <Button
              onClick={toggleSidebar}
              className="w-full bg-[#5e67aa] hover:bg-[#4a5396] text-white transition duration-300 ease-in-out flex items-center"
            >
              {showSidebar ? (
                <>
                  <ChevronLeft size={20} className="mr-2" /> Hide Vocabulary
                  List
                </>
              ) : (
                <>
                  <ChevronRight size={20} className="mr-2" /> Show Vocabulary
                  List
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full   mr-4"
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full ${
          isMobile && showSidebar ? "hidden" : "flex flex-col flex-grow"
        }`}
      >
        <div className="bg-white w-full max-w-2xl mx-auto p-8 rounded-lg shadow-lg">
          <QuizQuestion term={currentWord?.term || ""} />

          <QuizChoices
            choices={choices}
            selectedChoice={selectedChoice}
            showFeedback={showFeedback}
            correctAnswer={
              Object.values(currentWord?.primary_translations || {})[0]
            }
            onChoiceSelect={handleChoiceSelect}
          />

          <AnimatePresence mode="wait">
            {!showFeedback ? (
              <motion.div
                key="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleSubmit}
                  className="w-1/4 mt-6 bg-[#5e67aa] hover:bg-[#4a5396] text-white  rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedChoice === null}
                >
                  Submit Answer
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="next"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleNext}
                  className="w-1/4 mt-6  bg-[#66bb6a] hover:bg-[#4caf50] text-white  rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Next Question
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            <QuizProgress
              currentIndex={currentIndex}
              totalWords={savedVocabularyIds.length}
            />
          </div>

          <div className="mt-4">
            <QuizScore score={score} currentIndex={currentIndex} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
