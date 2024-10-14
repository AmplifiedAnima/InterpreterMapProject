import React, { useState, useCallback } from "react";
import { ExistingWordSuggestion } from "../../interfaces/suggestion";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";
import { Check, ThumbsUp, X } from "lucide-react";

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
  onReject?: (id: number) => Promise<void>;
  isMobile: boolean;
}

export const ExistingSuggestionGroup: React.FC<ExistingSuggestionGroupProps> = ({
  term,
  suggestions,
  onShowModal,
  onLike,
  onApprove,
  onReject,
  isMobile,
}) => {
  const [approvingIds, setApprovingIds] = useState<Set<number>>(new Set());
  const [rejectingIds, setRejectingIds] = useState<Set<number>>(new Set());

  const handleApprove = useCallback(
    async (id: number) => {
      if (onApprove) {
        setApprovingIds((prev) => new Set(prev).add(id));
        try {
          await onApprove(id);
        } catch (error) {
          console.error(error);
          setApprovingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      }
    },
    [onApprove]
  );

  const handleReject = useCallback(
    async (id: number) => {
      if (onReject) {
        setRejectingIds((prev) => new Set(prev).add(id));
        try {
          await onReject(id);
        } catch (error) {
          console.error(error);
          setRejectingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      }
    },
    [onReject]
  );

  const renderSuggestion = (item: ExistingWordSuggestion, index: number) => {
    const isDisabled =
      item.status === "accepted" ||
      item.status === "rejected" ||
      approvingIds.has(item.id) ||
      rejectingIds.has(item.id);

    const approveButton =
      onApprove && item.status === "pending" ? (
        <Button
          onClick={() => handleApprove(item.id)}
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded whitespace-nowrap"
          disabled={approvingIds.has(item.id)}
        >
          <Check size={12} className="mr-1 inline" />
          {approvingIds.has(item.id) ? "Approving..." : "Approve"}
        </Button>
      ) : null;

    const rejectButton =
      onReject && item.status === "pending" ? (
        <Button
          onClick={() => handleReject(item.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded whitespace-nowrap ml-2"
          disabled={rejectingIds.has(item.id)}
        >
          <X size={12} className="mr-1 inline" />
          {rejectingIds.has(item.id) ? "Rejecting..." : "Reject"}
        </Button>
      ) : null;

    if (isMobile) {
      return (
        <div
          key={item.id}
          className={`mb-4 p-3 bg-white rounded shadow ${
            isDisabled ? "opacity-50" : ""
          }`}
        >
          {index === 0 && (
            <button
              className="text-purple-600 font-semibold cursor-pointer mb-2"
              onClick={(e) => onShowModal(item.suggestion, e)}
            >
              {term}
            </button>
          )}
          <div className="grid grid-cols-3 gap-2 items-center mb-2">
            <div>
              <strong>Type:</strong> {item.suggestion_type}
            </div>
            <div>
              <strong>Status:</strong>
              <span
                className={`ml-1 px-2 py-1 rounded-full text-xs ${
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
            <Button
              onClick={() => onLike(item.id)}
              className="flex items-center justify-center bg-purple-100 text-purple-600 px-2 py-1 rounded h-8 w-1/2"
              disabled={isDisabled}
            >
              <ThumbsUp size={12} className="mr-2" />
              <span>{item.like_count}</span>
            </Button>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex-grow mr-2 w-1/4 overflow-x-auto">
              <strong>Suggestion:</strong> {item.suggestion}
            </div>
            <div className="flex">
              {approveButton}
              {rejectButton}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={`py-2 px-3 grid grid-cols-12 gap-2 items-center ${
          isDisabled ? "opacity-50" : ""
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
            disabled={isDisabled}
          >
            <ThumbsUp size={12} className="mr-1" />
            <span>{item.like_count}</span>
          </Button>
        </div>
        <div className="col-span-2 font-medium">{item.suggestion_type}</div>
        <div className="col-span-3 text-gray-600 overflow-x-auto mx-4 ">{item.suggestion}</div>
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
        <div className="col-span-2 flex">
          {approveButton}
          {rejectButton}
        </div>
      </div>
    );
  };

  return (
    <li className="border-b last:border-b-0">
      {suggestions.map((item, index) => renderSuggestion(item, index))}
    </li>
  );
};