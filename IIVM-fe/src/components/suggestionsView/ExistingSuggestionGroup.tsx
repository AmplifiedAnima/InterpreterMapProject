import React, { useState, useCallback } from "react";
import { ExistingWordSuggestion } from "../../interfaces/suggestion";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";
import { Check, ThumbsUp } from "lucide-react";

export interface GroupedExistingSuggestions {
  [key: string]: {
    vocabularyItem: VocabularyItemInterface;
    suggestions: ExistingWordSuggestion[];
  };
}

interface ExistingSuggestionGroupProps {
  term: string;
  suggestions: ExistingWordSuggestion[];
  onShowModal: (
    content: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  onLike: (id: number) => void;
  onApprove?: (id: number) => Promise<void>;
}

export const ExistingSuggestionGroup: React.FC<ExistingSuggestionGroupProps> = ({
  term,
  suggestions,
  onShowModal,
  onLike,
  onApprove
}) => {
  const [approvingIds, setApprovingIds] = useState<Set<number>>(new Set());

  const handleApprove = useCallback(async (id: number) => {
    if (onApprove) {
      setApprovingIds(prev => new Set(prev).add(id));
      try {
        await onApprove(id);
        // Keep the button disabled after successful approval
      } catch (error) {
        // If there's an error, we allow the user to try again
        setApprovingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }
  }, [onApprove]);

  return (
    <li className="border-b last:border-b-0">
      {suggestions.map((item, index) => (
        <div
          key={item.id}
          className={`py-2 px-3 grid grid-cols-12 gap-2 items-center ${
            item.status === "accepted" || approvingIds.has(item.id) ? "opacity-50" : ""
          }`}
        >
          {index === 0 && (
            <div className="col-span-2">
              <button
                className="text-purple-600 font-semibold cursor-pointer"
                onClick={(e) => onShowModal(item.suggestion, e)}
              >
                {term}
              </button>
            </div>
          )}
          {index !== 0 && <div className="col-span-2"></div>}
          <div className="col-span-1">
            <Button
              onClick={() => onLike(item.id)}
              className="flex items-center"
              disabled={item.status === "accepted" || approvingIds.has(item.id)}
            >
              <ThumbsUp size={12} className="mr-1" />
              <span>{item.like_count}</span>
            </Button>
          </div>
          <div className="col-span-2 font-medium">{item.suggestion_type}</div>
          <div className="col-span-3 text-gray-600">{item.suggestion}</div>
          <div className="col-span-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                item.status === "accepted"
                  ? "bg-green-200 text-green-800"
                  : item.status === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {item.status}
            </span>
          </div>
          {onApprove && item.status !== "accepted" && (
            <div className="col-span-2">
              <Button
                onClick={() => handleApprove(item.id)}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={approvingIds.has(item.id)}
              >
                <Check size={12} className="mr-1" />
                {approvingIds.has(item.id) ? "Approving..." : "Approve"}
              </Button>
            </div>
          )}
        </div>
      ))}
    </li>
  );
};