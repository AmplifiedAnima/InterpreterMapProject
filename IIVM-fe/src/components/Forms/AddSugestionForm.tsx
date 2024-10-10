import React, { ChangeEvent, FormEvent } from "react";
import { Button } from "../UI/Button";
import { Input as InputPlaceholder } from "../UI/InputPlaceholder";
import { SuggestionData } from "../../interfaces/wordSuggestionSchema";

interface AddSuggestionFormProps {
  suggestionValues: Partial<SuggestionData>;
  suggestionErrors: Partial<Record<keyof SuggestionData, string>>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  renderSuggestions: () => React.ReactNode;
  languageNames: ReadonlyArray<{ code: string; name: string }>;
  disabled: boolean;
}

export const AddSuggestionForm: React.FC<AddSuggestionFormProps> = ({
  suggestionValues,
  suggestionErrors,
  handleChange,
  handleSubmit,
  renderSuggestions,
  languageNames,
  disabled,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        />
        {suggestionErrors?.term && (
          <p className="text-red-600 text-sm mt-1">{suggestionErrors.term}</p>
        )}
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
        >
          <option value="">Select type</option>
          <option value="colloquial">Colloquial Term</option>
          <option value="translation">Translation</option>
        </select>
        {suggestionErrors?.suggestionType && (
          <p className="text-red-600 text-sm mt-1">
            {suggestionErrors.suggestionType}
          </p>
        )}
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
        />
        {suggestionErrors?.suggestion && (
          <p className="text-red-600 text-sm mt-1">
            {suggestionErrors.suggestion}
          </p>
        )}
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
        >
          <option value="">Select language</option>
          {languageNames.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
        {suggestionErrors?.language && (
          <p className="text-red-600 text-sm mt-1">
            {suggestionErrors.language}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-lg transition duration-300"
        disabled={disabled}
      >
        Submit Suggestion
      </Button>
    </form>
  );
};