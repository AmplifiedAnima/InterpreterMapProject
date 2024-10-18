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
} from "../redux/suggestion/suggestionThunk";
import { fetchVocabulary } from "../redux/vocabulary/vocabularyThunks";
import FullPageSpinner from "../components/UI/FullPageSpinner";

export const SuggestionAcquiesceRoute: React.FC = () => {
  const suggestionsStatusRef = useRef("idle");
  const vocabularyStatusRef = useRef("idle");
  const dispatch = useDispatch<AppDispatch>();

  const {
    existingWordSuggestions,
    newWordSuggestions,
    existingWordStatus,
    newWordStatus,
  } = useSelector((state: RootState) => state.suggestions);

  const { items: vocabularyItems, status: vocabularyStatus } = useSelector(
    (state: RootState) => state.vocabulary
  );

  const isLoggedIn = useSelector((state: RootState) => state.authState.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.authState.profile?.user_type);

  const canApprove = userRole === "overseer" || userRole === "superuser";

  useEffect(() => {
    suggestionsStatusRef.current = existingWordStatus; // Updated fetching status for existing words
    vocabularyStatusRef.current = vocabularyStatus; // Updated fetching status for vocabulary
  }, [existingWordStatus, vocabularyStatus]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        // Fetch only if statuses are idle
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
      // Optionally show success toast here
    } catch (error) {
      console.error(error);
      // Optionally show error toast here
    }
  }, [dispatch]);

  const handleApproveNew = useCallback(async (id: number) => {
    try {
      await dispatch(approveNewWordSuggestion(id)).unwrap();
      // Optionally show success toast here
    } catch (error) {
      console.error(error);
      // Optionally show error toast here
    }
  }, [dispatch]);

  const handleRejectExisting = useCallback(async (id: number) => {
    try {
      await dispatch(rejectSuggestion({ suggestionId: id, suggestionType: 'vocabulary' })).unwrap();
      // Optionally show success toast here
    } catch (error) {
      console.error(error);
      // Optionally show error toast here
    }
  }, [dispatch]);

  const handleRejectNew = useCallback(async (id: number) => {
    try {
      await dispatch(rejectSuggestion({ suggestionId: id, suggestionType: 'new_word' })).unwrap();
      // Optionally show success toast here
    } catch (error) {
      console.error(error);
      // Optionally show error toast here
    }
  }, [dispatch]);

  // Loading and failure states
  const isLoading = existingWordStatus === "loading" || newWordStatus === "loading" || vocabularyStatus === "loading";
  const hasFailed = existingWordStatus === "failed" || newWordStatus === "failed" || vocabularyStatus === "failed";
  const isReady = existingWordStatus === "succeeded" && newWordStatus === "succeeded" && vocabularyStatus === "succeeded" && Object.keys(vocabularyItems).length > 0;

  // Handle loading and error states
  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (hasFailed) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (!isReady) {
    return <FullPageSpinner />;
  }

  // Convert vocabulary items into an array for rendering
  const vocabularyItemsArray = Object.values(vocabularyItems);

  // Redirect if not logged in
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
