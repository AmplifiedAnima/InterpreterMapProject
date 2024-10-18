import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { NewWordData } from "../interfaces/wordSuggestionSchema";
import { submitNewWordSuggestion } from "../redux/suggestion/suggestionThunk";
import { AddWordForm } from "../components/Forms/AddWordForm";
import { Toast } from "../components/UI/Toast";
import { fetchCategoryLabelsOnly } from "../redux/vocabulary/vocabularyThunks";

interface RejectedPayload {
  errors?: Partial<Record<keyof NewWordData, string>>;
  error?: string;
  field?: keyof NewWordData;
  details?: Partial<Record<keyof NewWordData, string>>; // Add details here
}
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
  const categoryOfItems = useSelector(
    (state: RootState) => state.vocabulary.categoryLabels
  );

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "default";
  } | null>(null);
  const [disabled, setIsDisabled] = useState(false);
  const [backendErrors, setBackendErrors] = useState<
    Partial<Record<keyof NewWordData, string>>
  >({});
  const handleNewWordFormSubmit = async (data: NewWordData): Promise<void> => {
    console.log("Submitting new word suggestion:", data);
    setBackendErrors({}); // Clear previous errors

    try {
      const resultAction = await dispatch(submitNewWordSuggestion(data));

      // Log the result action for debugging
      console.log("Result Action:", resultAction);

      if (submitNewWordSuggestion.fulfilled.match(resultAction)) {
        setToast({
          message: "Word suggestion submitted successfully!",
          type: "success",
        });
        setIsDisabled(true);
        setTimeout(() => navigate("/vocabulary-map"), 3000);
      } else if (submitNewWordSuggestion.rejected.match(resultAction)) {
        const payload = resultAction.payload as RejectedPayload;

        // Log the payload for debugging
        console.log("Payload from rejected action:", payload);

        if (payload && payload.details) {
          // Assuming `details` is an object where keys are field names and values are error messages
          console.log("Validation errors:", payload.details);
          setBackendErrors(payload.details); // Set the errors received from the backend
        } else if (payload && payload.error && payload.field) {
          console.log(`Error on field '${payload.field}': ${payload.error}`);
          setBackendErrors({ [payload.field]: payload.error });
        } else {
          console.log(
            "General error: Failed to submit word suggestion. No specific error provided."
          );
          setToast({
            message: "Failed to submit word suggestion. Please try again.",
            type: "error",
          });
        }
      }
    } catch (error) {
      // Log unexpected errors that occur during the submission process
      console.error("Unexpected error during submission:", error);
      setToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (categoryOfItems.length === 0) {
      dispatch(fetchCategoryLabelsOnly());
    }
  }, [dispatch, categoryOfItems.length]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">
        Add New Word
      </h2>
      <AddWordForm
        onSubmit={ handleNewWordFormSubmit}
        categoryOfItems={categoryOfItems}
        languageNames={languageNames}
        disabled={disabled}
        backendErrors={backendErrors}
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
