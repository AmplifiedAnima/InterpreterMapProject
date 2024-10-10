import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VocabularyMapBoard } from "../components/VocabularyLexicon/VocabularyLexiconBoard";
import {
  fetchVocabularyByCategory,
  fetchVocabularyWithSpecificId,
  fetchVocabulary,
} from "../redux/vocabulary/vocabularyThunks";
import { setCurrentItem } from "../redux/vocabulary/VocabularySlice";
import { AppDispatch, RootState } from "../redux/store";
import { useParams, useNavigate } from "react-router-dom";
import { VocabularyItemInterface, } from "../interfaces/vocabulary.interface";
import FullPageSpinner from "../components/UI/FullPageSpinner";

export const VocbularyLeixconRoute: React.FC = () => {
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
  } = useSelector((state: RootState) => state.vocabulary);

  const currentItem = useMemo(() => 
    currentItemId ? items[currentItemId] : null, 
    [items, currentItemId]
  );

  // Fetch vocabulary by category, specific item, or all items
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'loading') return;

      if (id) {
        if (!items[id]) {
          await dispatch(fetchVocabularyWithSpecificId(id));
        } else {
          dispatch(setCurrentItem(id));
        }
      } else if (category) {
        if (!groupedItems[category] || groupedItems[category].length === 0) {
          await dispatch(fetchVocabularyByCategory(category));
        }
      } else {
        // If no category or id is specified, fetch all items
        if (Object.keys(groupedItems).length === 0) {
          await dispatch(fetchVocabulary());
        }
      }
    };

    fetchData();
  }, [dispatch, category, id, items, groupedItems, status]);

  const handleCategorySelect = useCallback((selectedCategory: string) => {
    navigate(`/vocabulary-map/${selectedCategory}`);
  }, [navigate]);

  const handleWordSelect = useCallback((word: VocabularyItemInterface) => {
    dispatch(setCurrentItem(word.id));
    navigate(`/vocabulary-map/${word.category}/${word.id}`);
  }, [navigate, dispatch]);

  const hasNecessaryData = useMemo(() => {
    if (!category && !id) {
      // For the main vocabulary map page
      return Object.keys(groupedItems).length > 0;
    }
    return categoryLabels.length > 0 && (
      !category || (groupedItems[category] && groupedItems[category].length > 0)
    );
  }, [category, id, categoryLabels, groupedItems]);

  if (status === "loading" || !hasNecessaryData) {
    return <FullPageSpinner />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <VocabularyMapBoard
        groupedVocabulary={groupedItems}
        categoryLabels={categoryLabels}
        onCategorySelect={handleCategorySelect}
        onWordSelect={handleWordSelect}
        selectedCategory={category || null}
        selectedWord={currentItem}
      />
    </div>
  );
};