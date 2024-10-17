import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../UI/Button";
import { ThumbsUp, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  ExistingWordSuggestion,
  NewWordSuggestion,
} from "../../interfaces/suggestion";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";

export const SuggestionCard: React.FC<{
  item: ExistingWordSuggestion | NewWordSuggestion;
  isExisting: boolean;
  vocabularyItem?: VocabularyItemInterface;
  onLike: () => void;
  onApprove: () => void;
  onReject: () => void;
  canApprove: boolean;
  isExpanded: boolean;
  toggleExpand: () => void;
  isMobile: boolean;
}> = ({
  item,
  isExisting,
  vocabularyItem,
  onLike,
  onApprove,
  onReject,
  canApprove,
  isExpanded,
  toggleExpand,
  isMobile,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-[#7986cb] text-white"; // Indigo-ish color
      case "pending":
        return "bg-[#ffb74d] text-gray-900"; // Orange-ish color
      case "rejected":
        return "bg-[#e57373] text-white"; // Red-ish color
      default:
        return "bg-gray-200 text-gray-800"; // Default fallback
    }
  };
  return (
    <motion.div
      className="bg-white border border-gray-200 shadow-sm overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-2 bg-[#5b639e] border-b border-gray-200 flex justify-between items-center rounded-sm">
        <h3 className="text-lg font-semibold text-white">
          {isExisting ? vocabularyItem?.term : (item as NewWordSuggestion).term}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-white"> STATUS</span>
          <motion.span
            className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
              item.status
            )}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {item.status.toLocaleUpperCase()}
          </motion.span>
          {isMobile && (
            <motion.button
              onClick={toggleExpand}
              className="text-white hover:text-gray-200 p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.button>
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {(!isMobile || isExpanded) && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    {isExisting ? "Suggestion" : "Translation"}
                  </p>
                  <p className="text-sm text-gray-800">
                    {isExisting
                      ? (item as ExistingWordSuggestion).suggestion
                      : (item as NewWordSuggestion).translation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    {isExisting ? "Type" : "Category"}
                  </p>
                  <p className="text-sm text-gray-800">
                    {isExisting
                      ? (item as ExistingWordSuggestion).suggestion_type
                      : (item as NewWordSuggestion).category}
                  </p>
                </div>
                {!isExisting && (
                  <div className="md:col-span-2 lg:col-span-1">
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Definition
                    </p>
                    <p className="text-sm text-gray-800">
                      {(item as NewWordSuggestion).definition}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onLike}
                    disabled={item.status !== "pending"}
                    className="text-sm bg-[#5e67aa] text-white hover:bg-[#7a7fa0] py-2 px-4 flex items-center space-x-1"
                  >
                    <span>{item.like_count}</span>
                    <ThumbsUp size={14} className="ml-2 -top-[0.25px] relative" />
                  </Button>
                </motion.div>
                {canApprove && item.status === "pending" && (
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={onApprove}
                        className="text-sm bg-[#7986cb] hover:bg-[#5c6bc0] text-white py-2 px-4 flex items-center"
                      >
                        <Check size={14} className="mr-1" />
                        Approve
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={onReject}
                        className="text-sm bg-[#e57373] hover:bg-[#ef5350] text-white py-2 px-4 flex items-center"
                      >
                        <X size={14} className="mr-1" />
                        Reject
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
