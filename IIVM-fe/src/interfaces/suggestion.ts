// export interface Suggestion {
//   id: number;
//   vocabulary_item: number; // Changed from vocabulary_item_id to match the actual data
//   suggestion_type: "colloquial" | "translation";
//   suggestion: string;
//   language: string; // This is likely a 2-character language code
//   status: string;
// }
export type Language =
  | "pl"
  | "en"
  | "es"
  | "de"
  | "fr"
  | "coloquial expression";

export interface ExistingWordSuggestion {
  id: string;
  vocabulary_item: string;
  suggestion_type: "colloquial" | "translation";
  suggestion: string;
  language: Language;
  status: string;
  like_count: number;
}
export interface NewWordSuggestion {
  id: string;
  term: string;
  definition: string;
  translation: string;
  language: Language;
  category: string;
  status: string;
  like_count: number;
}

export interface AllSuggestionsResponse {
  existing_word_suggestions: ExistingWordSuggestion[];
  new_word_suggestions: NewWordSuggestion[];
}
