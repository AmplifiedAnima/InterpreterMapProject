export interface Suggestion {
  id: number;
  vocabulary_item: number; // Changed from vocabulary_item_id to match the actual data
  suggestion_type: "colloquial" | "translation";
  suggestion: string;
  language: string; // This is likely a 2-character language code
  status: string;
}

export interface ExistingWordSuggestion {
  id: number;
  vocabulary_item: string; // Changed from vocabulary_item_id to match the actual data
  suggestion_type: string;
  suggestion: string;
  language: string;
  status: string;
  like_count: number;
}

export interface NewWordSuggestion {
  id: number;
  term: string;
  definition: string;
  translation: string;
  language: string;
  category: string;
  status: string;
  like_count: number;
}

export interface AllSuggestionsResponse {
  existing_word_suggestions: ExistingWordSuggestion[];
  new_word_suggestions: NewWordSuggestion[];
}