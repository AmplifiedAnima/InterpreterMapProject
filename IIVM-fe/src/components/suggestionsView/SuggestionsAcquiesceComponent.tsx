import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../UI/Button";
import {
  ExistingWordSuggestion,
  NewWordSuggestion,
} from "../../interfaces/suggestion";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { SuggestionCard } from "./SuggestionCard";

interface SuggestionsAcquiesceComponentProps {
  existingWordSuggestions: ExistingWordSuggestion[];
  newWordSuggestions: NewWordSuggestion[];
  vocabularyItems: VocabularyItemInterface[];
  canApprove: boolean;
  onLikeExisting: (id: string) => void;
  onApproveExisting: (id: string) => Promise<void>;
  onRejectExisting: (id: string) => Promise<void>;
  onLikeNew: (id: string) => void;
  onApproveNew: (id: string) => Promise<void>;
  onRejectNew: (id: string) => Promise<void>;
}

export const SuggestionsAcquiesceComponent: React.FC<
  SuggestionsAcquiesceComponentProps
> = ({
  existingWordSuggestions,
  newWordSuggestions,
  vocabularyItems,
  canApprove,
  onLikeExisting,
  onApproveExisting,
  onRejectExisting,
  onLikeNew,
  onApproveNew,
  onRejectNew,
}) => {
  const [showExistingSuggestions, setShowExistingSuggestions] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSuggestionType = useCallback(() => {
    setShowExistingSuggestions((prev) => !prev);
    setExpandedCardId(null);
  }, []);

  const toggleCardExpansion = useCallback((id: string) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  }, []);

  const sortSuggestions = <T extends { status: string }>(suggestions: T[]): T[] => {
    const statusOrder = { pending: 0, accepted: 1, rejected: 2 };
    return [...suggestions].sort(
      (a, b) =>
        statusOrder[a.status as keyof typeof statusOrder] -
        statusOrder[b.status as keyof typeof statusOrder]
    );
  };

  const sortedExistingSuggestions = sortSuggestions(existingWordSuggestions);
  const sortedNewSuggestions = sortSuggestions(newWordSuggestions);

  const suggestions = showExistingSuggestions
    ? sortedExistingSuggestions
    : sortedNewSuggestions;

  const noSuggestionsMessage = showExistingSuggestions
    ? "No existing word suggestions available."
    : "No new word suggestions available.";

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-100 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 space-y-6 sm:space-y-0">
        <h2 className="text-2xl font-bold text-[#404670]">
          {showExistingSuggestions
            ? "Existing Word Suggestions"
            : "New Word Suggestions"}
        </h2>
        <Button
          onClick={toggleSuggestionType}
          className="text-xl py-3 px-6 rounded-lg"
        >
          {showExistingSuggestions
            ? "Show New Suggestions"
            : "Show Existing Suggestions"}
        </Button>
      </div>
      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500 text-2xl my-12">{noSuggestionsMessage}</p>
      ) : (
        <div className="space-y-8">
          {suggestions.map((item) => (
            <SuggestionCard
              key={item.id}
              item={item}
              isExisting={showExistingSuggestions}
              vocabularyItem={
                showExistingSuggestions
                  ? vocabularyItems.find(
                      (v) =>
                        v.id === (item as ExistingWordSuggestion).vocabulary_item
                    )
                  : undefined
              }
              onLike={() =>
                showExistingSuggestions
                  ? onLikeExisting(item.id)
                  : onLikeNew(item.id)
              }
              onApprove={() =>
                showExistingSuggestions
                  ? onApproveExisting(item.id)
                  : onApproveNew(item.id)
              }
              onReject={() =>
                showExistingSuggestions
                  ? onRejectExisting(item.id)
                  : onRejectNew(item.id)
              }
              canApprove={canApprove}
              isExpanded={!isMobile || expandedCardId === item.id}
              toggleExpand={() => toggleCardExpansion(item.id)}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
};