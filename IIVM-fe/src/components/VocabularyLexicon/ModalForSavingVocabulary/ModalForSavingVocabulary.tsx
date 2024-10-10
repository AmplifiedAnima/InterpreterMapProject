import React from "react";
import { Modal } from "../../UI/Modal";
import { Button } from "../../UI/Button";
import { useNavigate } from "react-router-dom";
import closeIcon from "../../../assets/icons/x.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface SavedVocabularyModalProps {
  showModal: boolean;
  onClose: () => void;
}

export const SavedVocabularyModal: React.FC<SavedVocabularyModalProps> = ({
  showModal,
  onClose,
}) => {
  const navigate = useNavigate();
  const savedVocabularyIds = useSelector(
    (state: RootState) => state.vocabulary.savedVocabularyIds
  );
  const vocabularyItems = useSelector(
    (state: RootState) => state.vocabulary.items
  );

  const groupedSavedVocabulary = savedVocabularyIds.reduce((acc, id) => {
    const word = vocabularyItems[id];
    if (word) {
      if (!acc[word.category]) {
        acc[word.category] = [];
      }
      acc[word.category].push(word);
    }
    return acc;
  }, {} as Record<string, (typeof vocabularyItems)[string][]>);

  return (
    <Modal
      showModal={showModal}
      onClose={onClose}
      title="Saved Vocabulary"
      footer={
        <>
          <Button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            imageIcon={closeIcon}
          >
            Close
          </Button>
          <Button onClick={() => navigate("/quiz-page")}>Start Learning</Button>
        </>
      }
      className="lg:max-w-[60vw] sm:max-w-[80vw] max-h-[80vh]"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Term
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Translation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedSavedVocabulary).map(([category, words]) => (
              <React.Fragment key={category}>
                <tr className="bg-gray-100">
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-sm font-medium text-gray-900"
                  >
                    {category.toUpperCase()}
                  </td>
                </tr>
                {words.map((word, index) => (
                  <tr key={`${category}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {word.term}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {Object.values(word.primary_translations || {}).join(
                          ", "
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {Object.keys(groupedSavedVocabulary).length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No saved words yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
