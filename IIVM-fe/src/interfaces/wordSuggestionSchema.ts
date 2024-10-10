import { z } from 'zod';

const polishLettersSpaceHyphenApostrophe = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s'-]+$/;
const polishLettersSpaceHyphenApostropheError = 
  "Must contain only letters (including Polish characters), spaces, hyphens, and apostrophes";

  const languageEnum = z.enum(['pl', 'en', 'es', 'de', 'fr', 'coloquial expression']);

export const newWordSchema = z.object({
  term: z
    .string()
    .regex(polishLettersSpaceHyphenApostrophe, polishLettersSpaceHyphenApostropheError)
    .min(2, "Term must be at least 2 characters")
    .max(100, "Term must not exceed 100 characters"),

  definition: z.string().min(10, "Definition must be at least 10 characters"),

  translation: z
    .string()
    .regex(polishLettersSpaceHyphenApostrophe, polishLettersSpaceHyphenApostropheError)
    .min(2, "Translation must be at least 2 characters")
    .max(100, "Translation must not exceed 100 characters"),

  category: z.string().min(1, "Please select a category"),

  language: languageEnum
});

export const suggestionSchema = z.object({
  term: z
    .string()
    .regex(polishLettersSpaceHyphenApostrophe, polishLettersSpaceHyphenApostropheError)
    .min(2, "Term must be at least 2 characters")
    .max(100, "Term must not exceed 100 characters"),
  suggestionType: z.enum(["colloquial", "translation"]),
  suggestion: z
    .string()
    .regex(polishLettersSpaceHyphenApostrophe, polishLettersSpaceHyphenApostropheError)
    .min(2, "Suggestion must be at least 2 characters"),
  language: z.union([languageEnum, z.literal('coloquial expression')])
});

export type NewWordData = z.infer<typeof newWordSchema>;
export type SuggestionData = z.infer<typeof suggestionSchema>;
