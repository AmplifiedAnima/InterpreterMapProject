import { z } from 'zod';

const extendedLettersNumbersSpaceHyphenApostrophe = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻáéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜßçÇ0-9\s'-]+$/;
const extendedLettersNumbersSpaceHyphenApostropheError = 
  "Must contain only letters , numbers, spaces, hyphens, and apostrophes";

const languageEnum = z.enum(['pl', 'en', 'es', 'de', 'fr', 'coloquial expression']);

export const newWordSchema = z.object({
  term: z
    .string()
    .regex(extendedLettersNumbersSpaceHyphenApostrophe, extendedLettersNumbersSpaceHyphenApostropheError)
    .min(2, "Term must be at least 2 characters")
    .max(20, "Term must not exceed 20 characters"),
  definition: z.string().min(10, "Definition must be at least 10 characters"),
  translation: z
    .string()
    .regex(extendedLettersNumbersSpaceHyphenApostrophe, extendedLettersNumbersSpaceHyphenApostropheError)
    .min(2, "Translation must be at least 2 characters")
    .max(50, "Translation must not exceed 50 characters"),
  category: z.string().min(1, "Please select a category"),
  language: languageEnum
});

export const suggestionSchema = z.object({
  term: z
    .string()
    .regex(extendedLettersNumbersSpaceHyphenApostrophe, extendedLettersNumbersSpaceHyphenApostropheError)
    .min(2, "Term must be at least 2 characters")
    .max(100, "Term must not exceed 100 characters"),
  suggestionType: z.enum(["colloquial", "translation"]),
  suggestion: z
    .string()
    .regex(extendedLettersNumbersSpaceHyphenApostrophe, extendedLettersNumbersSpaceHyphenApostropheError)
    .min(2, "Suggestion must be at least 2 characters"),
  language: languageEnum
});

export type NewWordData = z.infer<typeof newWordSchema>;
export type SuggestionData = z.infer<typeof suggestionSchema>;

export interface LocationStateSuggestionExistingWordForm {
  word?: string;
  translations?: Record<string, string>;
}

export interface RejectedPayloadForSuggestionForms {
  errors?: Partial<Record<keyof SuggestionData, string>>;
  error?: string;
  field?: keyof SuggestionData;
  details?: Partial<Record<keyof SuggestionData, string>>;
}
