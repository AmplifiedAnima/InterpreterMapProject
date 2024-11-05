import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "../UI/Button";
import { Input as InputPlaceholder } from "../UI/InputPlaceholder";
import { SuggestionData } from "../../interfaces/wordSuggestionSchema";
import { AnimatePresence, motion } from "framer-motion";

interface AddSuggestionFormProps {
  suggestionValues: Partial<SuggestionData>;
  suggestionErrors: Partial<Record<keyof SuggestionData, string>> | null;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  renderSuggestions: () => React.ReactNode;
  languageNames: ReadonlyArray<{ code: string; name: string }>;
  disabled: boolean;
  backendErrors: {
    message?: string;
    error?: string;
    details?:
      | Partial<Record<keyof SuggestionData, string | string[]>>
      | {
          error?: string;
          details?: Partial<Record<keyof SuggestionData, string | string[]>>;
        };
  } | null;
}
export const AddSuggestionForm: React.FC<AddSuggestionFormProps> = ({
  suggestionValues,
  suggestionErrors,
  handleChange,
  handleSubmit,
  renderSuggestions,
  languageNames,
  disabled,
  backendErrors,
}) => {
  const renderError = (field: keyof SuggestionData) => {
    const validationError = suggestionErrors && suggestionErrors[field];
    let backendError: string | string[] | undefined;

    if (backendErrors && backendErrors.details) {
      if (
        typeof backendErrors.details === "object" &&
        "details" in backendErrors.details
      ) {
        backendError = backendErrors.details.details?.[field];
      }
    }

    const error =
      validationError ||
      (Array.isArray(backendError) ? backendError[0] : backendError);

    return error ? (
      <div className="bg-[#ffe1e6] rounded-md mt-1 flex justify-center items-center p-2">
        <p className="text-red-600 text-sm font-medium">{error}</p>
      </div>
    ) : null;
  };

  useEffect(() => {
    console.log(backendErrors);
  }, [backendErrors]);

  return (
    <AnimatePresence>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="mt-2 space-y-2"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <label
            htmlFor="suggestion-term"
            className="block mb-2 font-medium text-gray-700"
          >
            Term:
          </label>
          <InputPlaceholder
            id="suggestion-term"
            name="term"
            value={suggestionValues.term || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition duration-200"
            disabled={disabled}
          />
          {renderError("term")}
          {renderSuggestions()}
        </div>

        <div>
          <label
            htmlFor="suggestionType"
            className="block mb-2 font-medium text-gray-700"
          >
            Suggestion Type:
          </label>
          <select
            id="suggestionType"
            name="suggestionType"
            value={suggestionValues.suggestionType || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border transition duration-200"
            disabled={disabled}
          >
            <option value="">Select type</option>
            <option value="colloquial">Colloquial Term</option>
            <option value="translation">Translation</option>
          </select>
          {renderError("suggestionType")}
        </div>

        <div>
          <label
            htmlFor="suggestion"
            className="block mb-2 font-medium text-gray-700"
          >
            {suggestionValues.suggestionType === "colloquial"
              ? "Colloquial Term:"
              : "Translation:"}
          </label>
          <InputPlaceholder
            id="suggestion"
            name="suggestion"
            value={suggestionValues.suggestion || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border transition duration-200"
            disabled={disabled}
          />
          {renderError("suggestion")}
        </div>

        <div>
          <label
            htmlFor="language"
            className="block mb-2 font-medium text-gray-700"
          >
            Language:
          </label>
          <select
            id="language"
            name="language"
            value={suggestionValues.language || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border transition duration-200"
            disabled={disabled}
          >
            <option value="">Select language</option>
            {languageNames.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
          {renderError("language")}
        </div>

        {backendErrors &&
          (backendErrors.message ||
            backendErrors.error ||
            (typeof backendErrors.details === "object" &&
              "error" in backendErrors.details &&
              backendErrors.details.error)) && (
            <div className="bg-[#ffe1e6] rounded-md mt-1 flex justify-center items-center p-2">
              <p className="text-red-600 text-sm font-medium">
                {backendErrors.message ||
                  backendErrors.error ||
                  (typeof backendErrors.details === "object" &&
                    "error" in backendErrors.details &&
                    backendErrors.details.error)}
              </p>
            </div>
          )}
        <Button
          type="submit"
          className="w-full rounded-lg transition duration-300"
          disabled={disabled}
        >
          Submit Suggestion
        </Button>
      </motion.form>
    </AnimatePresence>
  );
};
