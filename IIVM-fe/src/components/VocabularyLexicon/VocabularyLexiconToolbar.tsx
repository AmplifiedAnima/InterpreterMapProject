import React, { useState, KeyboardEvent } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/InputPlaceholder";
import zoomIn from "../../assets/icons/zoom-in.svg";
import zoomOut from "../../assets/icons/zoom-out.svg";
import anchor from "../../assets/icons/anchor.svg";
import searchIcon from "../../assets/icons/search.svg";
import saveIcon from "../../assets/icons/save.svg";
// import listIcon from "../../assets/icons/list.svg";
// import graphIcon from "../../assets/icons/bar-chart.svg";
import plusCircleIcon from "../../assets/icons/plus-circle.svg";
import { useNavigate } from "react-router-dom";

interface VocabularyMapToolbarProps {
  isOpened: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  setListMode: () => void;
  onToolTipLegendOpen: boolean;
  setOnToolTipLegendOpen: () => void;
  onShowSavedVocabulary: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  scale?: number;
  vocabularyList: string[];
  isListModeOpen: boolean;
  showGraph: boolean;
  onToggleGraph: () => void;
  selectedCategory: string | null;
}

export const VocabularyLexiconToolbar: React.FC<VocabularyMapToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onSearch,
  onShowSavedVocabulary,
  onToolTipLegendOpen,
  setOnToolTipLegendOpen,
  searchQuery,
  vocabularyList,
  showGraph,
  onToggleGraph,
  selectedCategory,
}) => {
  const [isRwd] = useState(window.innerWidth <= 768);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleSearch = () => {
    onSearch(localSearchQuery);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    if (value.length > 0) {
      const filteredSuggestions = vocabularyList
        .filter((word) => word.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };
  const ToolbarButton: React.FC<{
    onClick: () => void;
    imageIcon?: string;
    text?: string;
    disabled?: boolean;
  }> = ({ onClick, imageIcon, text, disabled = false }) => (
    <Button
      onClick={onClick}
      className={`h-10  bg-[#7270bd] hover:bg-[#8b8ad6] text-white rounded-md transition-colors duration-200 flex items-center justify-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      {imageIcon && <img src={imageIcon} alt="" className="w-5 h-5 " />}
      {text && <span className="whitespace-nowrap text-sm">{text}</span>}
    </Button>
  );

  const ToolbarContent = () => (
    <>
      <ToolbarButton onClick={onShowSavedVocabulary} imageIcon={saveIcon} />
      {!isRwd && (
        <ToolbarButton
          onClick={onToggleGraph}
          disabled={!selectedCategory}
          text={showGraph ? "List" : "Graph"}
        />
      )}
      {showGraph && selectedCategory && (
        <>
          <ToolbarButton onClick={onZoomIn} imageIcon={zoomIn} />
          <ToolbarButton onClick={onZoomOut} imageIcon={zoomOut} />
          <ToolbarButton onClick={onReset} imageIcon={anchor} />
          {!onToolTipLegendOpen && (
            <ToolbarButton onClick={setOnToolTipLegendOpen} text="Legend" />
          )}
        </>
      )}
      <ToolbarButton
        onClick={() => navigate("/add-word-page")}
        imageIcon={plusCircleIcon}
      />
    </>
  );

  return (
    <div className="flex items-center justify-center space-x-2 p-2 bg-white rounded-lg shadow-sm">
      <div className="relative flex items-center">
        <Input
          className="h-10  pr-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a09edd]"
          value={localSearchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search..."
        />
        <button
          onClick={handleSearch}
          className="h-10 px-4 ml-2  rounded-md bg-[#7270bd]"
        >
          <img src={searchIcon} />
        </button>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <ToolbarContent />
      </div>
    </div>
  );
};
