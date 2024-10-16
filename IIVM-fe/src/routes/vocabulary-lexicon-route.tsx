import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VocabularyLexicon } from "../components/VocabularyLexicon/VocabularyLexiconBoard";
import {
  fetchVocabularyByCategory,
  fetchVocabularyWithSpecificId,
  fetchVocabulary,
  fetchSavedVocabularyOfUser,
} from "../redux/vocabulary/vocabularyThunks";
import { setCurrentItem } from "../redux/vocabulary/VocabularySlice";
import { AppDispatch, RootState } from "../redux/store";
import { useParams, useNavigate } from "react-router-dom";
import { VocabularyItemInterface } from "../interfaces/vocabulary.interface";
import FullPageSpinner from "../components/UI/FullPageSpinner";
import { motion } from "framer-motion";

export const VocabularyLexiconRoute: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { category, id } = useParams<{ category?: string; id?: string }>();

  const {
    items,
    groupedItems,
    categoryLabels,
    status,
    error,
    currentItemId,
    savedVocabularyIds,
  } = useSelector((state: RootState) => state.vocabulary);

  const currentItem = useMemo(
    () => (currentItemId ? items[currentItemId] : null),
    [items, currentItemId]
  );

  useEffect(() => {
    console.log("Component re-rendered");
    console.log("Current category:", category);
    console.log("Current id:", id);
    console.log("Category Labels:", categoryLabels);
    console.log("Grouped Items:", groupedItems);
    console.log("Status:", status);
  });

  useEffect(() => {
    const savedVocabularyNotInSlice = savedVocabularyIds.filter(
      (id) => !items[id]
    );
    if (savedVocabularyNotInSlice.length > 0) {
      console.log("Fetching saved vocabulary");
      dispatch(fetchSavedVocabularyOfUser());
    }
  }, [dispatch, items, savedVocabularyIds]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      console.log("Status:", status);
      if (status === "loading") return;

      if (id) {
        if (!items[id]) {
          console.log("Fetching vocabulary with specific id:", id);
          await dispatch(fetchVocabularyWithSpecificId(id));
        } else {
          console.log("Setting current item:", id);
          dispatch(setCurrentItem(id));
        }
      } else if (category) {
        if (!groupedItems[category] || groupedItems[category].length === 0) {
          console.log("Fetching vocabulary by category:", category);
          await dispatch(fetchVocabularyByCategory(category));
        } else {
          console.log("Using cached data for category:", category);
        }
      } else {
        if (Object.keys(groupedItems).length === 0) {
          console.log("Fetching all vocabulary");
          await dispatch(fetchVocabulary());
        } else {
          console.log("Using cached data for all vocabulary");
        }
      }
      console.log("Fetch complete");
    };

    fetchData();
  }, [dispatch, category, id, items, groupedItems, status]);

  const handleCategorySelect = useCallback(
    (selectedCategory: string) => {
      console.log("Category selected:", selectedCategory);
      navigate(`/vocabulary-map/${selectedCategory}`);
    },
    [navigate]
  );

  const handleWordSelect = useCallback(
    (word: VocabularyItemInterface) => {
      console.log("Word selected:", word);
      dispatch(setCurrentItem(word.id));
      navigate(`/vocabulary-map/${word.category}/${word.id}`);
    },
    [navigate, dispatch]
  );

  const hasNecessaryData = useMemo(() => {
    const result = !category && !id
      ? Object.keys(groupedItems).length > 0
      : categoryLabels.length > 0 &&
        (!category || (groupedItems[category] && groupedItems[category].length > 0));
    
    console.log("Has necessary data:", result);
    console.log("Category Labels length:", categoryLabels.length);
    console.log("Grouped Items keys:", Object.keys(groupedItems));
    
    return result;
  }, [category, id, categoryLabels, groupedItems]);

  if (status === "loading" || !hasNecessaryData) {
    console.log("Rendering FullPageSpinner");
    return <FullPageSpinner />;
  }

  if (status === "failed") {
    console.log("Rendering error state");
    return <div>Error: {error}</div>;
  }

  console.log("Rendering VocabularyLexicon");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <VocabularyLexicon
        groupedVocabulary={groupedItems}
        categoryLabels={categoryLabels}
        onCategorySelect={handleCategorySelect}
        onWordSelect={handleWordSelect}
        selectedCategory={category || null}
        selectedWord={currentItem}
      />
    </motion.div>
  );
};