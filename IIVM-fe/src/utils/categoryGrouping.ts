import {
  VocabularyItemInterface,
  GroupedVocabularyType,
} from "../interfaces/vocabulary.interface";

export const groupByCategory = (
  vocabulary: VocabularyItemInterface[]
): GroupedVocabularyType => {
  // Step 1: Group vocabulary items by category
  const groupedVocabulary = vocabulary.reduce(
    (acc: GroupedVocabularyType, item: VocabularyItemInterface) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {}
  );

  // Step 2: Sort the categories by the number of items in each (smallest to largest)
  const sortedGroupedVocabulary: GroupedVocabularyType = Object.entries(
    groupedVocabulary
  )
    .sort((a, b) => a[1].length - b[1].length) // Sort by number of items in each category
    .reduce((acc, [category, items]) => {
      acc[category] = items;
      return acc;
    }, {} as GroupedVocabularyType);

  return sortedGroupedVocabulary;
};

export const groupByCategoryDescending = (
  vocabulary: VocabularyItemInterface[]
): GroupedVocabularyType => {
  // Step 1: Group vocabulary items by category
  const groupedVocabulary = vocabulary.reduce(
    (acc: GroupedVocabularyType, item: VocabularyItemInterface) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);

      return acc;
    },
    {}
  );

  // Step 2: Sort the categories by the number of items in each (largest to smallest)
  const sortedGroupedVocabulary: GroupedVocabularyType = Object.entries(groupedVocabulary)
    .sort(([, itemsA], [, itemsB]) => itemsB.length - itemsA.length) // Sort by the number of items (descending)
    .reduce((acc, [category, items]) => {
      acc[category] = items;
      return acc;
    }, {} as GroupedVocabularyType);

  return sortedGroupedVocabulary;
};


