import React, { useState, KeyboardEvent, useRef } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/InputPlaceholder";
import zoomIn from "../../assets/icons/zoom-in.svg";
import zoomOut from "../../assets/icons/zoom-out.svg";
import anchor from "../../assets/icons/anchor.svg";
import searchIcon from "../../assets/icons/search.svg";
import saveIcon from "../../assets/icons/save.svg";
import dropDownIcon from "../../assets/icons/arrow-down-circle.svg";
import listIcon from "../../assets/icons/list.svg";
import graphIcon from "../../assets/icons/bar-chart.svg";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    imageIcon: string;
    text?: string;
    disabled?: boolean;
  }> = ({ onClick, imageIcon, text, disabled = false }) => (
    <Button
      onClick={onClick}
      className={`my-1 mx-1 bg-[#b9bbe8] text-blue-100 text-md flex items-center justify-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      imageIcon={imageIcon}
      disabled={disabled}
    >
      {text && <span className="whitespace-nowrap">{text}</span>}
    </Button>
  );

  const ToolbarContent = () => (
    <>
      <ToolbarButton onClick={onShowSavedVocabulary} imageIcon={saveIcon} />
      <ToolbarButton
        onClick={onToggleGraph}
        imageIcon={showGraph ? listIcon : graphIcon}
        disabled={!selectedCategory}
        text={showGraph ? "Show List" : `${isRwd ? "" : "Graph"}`}
      />
      {showGraph && selectedCategory && (
        <>
          <ToolbarButton onClick={onZoomIn} imageIcon={zoomIn} />
          <ToolbarButton onClick={onZoomOut} imageIcon={zoomOut} />
          <ToolbarButton onClick={onReset} imageIcon={anchor} />
          {!onToolTipLegendOpen && (
            <ToolbarButton onClick={setOnToolTipLegendOpen} text="Legend" imageIcon="" />
          )}
        </>
      )}
    </>
  );

  return (
    <div
      className={`flex flex-row px-[0.5px] py-4 ml-4 ${
        isRwd && "justify-center py-[2.5px] ml-0"
      }`}
    >
      <div className="flex flex-row relative">
        <Input
          className={`${isRwd ? "w-32" : "w-48"} my-1 mr-1`}
          value={localSearchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search vocabulary..."
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap w-full"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-shrink-0">
          <ToolbarButton onClick={handleSearch} imageIcon={searchIcon} />
        </div>
        {isRwd ? (
          <div className="w-full">
            <Button
              onClick={toggleDropdown}
              className="my-1 mx-1 bg-[#b9bbe8] text-blue-100 text-md flex items-center px-2"
              imageIcon={dropDownIcon}
            />
            {isDropdownOpen && (
              <div className="absolute z-30 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                <ToolbarContent />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center">
            <ToolbarContent />
          </div>
        )}
      </div>
    </div>
  );
};
