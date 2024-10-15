import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useFormValidation } from "../utils/useFormValidation";
import { NewWordData, newWordSchema } from "../interfaces/wordSuggestionSchema";
import { suggestNewWord } from "../redux/vocabulary/suggestionThunk";
import { AddWordForm } from "../components/Forms/AddWordForm";
import { Toast } from "../components/UI/Toast";

const languageNames = [
  { code: "pl", name: "Polish" },
  { code: "es", name: "Spanish" },
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
] as const;

export const AddNewWordRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const categoryOfItems = useSelector((state: RootState) => state.vocabulary.categoryLabels);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "default";
  } | null>(null);
  const [disabled, setIsDisabled] = useState(false);

  const {
    values: newWordValues,
    errors: newWordErrors,
    handleChange: handleNewWordChangeOriginal,
    handleSubmit: handleNewWordSubmit,
  } = useFormValidation<NewWordData>(newWordSchema);

  // Create a new handleChange function that can handle all input types
  const handleNewWordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    handleNewWordChangeOriginal(e as ChangeEvent<HTMLInputElement>);
  };

  const handleNewWordFormSubmit = async (data: NewWordData) => {
    console.log("Submitting new word suggestion:", data);
    const resultAction = await dispatch(suggestNewWord(data));

    if (suggestNewWord.fulfilled.match(resultAction)) {
      setToast({
        message: "Word suggestion submitted successfully!",
        type: "success",
      });
      setIsDisabled(true);
      setTimeout(() => navigate("/vocabulary-map"), 3000);
    } else {
      setToast({
        message: "Failed to submit word suggestion. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">
        Add New Word
      </h2>
      <AddWordForm
        newWordValues={newWordValues}
        newWordErrors={newWordErrors ?? {}}
        handleChange={handleNewWordChange}
        handleSubmit={handleNewWordSubmit(handleNewWordFormSubmit)}
        categoryOfItems={categoryOfItems}
        languageNames={languageNames}
        disabled={disabled}
      />
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
