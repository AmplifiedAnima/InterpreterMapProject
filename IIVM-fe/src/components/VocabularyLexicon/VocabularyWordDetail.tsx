import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";
import { RootState } from "../../redux/store";
import { ArrowLeftCircle, Book, ChevronDown, ChevronUp } from "lucide-react";
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

  return (
    <div
      className={`bg-white shadow-lg rounded-lg w-full h-full flex flex-col ${
        isSmallDevice ? "p-2" : "p-4"
      }`}
    >
      <div className="flex flex-col h-full">
        {vocabularyItem ? (
          <h1
            className={`mb-4 ${
              isSmallDevice ? "text-md" : "md:text-lg"
            } px-2 py-2 bg-[#5e67aa] text-white rounded-md`}
          >
            {vocabularyItem.term}
          </h1>
        ) : (
          ""
        )}

        {vocabularyItem && (
          <>
            <div className={`mb-4 ${isSmallDevice ? "text-sm" : "text-base"}`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-gray-700">Translations:</h2>
                {hasMultipleTranslations && (
                  <Button
                    onClick={toggleTranslationsExpand}
                    className="text-sm py-1 px-2 rounded-lg text-white bg-[#5e67aa] hover:bg-[#4a5396] transition duration-300"
                  >
                    {isTranslationsExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </Button>
                )}
              </div>
              {primaryTranslation && (
                <div className="bg-[#f0f4ff] rounded-md p-3 mb-2 border border-[#d0d4ff]">
                  <span
                    className={`font-semibold text-[#5e67aa] ${
                      isSmallDevice ? "text-base" : "text-lg"
                    }`}
                  >
                    {primaryTranslation.translation}
                  </span>
                  <span className="ml-2 text-xs bg-[#5e67aa] text-white px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                </div>
              )}
              <AnimatePresence>
                {isTranslationsExpanded && hasMultipleTranslations && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 border border-[#d0d4ff] rounded-md overflow-hidden"
                  >
                    <motion.ul
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="divide-y divide-[#d0d4ff]"
                    >
                      {translations
                        .filter((t) => !t.is_primary)
                        .map((translation, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-3 hover:bg-[#f0f4ff] transition duration-300"
                          >
                            <div className="flex flex-col">
                              <span
                                className={`${
                                  isSmallDevice ? "text-base" : "text-lg"
                                } text-[#5e67aa]`}
                              >
                                {translation.translation}
                              </span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {translation.is_colloquial && (
                                  <span className="text-sm bg-[#7986cb] text-white px-2 py-0.5 rounded-full">
                                    Colloquial
                                  </span>
                                )}
                                {translation.is_user_proposed && (
                                  <span className="text-sm bg-[#ffb74d] text-gray-900 px-2 py-0.5 rounded-full">
                                    User Proposed
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.li>
                        ))}
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className={`flex-grow overflow-y-auto mb-4 ${
                isSmallDevice ? "text-sm" : "text-base"
              }`}
            >
              {vocabularyItem.definition && (
                <div className="mb-4">
                  <h2 className="font-semibold text-gray-700 mb-1">
                    Definition:
                  </h2>
                  <p className="bg-gray-50 p-2 rounded-md">
                    {vocabularyItem.definition}
                  </p>
                </div>
              )}
              {vocabularyItem.category && (
                <div>
                  <h2 className="font-semibold text-gray-700 mb-1">
                    Category:
                  </h2>
                  <p className="bg-gray-50 p-2 rounded-md">
                    {vocabularyItem.category}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        {!vocabularyItem && (
          <div className="flex flex-col items-center justify-center h-full text-center ">
            <Book className="w-24 h-24 text-[rgb(94,103,170)] mb-2 animate-pulse animate" />
            <h1 className="text-2xl font-bold text-gray-700 mb-4">
              Ready to learn?
            </h1>
            <p className="text-[#5e67aa] mb-4 text-3xl">
              Select a word to get started.
            </p>
          </div>
        )}

        <div
          className={`flex justify-center items-center w-full ${
            isSmallDevice ? "space-x-2" : "space-x-4"
          }`}
        >
          {isSmallDevice && goBackInRwdFunction && vocabularyItem && (
            <Button
              onClick={goBackInRwdFunction}
              className="w-10 h-10 rounded-lg flex-shrink-0 bg-[#a09edd] hover:bg-[#8c8ac7]"
            >
              <ArrowLeftCircle size={20} />
            </Button>
          )}
          {vocabularyItem &&
            !savedVocabularyIds.includes(vocabularyItem.id) && (
              <Button
                onClick={() => onAddToSaved(vocabularyItem.id)}
                className={`flex-grow justify-center font-medium rounded-lg ${
                  isSmallDevice ? "text-xs px-2 py-1" : "text-sm px-4 py-2"
                } text-white hover:bg-[#8c8ac7] ${
                  isSmallDevice ? "max-w-[100px]" : ""
                }`}
              >
                Learn
              </Button>
            )}
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
              className={`flex-grow justify-center ${
                isSmallDevice ? "text-xs py-1 px-2" : "text-sm py-2 px-4"
              } rounded-lg text-white hover:bg-[#8c8ac7] ${
                isSmallDevice ? "max-w-[100px]" : ""
              }`}
            >
              Suggest
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyWordDetail;
