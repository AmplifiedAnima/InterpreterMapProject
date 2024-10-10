import React, { ChangeEvent, FormEvent } from "react";
import { Button } from "../UI/Button";
import { Input as InputPlaceholder } from "../UI/InputPlaceholder";
import { NewWordData } from "../../interfaces/wordSuggestionSchema";

interface AddWordFormProps {
  newWordValues: Partial<NewWordData>;
  newWordErrors: Partial<Record<keyof NewWordData, string>>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  renderSuggestions: () => React.ReactNode;
  categoryOfItems: string[];
  languageNames: ReadonlyArray<{ code: string; name: string }>;
  disabled: boolean;
}
export const AddWordForm: React.FC<AddWordFormProps> = ({
  newWordValues,
  newWordErrors,
  handleChange,
  handleSubmit,
  renderSuggestions,
  categoryOfItems,
  languageNames,
  disabled,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label
          htmlFor="new-term"
          className="block mb-2 font-medium text-gray-700"
        >
          Term:
        </label>
        <InputPlaceholder
          id="new-term"
          name="term"
          value={newWordValues.term || ""}
          onChange={handleChange}
          className="w-full p-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition duration-200"
        />
        {newWordErrors?.term && (
          <p className="text-red-600 text-sm mt-1">{newWordErrors.term}</p>
        )}
        {renderSuggestions()}
      </div>

      <div>
        <label
          htmlFor="definition"
          className="block mb-2 font-medium text-gray-700"
        >
          Definition:
        </label>
        <textarea
          id="definition"
          name="definition"
          value={newWordValues.definition || ""}
          onChange={handleChange}
          className="w-full p-3 rounded border border-gray-300 h-28 resize-none focus:border-blue-500 focus:ring focus:ring-blue-100 transition duration-200"
        />
        {newWordErrors?.definition && (
          <p className="text-red-600 text-sm mt-1">
            {newWordErrors.definition}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="new-translation"
          className="block mb-2 font-medium text-gray-700"
        >
          Translation:
        </label>
        <InputPlaceholder
          id="new-translation"
          name="translation"
          value={newWordValues.translation || ""}
          onChange={handleChange}
          className="w-full p-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition duration-200"
        />
        {newWordErrors?.translation && (
          <p className="text-red-600 text-sm mt-1">
            {newWordErrors.translation}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block mb-2 font-medium text-gray-700"
        >
          Category of a new word:
        </label>
        <select
          id="category"
          name="category"
          value={newWordValues.category || ""}
          onChange={handleChange}
          className="w-full p-3 rounded border transition duration-200"
        >
          <option value="">Select category</option>
          {categoryOfItems.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {newWordErrors?.category && (
          <p className="text-red-600 text-sm mt-1">{newWordErrors.category}</p>
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
          value={newWordValues.language || ""}
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
        {newWordErrors?.language && (
          <p className="text-red-600 text-sm mt-1">{newWordErrors.language}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full rounded-lg transition duration-300"
        disabled={disabled}
      >
        Add New Word
      </Button>
    </form>
  );
};
