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
