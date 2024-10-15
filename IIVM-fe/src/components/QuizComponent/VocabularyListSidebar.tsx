import React from "react";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";

interface VocabularyListProps {
  filteredVocabulary: VocabularyItemInterface[];
  groupedVocabulary: Record<string, VocabularyItemInterface[]>;
  category: string;
  handleShowTooltip: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    vocabularyItem: VocabularyItemInterface
  ) => void;
  handleRemoveWord: (wordId: string) => void;
}

const VocabularyItem: React.FC<{
  item: VocabularyItemInterface;
  onClick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onRemove: () => void;
}> = ({ item, onClick, onRemove }) => (
  <li className="flex items-center justify-between py-2 px-4 border-b border-gray-200 hover:bg-gray-50">
    <span
      className="text-sm text-gray-800 cursor-pointer"
      onClick={onClick}
    >
      {item.term}
    </span>
    <Button
      onClick={onRemove}

    >
      Remove
    </Button>
  </li>
);

const VocabularyListSidebar: React.FC<VocabularyListProps> = ({
  filteredVocabulary,
  groupedVocabulary,
  category,
  handleShowTooltip,
  handleRemoveWord,
}) => {
  const vocabularyToDisplay =
    filteredVocabulary.length > 0
      ? filteredVocabulary
      : groupedVocabulary[category];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden ">
      <div className="bg-[#b9bbe8] py-2 px-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Vocabulary List</h3>
      </div>
      <div className="bg-gray-100 py-2 px-4 flex justify-between items-center border-b border-gray-200">
        <span className="text-sm font-medium text-purple-600">Word</span>
        <span className="text-sm font-medium text-gray-600 mr-7">Actions</span>
      </div>
      <ul className="max-h-[70vh] overflow-y-auto">
        {vocabularyToDisplay.map((item) => (
          <VocabularyItem
            key={item.id}
            item={item}
            onClick={(e) => handleShowTooltip(e, item)}
            onRemove={() => handleRemoveWord(item.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default VocabularyListSidebar;