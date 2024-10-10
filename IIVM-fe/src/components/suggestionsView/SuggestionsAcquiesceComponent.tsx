import React, { useState } from "react";
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

  if (existingWordSuggestions.length === 0 && newWordSuggestions.length === 0) {
    return <div className="text-sm">No suggestions available.</div>;
  }

  if (!vocabularyItems || vocabularyItems.length === 0) {
    console.warn("No vocabulary items available");
    return <div className="text-sm">Vocabulary data is not available.</div>;
  }

  return (
    <div className="text-sm flex flex-col space-y-4">
      <ExistingWordSuggestionsComponent
        existingWordSuggestions={existingWordSuggestions}
        vocabularyItems={vocabularyItems}
        canApprove={canApprove}
        onShowModal={handleShowModal}
      />

      <NewWordSuggestionsComponent
        newWordSuggestions={newWordSuggestions}
        canApprove={canApprove}
        onShowModal={handleShowModal}
      />

      {modalContent && (
        <ToolTipModal
          showModal={!!modalContent}
          onClose={handleCloseModal}
          position={modalPosition || { top: 0, left: 0 }}
          title="Definition"
        >
          {modalContent}
        </ToolTipModal>
      )}
    </div>
  );
};
