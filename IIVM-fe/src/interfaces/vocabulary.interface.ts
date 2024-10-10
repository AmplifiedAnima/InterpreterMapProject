export interface Translation {
  id: string;
  language: string;
  translation: string;
  is_primary: boolean;
  is_colloquial: boolean;
  is_user_proposed: boolean;
}

export interface VocabularyItemInterface {
  id: string;
  term: string;
  definition: string;
  category: string;
  translations: Translation[];
  primary_translations: { [key: string]: string };
  colloquial_terms: { [key: string]: string[] };
  user_proposed_translations: { [key: string]: string[] };
}
export type GroupedVocabularyType = {
  [category: string]: VocabularyItemInterface[];
};