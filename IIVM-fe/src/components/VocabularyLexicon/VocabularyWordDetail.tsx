import React from "react";
import { useSelector } from "react-redux";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";
import { RootState } from "../../redux/store";
import arrowLeft from "../../assets/icons/arrow-left-circle.svg";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="bg-white shadow-lg rounded-lg w-full h-full flex flex-col">
      <div className="py-[2.5px] px-2 flex flex-col h-full">
        {/* Header */}
        <h1 className="font-bold mb-4 text-lg sm:text-xl md:text-2xl lg:text-xl px-2 py-2 bg-[#5e67aa] text-white rounded-md">
          {vocabularyItem ? vocabularyItem.term : "Select a word"}
        </h1>

        {/* Translations */}
        {vocabularyItem && (
          <div className="mb-4 text-sm sm:text-base">
            <h2 className="font-semibold text-gray-700 mb-2">Translations:</h2>
            <ul className="space-y-2">
              {getTranslations().map((translation, index) => (
                <li key={index} className="bg-gray-50 rounded-md p-3">
                  <div className="flex flex-col">
                    <span className={`text-lg ${translation.is_primary ? 'font-semibold text-indigo-700' : 'text-gray-700'}`}>
                      {translation.translation}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {translation.is_primary && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                      {translation.is_colloquial && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Colloquial
                        </span>
                      )}
                      {translation.is_user_proposed && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          User Proposed
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-grow overflow-y-auto mb-4 text-sm sm:text-base">
          {vocabularyItem ? (
            <>
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
            </>
          ) : (
            <p className="text-gray-500 italic text-center">
              Please select a vocabulary item from the list to see the details.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-center w-full space-x-2">
          {isSmallDevice && goBackInRwdFunction && vocabularyItem && (
            <Button
              onClick={goBackInRwdFunction}
              imageIcon={arrowLeft}
              className="w-8 h-8 rounded-lg flex-shrink-0 bg-[#a09edd] hover:bg-[#8c8ac7]"
            />
          )}
          {vocabularyItem &&
            !savedVocabularyIds.includes(vocabularyItem.id) && (
              <Button
                onClick={() => onAddToSaved(vocabularyItem.id)}
                className="flex-grow justify-center font-medium rounded-lg text-xs px-2 py-1 text-white hover:bg-[#8c8ac7] max-w-[100px]"
              >
                Learn
              </Button>
            )}
          {vocabularyItem && (
            <Button
              onClick={() =>
                navigate("/add-word-page", {
                  state: {
                    word: vocabularyItem.term,
                    id: vocabularyItem.id,
                    translations: vocabularyItem.translations.filter(
                      (t) => t.language === currentLanguage.toLowerCase()
                    ),
                  },
                })
              }
              className="flex-grow justify-center text-xs py-1 px-2 rounded-lg text-white hover:bg-[#8c8ac7] max-w-[100px]"
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