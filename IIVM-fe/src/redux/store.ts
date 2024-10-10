import { configureStore } from "@reduxjs/toolkit";
import { languageReducer } from "./languageSlice";
// import { vocabulary } from "../mockData/mockData";
import {

  vocabularyReducer,
} from "./vocabulary/VocabularySlice";
import { authSliceReducer } from "./auth/authSlice";
import { suggestionsReducer } from "./vocabulary/SuggestionSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    vocabulary: vocabularyReducer,
    authState: authSliceReducer,
    suggestions: suggestionsReducer                        
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
