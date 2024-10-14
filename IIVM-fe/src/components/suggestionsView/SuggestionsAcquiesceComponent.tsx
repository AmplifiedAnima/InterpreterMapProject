import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { RootState } from "../../redux/store";
import {
  ExistingWordSuggestion,
  NewWordSuggestion,
} from "../../interfaces/suggestion";
import { ToolTipModal } from "../UI/ToolTipModal";
import { ExistingWordSuggestionsComponent } from "./ExistingSuggestionWordComponent";
import { NewWordSuggestionsComponent } from "./NewWordSuggestionComponent";
import { Button } from "../UI/Button";

interface SuggestionsAcquiesceComponentProps {
  existingWordSuggestions: ExistingWordSuggestion[];
  newWordSuggestions: NewWordSuggestion[];
  vocabularyItems: VocabularyItemInterface[] | null;
}

export const SuggestionsAcquiesceComponent: React.FC<
  SuggestionsAcquiesceComponentProps
> = ({ existingWordSuggestions, newWordSuggestions, vocabularyItems }) => {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showExistingSuggestions, setShowExistingSuggestions] = useState(true);

  const userRole = useSelector(
    (state: RootState) => state.authState.profile?.user_type
  );

  const canApprove = userRole === "overseer" || userRole === "superuser";

  const handleShowModal = (
    content: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const { top, left, height } = event.currentTarget.getBoundingClientRect();
    setModalPosition({ top: top + height + window.scrollY, left });
    setModalContent(content);
  };

  const handleCloseModal = () => setModalContent(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!vocabularyItems || vocabularyItems.length === 0) {
    console.warn("No vocabulary items available");
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-600">
        <p className="text-lg font-medium">Vocabulary data is not available.</p>
      </div>
    );
  }

  const toggleSuggestionType = () => {
    setShowExistingSuggestions(!showExistingSuggestions);
  };

  const noSuggestionsMessage = (
    <div className="flex flex-col h-full items-center justify-center text-gray-600">
      <p className="text-lg font-medium">No suggestions available.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center m-2">
        <Button
          onClick={toggleSuggestionType}
          className={`w-86 rounded-lg justify-center`}
        >
          {showExistingSuggestions
            ? "Show New Word Suggestions"
            : "Show Existing Word Suggestions"}
        </Button>
      </div>

      <div className="flex-grow overflow-hidden">
        {existingWordSuggestions.length === 0 && newWordSuggestions.length === 0 ? (
          noSuggestionsMessage
        ) : showExistingSuggestions ? (
          <ExistingWordSuggestionsComponent
            existingWordSuggestions={existingWordSuggestions}
            vocabularyItems={vocabularyItems}
            canApprove={canApprove}
            onShowModal={handleShowModal}
            isMobile={isMobile}
          />
        ) : (
          <NewWordSuggestionsComponent
            newWordSuggestions={newWordSuggestions}
            canApprove={canApprove}
            onShowModal={handleShowModal}
            isMobile={isMobile}
          />
        )}
      </div>

      {modalContent && (
        <ToolTipModal
          showModal={!!modalContent}
          onClose={handleCloseModal}
          position={modalPosition || { top: 0, left: 0 }}
          title="Definition"
          className="w-1/2"
        >
          {modalContent}
        </ToolTipModal>
      )}
    </div>
  );
};