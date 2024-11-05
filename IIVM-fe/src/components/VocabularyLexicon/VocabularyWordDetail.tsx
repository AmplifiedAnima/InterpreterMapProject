import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";
import { RootState } from "../../redux/store";
import {
  ArrowLeftCircle,
  Book,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface VocabularyDetailProps {
  vocabularyItem?: VocabularyItemInterface | undefined;
  onAddToSaved: (vocabularyItemId: string) => void;
  deviceType: "mobile" | "smallTablet" | "largeTablet" | "desktop";
  goBackInRwdFunction: (() => void) | undefined;
}

const VocabularyWordDetail: React.FC<VocabularyDetailProps> = ({
  vocabularyItem,
  onAddToSaved,
  deviceType,
  goBackInRwdFunction,
}) => {
  const [isTranslationsExpanded, setIsTranslationsExpanded] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const savedVocabularyIds = useSelector(
    (state: RootState) => state.vocabulary.savedVocabularyIds
  );
  const currentLanguage = useSelector(
    (state: RootState) => state.language.language
  );
  const navigate = useNavigate();
  const isSmallDevice = deviceType === "mobile" || deviceType === "smallTablet";

  const getTranslations = () => {
    if (!vocabularyItem) return [];
    return vocabularyItem.translations.filter(
      (t) => t.language === currentLanguage.toLowerCase()
    );
  };

  const translations = getTranslations();
  const primaryTranslation = translations.find((t) => t.is_primary);
  const hasMultipleTranslations = translations.length > 1;

  const toggleTranslationsExpand = () => {
    setIsTranslationsExpanded(!isTranslationsExpanded);
  };

  const handleLearnClick = () => {
    if (vocabularyItem) {
      setIsLearning(true);
      onAddToSaved(vocabularyItem.id);
      setTimeout(() => setIsLearning(false), 500);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
      {vocabularyItem ? (
        <>
          <div className="mt-auto flex justify-center space-x-2">
            {isSmallDevice && goBackInRwdFunction && vocabularyItem && (
              <Button
                onClick={goBackInRwdFunction}
                className="w-10 h-10 rounded-full bg-[#a09edd] hover:bg-[#8c8ac7] flex items-center justify-center"
              >
                <ArrowLeftCircle size={20} />
              </Button>
            )}
            <AnimatePresence>
              {vocabularyItem &&
                !savedVocabularyIds.includes(vocabularyItem.id) && (
                  <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    animate={isLearning ? { opacity: 0, scale: 0.8 } : {}}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <motion.button
                      onClick={handleLearnClick}
                      className="px-4 py-2 rounded-md bg-[#5e67aa] text-white hover:bg-[#4c4e8f] overflow-hidden inline-flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isLearning ? { backgroundColor: "#4CAF50" } : {}}
                    >
                      <motion.span
                        className="inline-block align-middle"
                        initial={{ opacity: 1 }}
                        animate={isLearning ? { opacity: 0, y: -20 } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        Learn
                      </motion.span>
                      <motion.span
                        className="ml-1 inline-block relative w-4 h-4"
                        initial={{ opacity: 1 }}
                        animate={isLearning ? { opacity: 0, y: -20 } : {}}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Heart className="h-4 w-4 text-white absolute top-[0.5px] left-0.5" />
                      </motion.span>
                    </motion.button>
                  </motion.div>
                )}
            </AnimatePresence>
            <Button
              onClick={() => navigate("/add-word-page")}
              label="Add New Word"
            />
            {vocabularyItem && (
              <Button
                onClick={() =>
                  navigate("/add-new-suggestion-to-word", {
                    state: {
                      word: vocabularyItem.term,
                      id: vocabularyItem.id,
                      translations: vocabularyItem.translations.filter(
                        (t) => t.language === currentLanguage.toLowerCase()
                      ),
                    },
                  })
                }
                className="px-4 py-2 rounded-md bg-[#a09edd] text-white hover:bg-[#8c8ac7]"
              >
                Suggest
              </Button>
            )}
          </div>
          <h1 className="text-xl font-bold mb-4 text-[#5e67aa] my-4">
            {vocabularyItem.term}
          </h1>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Translations:</h2>
            {primaryTranslation && (
              <div className="bg-[#f0f4ff] px-3 py-2 rounded-md mb-2">
                <span className="text-lg font-medium text-[#5e67aa]">
                  {primaryTranslation.translation}
                </span>
                <span className="ml-2 text-xs bg-[#5e67aa] text-white px-2 py-0.5 rounded-full">
                  Primary
                </span>
              </div>
            )}
            {hasMultipleTranslations && (
              <>
                <Button
                  onClick={toggleTranslationsExpand}
                  className="text-sm py-1 px-2 rounded-md bg-[#5e67aa] text-white"
                >
                  {isTranslationsExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </Button>
                <AnimatePresence>
                  {isTranslationsExpanded && (
                    <motion.ul
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 space-y-2"
                    >
                      {translations
                        .filter((t) => !t.is_primary)
                        .map((translation, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-[#f0f4ff] px-3 py-2 rounded-md"
                          >
                            <div className="text-[#5e67aa]">
                              {translation.translation}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {translation.is_colloquial && (
                                <span className="text-xs bg-[#7986cb] text-white px-2 py-0.5 rounded-full">
                                  Colloquial
                                </span>
                              )}
                              {translation.is_user_proposed && (
                                <span className="text-xs bg-[#ffb74d] text-gray-900 px-2 py-0.5 rounded-full">
                                  User Proposed
                                </span>
                              )}
                            </div>
                          </motion.li>
                        ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
          <div className="mb-6">
            {vocabularyItem.definition && (
              <div className="mb-4">
                <h2 className="font-semibold mb-2">Definition:</h2>
                <p className="text-gray-700">{vocabularyItem.definition}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 mt-52">
          <Book className="w-16 h-16 text-[#5e67aa]" />
          <h2 className="text-2xl font-bold text-[#5e67aa]">Ready to learn?</h2>
          <p className="text-gray-700">Select a word to get started.</p>
        </div>
      )}
    </div>
  );
};

export default VocabularyWordDetail;
