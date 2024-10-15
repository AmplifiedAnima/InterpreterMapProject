import React, { useState, ChangeEvent, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "../UI/Button";
import { useFormValidation } from "../../utils/useFormValidation";
import { AppDispatch } from "../../redux/store";
import {
  NewWordData,
  newWordSchema,
  SuggestionData,
  suggestionSchema,
} from "../../interfaces/wordSuggestionSchema";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { fetchSuggestionToBackend } from "../../redux/vocabulary/suggestionThunk";
import { AddWordForm } from "../Forms/AddWordForm";
import { AddSuggestionForm } from "../Forms/AddSugestionForm";
import { Toast } from "../UI/Toast";
import { suggestNewWord } from "../../redux/vocabulary/suggestionThunk";

interface AddWordComponentProps {
  vocabularyItems: { [id: string]: VocabularyItemInterface };
  categoryOfItems: string[];
}

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

export const AddWordComponent: React.FC<AddWordComponentProps> = ({
  vocabularyItems,
  categoryOfItems,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const locationState = location.state as LocationState | undefined;
  const initialFormType = locationState?.word ? "suggestion" : "newWord";
  const [formType, setFormType] = useState<"newWord" | "suggestion">(
    initialFormType
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "default";
  } | null>(null);
  const [disabled, setIsDisabled] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const initialSuggestionValues: Partial<SuggestionData> = {
    term: locationState?.word || "",
    suggestionType: "translation",
    language: "pl",
  };

  const {
    values: newWordValues,
    errors: newWordErrors,
    handleChange: handleNewWordChange,
    handleSubmit: handleNewWordSubmit,
  } = useFormValidation<NewWordData>(newWordSchema);

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (formType === "newWord") {
      handleNewWordChange(e as ChangeEvent<HTMLInputElement>);
    } else {
      if (name === "suggestionType") {
        const newLanguage = value === "colloquial" ? "colloquial term" : "";
        handleSuggestionChange({
          target: { name: "language", value: newLanguage },
        } as ChangeEvent<HTMLInputElement>);
      }
      handleSuggestionChange(e as ChangeEvent<HTMLInputElement>);
    }

    if (name === "term") {
      updateSuggestions(value);
    }
  };

  const handleSuggestionClick = (term: string) => {
    const changeEvent = {
      target: { name: "term", value: term },
    } as ChangeEvent<HTMLInputElement>;

    if (formType === "newWord") {
      handleNewWordChange(changeEvent);
    } else {
      handleSuggestionChange(changeEvent);
    }
    setShowSuggestions(false);
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
      <div className="grid grid-cols-1 gap-4 justify-items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          {formType === "newWord" ? "Add New Word" : "Suggest Change"}
        </h2>
        <div className="flex space-x-3">
          <Button
            onClick={() => setFormType("newWord")}
            className={`px-4 py-2 rounded-lg text-sm font-medium w-32 ${
              formType === "newWord"
                ? "text-white"
                : "bg-gray-200 text-gray-700"
            } transition duration-300`}
          >
            New Word
          </Button>
          <Button
            onClick={() => setFormType("suggestion")}
            className={`px-4 py-2 rounded-lg text-sm font-medium w-32 ${
              formType === "suggestion"
                ? "text-white"
                : "bg-gray-200 text-gray-700"
            } transition duration-300`}
          >
            Suggestion
          </Button>
        </div>
      </div>

      {formType === "newWord" ? (
        <AddWordForm
          newWordValues={newWordValues}
          newWordErrors={newWordErrors ?? {}}
          handleChange={handleChange}
          handleSubmit={handleNewWordSubmit(handleNewWordFormSubmit)}
          categoryOfItems={categoryOfItems}
          languageNames={languageNames}
          disabled={disabled}
        />
      ) : (
        <AddSuggestionForm
          suggestionValues={suggestionValues}
          suggestionErrors={suggestionErrors ?? {}}
          handleChange={handleChange}
          handleSubmit={handleSuggestionSubmit(handleSuggestionFormSubmit)}
          renderSuggestions={renderSuggestions}
          languageNames={languageNames}
          disabled={disabled}
        />
      )}

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
