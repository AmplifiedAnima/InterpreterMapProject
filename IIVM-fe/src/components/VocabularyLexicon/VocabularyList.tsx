import React from "react";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Heart } from "lucide-react";

interface VocabularyListProps {
  groupedVocabulary?: { [category: string]: VocabularyItemInterface[] };
  searchTerm?: string;
  selectedCategory?: string;
  onWordSelect: (word: VocabularyItemInterface) => void;
  selectedWord?: VocabularyItemInterface | null;
}

const VocabularyList: React.FC<VocabularyListProps> = ({
  groupedVocabulary = {},
  searchTerm = "",
  selectedCategory,
  onWordSelect,
  selectedWord,
}) => {
  const savedVocabularyIds = useSelector(
    (state: RootState) => state.vocabulary.savedVocabularyIds
  );

  const filterVocabulary = (items: VocabularyItemInterface[]) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderVocabularyItems = (
    category: string,
    items: VocabularyItemInterface[]
  ) => {
    const filteredItems = filterVocabulary(items);
    if (filteredItems.length === 0) return null;

    return (
      <React.Fragment key={category}>
        <li className="bg-[#5e67aa] text-left px-3 font-semibold py-1.5 text-white text-sm md:text-base">
          {category.toUpperCase()}
        </li>
        {filteredItems.map((item) => (
          <VocabularyItem
            key={item.id}
            item={item}
            onClick={() => onWordSelect(item)}
            isSelected={selectedWord?.id === item.id}
            isOnSavedVocabularyList={savedVocabularyIds.includes(item.id)}
          />
        ))}
      </React.Fragment>
    );
  };

  return (
    <div className="overflow-hidden px-4">
      {/* Header Section */}
      <div className="bg-gray-100 text-gray-700 font-semibold text-sm md:text-base py-2 px-3 rounded-md">
        <div className="flex">
          <div className="w-5/12 text-left">Word</div>
          <div className="w-6/12 text-left">Translation</div>
          <div className="w-1/12 text-center">Saved</div>
        </div>
      </div>

      <ul className="">
        {selectedCategory && groupedVocabulary[selectedCategory]
          ? renderVocabularyItems(
              selectedCategory,
              groupedVocabulary[selectedCategory]
            )
          : Object.entries(groupedVocabulary).map(([category, items]) =>
              renderVocabularyItems(category, items)
            )}
      </ul>
    </div>
  );
};

const VocabularyItem: React.FC<{
  item: VocabularyItemInterface;
  onClick: () => void;
  isSelected: boolean;
  isOnSavedVocabularyList?: boolean;
}> = ({ item, onClick, isSelected, isOnSavedVocabularyList }) => {
  const primaryTranslation = item.primary_translations
    ? Object.values(item.primary_translations)[0]
    : "";

  return (
    <li
      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer ${
        isSelected ? "bg-blue-100" : ""
      } ${isOnSavedVocabularyList ? "bg-green-100" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center px-3 py-1.5">
        <div className="w-5/12 text-xs sm:text-sm text-gray-800 text-left truncate">
          {item.term}
        </div>
        <div className="w-6/12 text-xs sm:text-sm text-purple-600 text-left truncate">
          {primaryTranslation}
        </div>
        <div className="w-1/12 flex justify-center">
          {isOnSavedVocabularyList && (
            <Heart size={14} className="text-green-500" />
          )}
        </div>
      </div>
    </li>
  );
};

export default VocabularyList;