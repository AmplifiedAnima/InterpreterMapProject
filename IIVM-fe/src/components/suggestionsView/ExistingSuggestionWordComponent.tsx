import React, { useMemo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  likeExistingWordSuggestion,
  approveVocabularySuggestion,
} from "../../redux/vocabulary/suggestionThunk";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { ExistingWordSuggestion } from "../../interfaces/suggestion";
import {
  ExistingSuggestionGroup,
  GroupedExistingSuggestions,
} from "./ExistingSuggestionGroup";
import { Toast } from "../UI/Toast";

interface ExistingWordSuggestionsComponentProps {
  existingWordSuggestions: ExistingWordSuggestion[];
  vocabularyItems: VocabularyItemInterface[];
  canApprove: boolean;
  onShowModal: (
    content: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export const ExistingWordSuggestionsComponent: React.FC<ExistingWordSuggestionsComponentProps> = ({
  existingWordSuggestions,
  vocabularyItems,
  canApprove,
  onShowModal,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleLikeExisting = useCallback((suggestionId: number) => {
    dispatch(likeExistingWordSuggestion(suggestionId));
  }, [dispatch]);

  const handleApproveExisting = useCallback(async (suggestionId: number) => {
    try {
      await dispatch(approveVocabularySuggestion(suggestionId)).unwrap();
      setToast({
        message: "Suggestion approved successfully!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        message: "Failed to approve suggestion. Please try again.",
        type: "error",
      });
    }
  }, [dispatch]);
  const groupedExistingSuggestions = useMemo(() => {
    return existingWordSuggestions.reduce((acc, suggestion) => {
      if (suggestion.vocabulary_item === undefined) {
        console.warn("Suggestion missing vocabulary_item:", suggestion);
        return acc;
      }
  
      const vocabularyItem = vocabularyItems.find(
        (item) => item.id === suggestion.vocabulary_item
      );
      if (vocabularyItem) {
        const term = vocabularyItem.term;
        if (!acc[term]) {
          acc[term] = { vocabularyItem, suggestions: [] };
        }
        acc[term].suggestions.push(suggestion);
      } else {
        console.warn("No matching vocabulary item found for suggestion:", suggestion);
      }
      return acc;
    }, {} as GroupedExistingSuggestions);
  }, [existingWordSuggestions, vocabularyItems]);
  const renderSuggestionGroups = useMemo(() => {
    return Object.entries(groupedExistingSuggestions).map(
      ([term, { suggestions }]) => (
        <ExistingSuggestionGroup
          key={term}
          term={term}
          suggestions={suggestions}
          onShowModal={onShowModal}
          onLike={handleLikeExisting}
          onApprove={canApprove ? handleApproveExisting : undefined}
        />
      )
    );
  }, [groupedExistingSuggestions, onShowModal, handleLikeExisting, handleApproveExisting, canApprove]);

  if (existingWordSuggestions.length === 0) {
    return <div>No existing word suggestions available.</div>;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <h2 className="text-base font-bold px-3 py-2 bg-gray-200">
        Existing Word Suggestions
      </h2>
      <div className="bg-gray-100 text-gray-700 font-semibold py-2 px-3 grid grid-cols-12 gap-2">
        <div className="col-span-2">Term</div>
        <div className="col-span-1">Likes</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-3">Suggestion</div>
        <div className="col-span-2">Status</div>
        {canApprove && <div className="col-span-2"></div>}
      </div>
      <div className="max-h-80 overflow-y-auto">
        <ul>{renderSuggestionGroups}</ul>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};