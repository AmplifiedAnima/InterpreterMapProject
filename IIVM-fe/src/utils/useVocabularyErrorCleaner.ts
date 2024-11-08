// useAuthErrorCleaner.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearVocabularyErrors } from "../redux/vocabulary/VocabularySlice";

export const useVocabularyErrorCleaner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearVocabularyErrors());
    };
  }, [dispatch]);
};
