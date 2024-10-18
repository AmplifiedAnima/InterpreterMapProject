import React, { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useFormValidation } from "../utils/useFormValidation";
import {
  LocationStateSuggestionExistingWordForm,
  RejectedPayloadForSuggestionForms,
  SuggestionData,
  suggestionSchema,
} from "../interfaces/wordSuggestionSchema";
import { submitExistingWordSuggestionToBackend } from "../redux/suggestion/suggestionThunk";
import { AddSuggestionForm } from "../components/Forms/AddSugestionForm";
import { Toast } from "../components/UI/Toast";
import {
  clearSuggestionErrors,
  selectExistingWordError,
  selectExistingWordStatus,
} from "../redux/suggestion/SuggestionSlice";

const languageNames = [
  { code: "pl", name: "Polish" },
  { code: "es", name: "Spanish" },
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
] as const;

export const AddSuggestionRoute: React.FC = () => {
  const vocabularyItems = useSelector(
    (state: RootState) => state.vocabulary.items
  );
  const suggestionStatus = useSelector(selectExistingWordStatus);
  const suggestionError = useSelector(selectExistingWordError);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "default";
  } | null>(null);
  const [disabled, setIsDisabled] = useState(false);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const locationState = location.state as LocationStateSuggestionExistingWordForm | undefined;

  const initialSuggestionValues: Partial<SuggestionData> = {
    term: locationState?.word || "",
    suggestionType: "translation",
    language: "pl",
  };

  const {
    values: suggestionValues,
    errors: suggestionErrors,
    handleChange: handleSuggestionChange,
    handleSubmit: handleSuggestionSubmit,
  } = useFormValidation<SuggestionData>(
    suggestionSchema,
    initialSuggestionValues
  );

  const updateSuggestions = useCallback(
    (value: string) => {
      if (value.length > 0 && vocabularyItems) {
        const filteredSuggestions = Object.values(vocabularyItems)
          .filter((item) =>
            item.term.toLowerCase().includes(value.toLowerCase())
          )
          .map((item) => item.term)
          .slice(0, 5);
        setSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [vocabularyItems]
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      if (name === "suggestionType") {
        const newLanguage = value === "colloquial" ? "colloquial term" : "";
        handleSuggestionChange({
          target: { name: "language", value: newLanguage },
        } as React.ChangeEvent<HTMLInputElement>);
      }
      handleSuggestionChange(e as React.ChangeEvent<HTMLInputElement>);

      if (name === "term") {
        updateSuggestions(value);
      }
    },
    [handleSuggestionChange, updateSuggestions]
  );

  const handleSuggestionClick = useCallback(
    (term: string) => {
      handleSuggestionChange({
        target: { name: "term", value: term },
      } as React.ChangeEvent<HTMLInputElement>);
      setShowSuggestions(false);
    },
    [handleSuggestionChange]
  );

  const handleSuggestionFormSubmit = useCallback(
    async (data: SuggestionData) => {
      console.log("Submitting suggestion:", data);
      dispatch(clearSuggestionErrors()); // Clear previous errors

      try {
        const resultAction = await dispatch(
          submitExistingWordSuggestionToBackend(data)
        );

        if (
          submitExistingWordSuggestionToBackend.fulfilled.match(resultAction)
        ) {
          setToast({
            message: "Suggestion submitted successfully!",
            type: "success",
          });
          setIsDisabled(true);
          setTimeout(() => navigate("/vocabulary-map"), 3000);
        } else if (
          submitExistingWordSuggestionToBackend.rejected.match(resultAction)
        ) {
          const payload =
            resultAction.payload as RejectedPayloadForSuggestionForms;

          console.log("Result Action:", resultAction);
          console.log("Payload from rejected action:", payload);

          // Check if details are present
          if (payload.details) {
            console.log("Validation errors:", payload.details);
            // You can update state with detailed errors if needed
          } else if (payload.errors) {
            // Handle validation errors
            console.log("Specific validation errors:", payload.errors);
            setToast({
              message: "Please correct the highlighted errors.",
              type: "error",
            });
          } else if (payload.error && payload.field) {
            console.log(`Error on field '${payload.field}': ${payload.error}`);
            setToast({
              message: payload.error,
              type: "error",
            });
          } else {
            console.log(
              "General error: Failed to submit suggestion. No specific error provided."
            );
            setToast({
              message: "Failed to submit suggestion. Please try again.",
              type: "error",
            });
          }
        }
      } catch (error) {
        console.warn("Unexpected error during submission:", error);
        setToast({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
    },
    [dispatch, navigate]
  );

  const renderSuggestions = useCallback(
    () =>
      showSuggestions &&
      suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      ),
    [showSuggestions, suggestions, handleSuggestionClick]
  );

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">
        Suggest Change
      </h2>
      <AddSuggestionForm
        suggestionValues={suggestionValues}
        suggestionErrors={suggestionErrors}
        handleChange={handleChange}
        handleSubmit={handleSuggestionSubmit(handleSuggestionFormSubmit)}
        renderSuggestions={renderSuggestions}
        languageNames={languageNames}
        disabled={disabled || suggestionStatus === "loading"}
        backendErrors={suggestionError || {}}
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
