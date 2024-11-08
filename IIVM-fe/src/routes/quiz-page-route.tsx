import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QuizComponent } from "../components/QuizComponent/QuizComponent";
import { AppDispatch, RootState } from "../redux/store";
import { fetchVocabulary, fetchSavedVocabularyOfUser } from "../redux/vocabulary/vocabularyThunks";
import FullPageSpinner from "../components/UI/FullPageSpinner";

export const QuizPageRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const savedVocabularyIds = useSelector((state: RootState) => state.vocabulary.savedVocabularyIds);
  const vocabularyItems = useSelector((state: RootState) => state.vocabulary.items);
  const vocabularyStatus = useSelector((state: RootState) => state.vocabulary.status);
  const savedVocabularyStatus = useSelector((state: RootState) => state.vocabulary.savedVocabularyStatus);

  const vocabularyFetchedRef = useRef(false);
  const savedVocabularyFetchedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (vocabularyStatus === "idle" && !vocabularyFetchedRef.current) {
        vocabularyFetchedRef.current = true;
        await dispatch(fetchVocabulary());
      }

      // Check if saved vocabulary has been fetched, and fetch it only if necessary
      if (savedVocabularyStatus === "idle" && savedVocabularyIds.length === 0) {
        savedVocabularyFetchedRef.current = true;
        await dispatch(fetchSavedVocabularyOfUser());
      }
    };

    fetchData();
  }, [dispatch, vocabularyStatus, savedVocabularyStatus, savedVocabularyIds]);

  const isLoading = vocabularyStatus === "loading" || savedVocabularyStatus === "loading";
  const hasFailed = vocabularyStatus === "failed" || savedVocabularyStatus === "failed";
  const isReady = vocabularyStatus === "succeeded" && savedVocabularyStatus === "succeeded";

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (hasFailed) {
    return <div>Error loading quiz data. Please try again later.</div>;
  }

  if (!isReady) {
    return <FullPageSpinner />;
  }

  return (
    <QuizComponent
      savedVocabularyIds={savedVocabularyIds}
      vocabularyItems={vocabularyItems}
    />
  );
};