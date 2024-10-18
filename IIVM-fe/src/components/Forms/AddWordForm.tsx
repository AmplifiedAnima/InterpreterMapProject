import React, { useEffect } from "react";
import { Button } from "../UI/Button";
import { Input as InputPlaceholder } from "../UI/InputPlaceholder";
import {
  NewWordData,
  newWordSchema,
} from "../../interfaces/wordSuggestionSchema";
import { useFormValidation } from "../../utils/useFormValidation";
import { AnimatePresence, motion } from "framer-motion";

interface AddWordFormProps {
  initialValues?: Partial<NewWordData>;
  onSubmit: (data: NewWordData) => void;
  categoryOfItems: string[];
  languageNames: ReadonlyArray<{ code: string; name: string }>;
  disabled: boolean;
  backendErrors?: Partial<Record<keyof NewWordData, string>>;
}

export const AddWordForm: React.FC<AddWordFormProps> = ({
  initialValues = {},
  onSubmit,
  categoryOfItems,
  languageNames,
  disabled,
  backendErrors = {},
}) => {
  const { values, errors, handleChange, handleSubmit } =
    useFormValidation<NewWordData>(newWordSchema, initialValues);
  const renderError = (field: keyof NewWordData) => {
    const error = backendErrors[field] || errors?.[field];
    return error ? (
      <div className="bg-[#ffe1e6] rounded-md mt-1 flex justify-center items-center p-2">
        <p className="text-red-600 text-sm font-medium">{error}</p>
      </div>
    ) : null;
  };
  useEffect(()=>{console.log(backendErrors)},[backendErrors])
  return (
    <AnimatePresence>
      {" "}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="mt-2 space-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="term"
            className="block mb-2 font-medium text-gray-700"
          >
            Term:
          </label>
          <InputPlaceholder
            id="term"
            name="term"
            value={values.term || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition duration-200"
            disabled={disabled}
          />
          {renderError("term")}
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
            value={values.definition || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 h-28 resize-none focus:border-blue-500 focus:ring focus:ring-blue-100 transition duration-200"
            disabled={disabled}
          />
          {renderError("definition")}
        </div>

        <div>
          <label
            htmlFor="translation"
            className="block mb-2 font-medium text-gray-700"
          >
            Translation:
          </label>
          <InputPlaceholder
            id="translation"
            name="translation"
            value={values.translation || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition duration-200"
            disabled={disabled}
          />
          {renderError("translation")}
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
            value={values.category || ""}
            onChange={handleChange}
            className="w-full p-3 rounded border transition duration-200"
            disabled={disabled}
          >
            <option value="">Select category</option>
            {categoryOfItems.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {renderError("category")}
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
            value={values.language || ""}
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

        <Button
          type="submit"
          className="w-52 rounded-lg transition duration-300"
          disabled={disabled}
        >
          Add New Word
        </Button>
      </motion.form>
    </AnimatePresence>
  );
};
