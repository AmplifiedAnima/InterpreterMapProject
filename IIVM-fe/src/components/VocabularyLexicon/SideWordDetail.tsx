import React from "react";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";

interface SideWordDetailProps {
  vocabularyItem?: VocabularyItemInterface | undefined;
  onAddToSaved: (vocabularyItemId: string) => void;
}

const SideWordDetail: React.FC<SideWordDetailProps> = ({
  vocabularyItem,
  onAddToSaved,
}) => {
  const handleLearnClick = () => {
    if (vocabularyItem) {
      onAddToSaved(vocabularyItem.id);
      // Additional logic (like animations) can go here if needed
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
      {vocabularyItem ? (
        <>
          <h1 className="text-xl font-bold mb-4 text-[#5e67aa]">
            {vocabularyItem.term}
          </h1>
          <div className="mb-6">
            {vocabularyItem.definition && (
              <div className="mb-4">
                <h2 className="font-semibold mb-2">Definition:</h2>
                <p className="text-gray-700">{vocabularyItem.definition}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLearnClick}
            className="mt-auto px-4 py-2 rounded-md bg-[#5e67aa] text-white hover:bg-[#4c4e8f]"
          >
            Learn
          </button>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#5e67aa]">Select a word to view details.</h2>
        </div>
      )}
    </div>
  );
};

export default SideWordDetail;
