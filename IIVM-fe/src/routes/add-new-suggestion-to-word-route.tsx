import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useFormValidation } from "../utils/useFormValidation";
import {
  SuggestionData,
  suggestionSchema,
} from "../interfaces/wordSuggestionSchema";

import { fetchSuggestionToBackend } from "../redux/vocabulary/suggestionThunk";
import { AddSuggestionForm } from "../components/Forms/AddSugestionForm";
import { Toast } from "../components/UI/Toast";

interface LocationState {
  word?: string;
  translations?: Record<string, string>;
}

const languageNames = [
  { code: "pl", name: "Polish" },
  { code: "es", name: "Spanish" },
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
] as const;

export const AddSuggestionRoute = () => {
  const vocabularyItems = useSelector(
    (state: RootState) => state.vocabulary.items
  );
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

  const locationState = location.state as LocationState | undefined;
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

  const updateSuggestions = (value: string) => {
    if (value.length > 0 && vocabularyItems) {
      const filteredSuggestions = Object.values(vocabularyItems)
        .filter((item) => item.term.toLowerCase().includes(value.toLowerCase()))
        .map((item) => item.term)
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleChange = (
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
  };

  const handleSuggestionClick = (term: string) => {
    handleSuggestionChange({
      target: { name: "term", value: term },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowSuggestions(false);
  };

  const handleSuggestionFormSubmit = async (data: SuggestionData) => {
    console.log("Submitting suggestion:", data);
    const suggestionData = {
      term: data.term,
      suggestionType: data.suggestionType,
      suggestion: data.suggestion,
      language: data.language,
    };
    const resultAction = await dispatch(
      fetchSuggestionToBackend(suggestionData)
    );
    if (fetchSuggestionToBackend.fulfilled.match(resultAction)) {
      setToast({
        message: "Suggestion submitted successfully!",
        type: "success",
      });
      setIsDisabled(true);
      setTimeout(() => navigate("/vocabulary-map"), 3000);
    } else {
      setToast({
        message: "Failed to submit suggestion. Please try again.",
        type: "error",
      });
    }
  };

  const renderSuggestions = () =>
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
    );

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">
        Suggest Change
      </h2>
      <AddSuggestionForm
        suggestionValues={suggestionValues}
        suggestionErrors={suggestionErrors ?? {}}
        handleChange={handleChange}
        handleSubmit={handleSuggestionSubmit(handleSuggestionFormSubmit)}
        renderSuggestions={renderSuggestions}
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
