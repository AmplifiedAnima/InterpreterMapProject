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
  onLikeExisting: (id: number) => void;
  onApproveExisting: (id: number) => Promise<void>;
  onRejectExisting: (id: number) => Promise<void>;
  onLikeNew: (id: number) => void;
  onApproveNew: (id: number) => Promise<void>;
  onRejectNew: (id: number) => Promise<void>;
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
  const [showExistingSuggestions, setShowExistingSuggestions] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
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

  const toggleCardExpansion = useCallback((id: number) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  }, []);

  const suggestions = showExistingSuggestions
    ? existingWordSuggestions
    : newWordSuggestions;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-[#404670]">
          {showExistingSuggestions
            ? "Existing Word Suggestions"
            : "New Word Suggestions"}
        </h2>
        <Button onClick={toggleSuggestionType}>
          {showExistingSuggestions
            ? "Show New Suggestions"
            : "Show Existing Suggestions"}
        </Button>
      </div>
      <div className="space-y-6">
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
    </div>
  );
};
