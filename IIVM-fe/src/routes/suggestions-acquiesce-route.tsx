import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { SuggestionsAcquiesceComponent } from "../components/suggestionsView/SuggestionsAcquiesceComponent";
import { AppDispatch, RootState } from "../redux/store";
import {
  fetchAllSuggestions,
  likeExistingWordSuggestion,
  likeNewWordSuggestion,
  approveVocabularySuggestion,
  approveNewWordSuggestion,
  rejectSuggestion,
} from "../redux/vocabulary/suggestionThunk";
import { fetchVocabulary } from "../redux/vocabulary/vocabularyThunks";
import FullPageSpinner from "../components/UI/FullPageSpinner";


export const SuggestionAcquiesceRoute: React.FC = () => {
  const suggestionsStatusRef = useRef("idle");
  const vocabularyStatusRef = useRef("idle");
  const dispatch = useDispatch<AppDispatch>();
  const {
    existingWordSuggestions,
    newWordSuggestions,
    status: suggestionsStatus,
  } = useSelector((state: RootState) => state.suggestions);
  const { items: vocabularyItems, status: vocabularyStatus } = useSelector(
    (state: RootState) => state.vocabulary
  );
  const isLoggedIn = useSelector((state: RootState) => state.authState.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.authState.profile?.user_type);

  const canApprove = userRole === "overseer" || userRole === "superuser";

  useEffect(() => {
    suggestionsStatusRef.current = suggestionsStatus;
    vocabularyStatusRef.current = vocabularyStatus;
  }, [suggestionsStatus, vocabularyStatus]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        if (suggestionsStatusRef.current === "idle") {
          await dispatch(fetchAllSuggestions());
        }
        if (vocabularyStatusRef.current === "idle") {
          await dispatch(fetchVocabulary());
        }
      }
    };

    fetchData();
  }, [dispatch, isLoggedIn]);

  const handleLikeExisting = useCallback((id: number) => {
    dispatch(likeExistingWordSuggestion(id));
  }, [dispatch]);

  const handleLikeNew = useCallback((id: number) => {
    dispatch(likeNewWordSuggestion(id));
  }, [dispatch]);

  const handleApproveExisting = useCallback(async (id: number) => {
    try {
      await dispatch(approveVocabularySuggestion(id)).unwrap();
      // Show success toast
    } catch (error) {
      console.error(error);
      // Show error toast
    }
  }, [dispatch]);

  const handleApproveNew = useCallback(async (id: number) => {
    try {
      await dispatch(approveNewWordSuggestion(id)).unwrap();
      // Show success toast
    } catch (error) {
      console.error(error);
      // Show error toast
    }
  }, [dispatch]);

  const handleRejectExisting = useCallback(async (id: number) => {
    try {
      await dispatch(rejectSuggestion({ suggestionId: id, suggestionType: 'vocabulary' })).unwrap();
      // Show success toast
    } catch (error) {
      console.error(error);
      // Show error toast
    }
  }, [dispatch]);

  const handleRejectNew = useCallback(async (id: number) => {
    try {
      await dispatch(rejectSuggestion({ suggestionId: id, suggestionType: 'new_word' })).unwrap();
      // Show success toast
    } catch (error) {
      console.error(error);
      // Show error toast
    }
  }, [dispatch]);

  const isLoading = suggestionsStatus === "loading" || vocabularyStatus === "loading";
  const hasFailed = suggestionsStatus === "failed" || vocabularyStatus === "failed";
  const isReady = suggestionsStatus === "succeeded" && vocabularyStatus === "succeeded" && Object.keys(vocabularyItems).length > 0;

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (hasFailed) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (!isReady) {
    return <FullPageSpinner />;
  }

  const vocabularyItemsArray = Object.values(vocabularyItems);

  if (!isLoggedIn) {
    return <Navigate to="/login-user" replace />;
  }

  return (
    <SuggestionsAcquiesceComponent
      existingWordSuggestions={existingWordSuggestions}
      newWordSuggestions={newWordSuggestions}
      vocabularyItems={vocabularyItemsArray}
      canApprove={canApprove}
      onLikeExisting={handleLikeExisting}
      onApproveExisting={handleApproveExisting}
      onRejectExisting={handleRejectExisting}
      onLikeNew={handleLikeNew}
      onApproveNew={handleApproveNew}
      onRejectNew={handleRejectNew}
    />
  );
};