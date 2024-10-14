import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { VocabularyItemInterface } from "../interfaces/vocabulary.interface";
import { removeSavedVocabularyForUser } from "../redux/vocabulary/vocabularyThunks";

export const useQuizLogic = (
  savedVocabularyIds: string[],
  vocabularyItems: { [id: string]: VocabularyItemInterface }
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentWord = useMemo(() => {
    return savedVocabularyIds.length > 0 && vocabularyItems
      ? vocabularyItems[savedVocabularyIds[currentIndex]]
      : null;
  }, [savedVocabularyIds, vocabularyItems, currentIndex]);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateChoices = () => {
    if (!currentWord) return;
    const correctAnswer = Object.values(currentWord.primary_translations)[0];
    const wrongChoices = Object.values(vocabularyItems)
      .filter((word) => word.id !== currentWord.id)
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
      setQuizCompleted(true);
    }
  };

  const handleShowTooltip = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    vocabularyItem: VocabularyItemInterface
  ) => {
    console.log("Show tooltip for:", vocabularyItem.term);
  };

  const handleRemoveWord = async (wordId: string) => {
    try {
      await dispatch(removeSavedVocabularyForUser([wordId]));
      if (wordId === currentWord?.id) {
        handleNext();
      }
    } catch (error) {
      console.error("Failed to remove vocabulary item:", error);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setShowFeedback(false);
    setSelectedChoice(null);
  };

  return {
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
  };
};
