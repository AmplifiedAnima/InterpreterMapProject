// NewWordSuggestionItem.tsx
import React, { useState } from "react";
import { NewWordSuggestion } from "../../interfaces/suggestion";
import { Button } from "../UI/Button";
import { ThumbsUp, Check, Info } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  likeNewWordSuggestion,
  approveNewWordSuggestion,
} from "../../redux/vocabulary/suggestionThunk";
import { Toast } from "../UI/Toast";

interface NewWordSuggestionItemProps {
  suggestion: NewWordSuggestion;
  onShowModal: (content: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLike: (id: number) => void;
  onApprove?: (id: number) => void;
}

export const NewWordSuggestionItem: React.FC<NewWordSuggestionItemProps> = ({
  suggestion,
  onShowModal,
  onLike,
  onApprove,
}) => {
  return (
    <li className="border-b last:border-b-0">
      <div
        className={`py-2 px-3 grid grid-cols-12 gap-2 items-center ${
          suggestion.status === "accepted" ? "opacity-50" : ""
        }`}
      >
        <div className="col-span-2">{suggestion.term}</div>
        <div className="col-span-1">
          <Button
            onClick={() => onLike(suggestion.id)}
            className="flex items-center"
            disabled={suggestion.status === "accepted"}
          >
            <ThumbsUp size={12} className="mr-1" />
            <span>{suggestion.like_count}</span>
          </Button>
        </div>
        <div className="col-span-2">
          {suggestion.definition ? (
            <Button
              onClick={(e) => onShowModal(suggestion.definition, e!)}
              className=""
            >
              <Info size={14} />
            </Button>
          ) : (
            "N/A"
          )}
        </div>
        <div className="col-span-2 text-gray-600">{suggestion.translation}</div>
        <div className="col-span-2 text-gray-600">{suggestion.category}</div>
        <div className="col-span-1">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              suggestion.status === "accepted"
                ? "bg-green-200 text-green-800"
                : suggestion.status === "pending"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {suggestion.status}
          </span>
        </div>
        {onApprove && suggestion.status !== "accepted" && (
          <div className="col-span-2">
            <Button
              onClick={() => onApprove(suggestion.id)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Check size={12} className="mr-1" />
              Approve
            </Button>
          </div>
        )}
      </div>
    </li>
  );
};

interface NewWordSuggestionsComponentProps {
    newWordSuggestions: NewWordSuggestion[];
    canApprove: boolean;
    onShowModal: (
      content: string,
      event: React.MouseEvent<HTMLButtonElement>
    ) => void;
  }
  export const NewWordSuggestionsComponent: React.FC<NewWordSuggestionsComponentProps> = ({
    newWordSuggestions,
    canApprove,
    onShowModal,
  }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
    const handleLikeNew = (suggestionId: number) => {
      dispatch(likeNewWordSuggestion(suggestionId));
    };
  
    const handleApproveNew = async (suggestionId: number) => {
      try {
        await dispatch(approveNewWordSuggestion(suggestionId)).unwrap();
        setToast({ message: "New word suggestion approved successfully!", type: 'success' });
      } catch (error) {
        console.error(error)
        setToast({ message: "Failed to approve new word suggestion. Please try again.", type: 'error' });
      }
    };
  
    return (
      <div className="border rounded-md overflow-hidden">
        <h2 className="text-base font-bold px-3 py-2 bg-gray-200">New Word Suggestions</h2>
        <div className="bg-gray-100 text-gray-700 font-semibold py-2 px-3 grid grid-cols-12 gap-2">
          <div className="col-span-2">Term</div>
          <div className="col-span-1">Likes</div>
          <div className="col-span-2">Definition</div>
          <div className="col-span-2">Translation</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Status</div>
          {canApprove && <div className="col-span-2"></div>}
        </div>
        <div className="max-h-80 overflow-y-auto">
          <ul>
            {newWordSuggestions.map((suggestion) => (
              <NewWordSuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
                onShowModal={onShowModal}
                onLike={handleLikeNew}
                onApprove={canApprove ? handleApproveNew : undefined}
              />
            ))}
          </ul>
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