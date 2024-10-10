import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchVocabulary } from "../redux/vocabulary/vocabularyThunks";
import { AddWordComponent } from "../components/AddWordComponent/AddWordComponent";

export const AddWordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Change `data` to `items` if that’s how it’s defined in your slice
  const vocabularyItems = useSelector((state: RootState) => state.vocabulary.items);
  const categoryOfItems = useSelector((state: RootState) => state.vocabulary.categoryLabels);

  useEffect(() => {
    // Fetch vocabulary only if it's not already loaded
    if (Object.keys(vocabularyItems).length === 0) {
      dispatch(fetchVocabulary());
    }
  }, [dispatch, vocabularyItems]);

  return (
    <AddWordComponent
      vocabularyItems={vocabularyItems}
      categoryOfItems={categoryOfItems}
    />
  );
};
