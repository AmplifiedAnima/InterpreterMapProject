import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllSuggestions,
  fetchSuggestionsForWord,
  suggestNewWord,
  likeExistingWordSuggestion,
  likeNewWordSuggestion,
  approveVocabularySuggestion,
  approveNewWordSuggestion,
} from "./suggestionThunk";
import {
  ExistingWordSuggestion,
  NewWordSuggestion,
} from "../../interfaces/suggestion";

interface SuggestionState {
  existingWordSuggestions: ExistingWordSuggestion[];
  newWordSuggestions: NewWordSuggestion[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SuggestionState = {
  existingWordSuggestions: [],
  newWordSuggestions: [],
  status: "idle",
  error: null,
};

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestionsForWord.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSuggestionsForWord.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.existingWordSuggestions = action.payload;
        state.error = null;
      })
      .addCase(fetchSuggestionsForWord.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchAllSuggestions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllSuggestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.existingWordSuggestions =
          action.payload.existing_word_suggestions;
        state.newWordSuggestions = action.payload.new_word_suggestions;
        state.error = null;
      })
      .addCase(fetchAllSuggestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(suggestNewWord.pending, (state) => {
        state.status = "loading";
      })
      .addCase(suggestNewWord.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newWordSuggestions.push(action.payload);
        state.error = null;
      })
      .addCase(suggestNewWord.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(likeExistingWordSuggestion.fulfilled, (state, action) => {
        const suggestion = state.existingWordSuggestions.find(
          (s) => s.id === action.payload.id
        );
        if (suggestion) {
          suggestion.like_count = action.payload.like_count;
        }
      })
      .addCase(likeNewWordSuggestion.fulfilled, (state, action) => {
        const suggestion = state.newWordSuggestions.find(
          (s) => s.id === action.payload.id
        );
        if (suggestion) {
          suggestion.like_count = action.payload.like_count;
        }
      })
      .addCase(approveVocabularySuggestion.fulfilled, (state, action) => {
        const index = state.existingWordSuggestions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.existingWordSuggestions[index].status = "approved";
        }
      })
      .addCase(approveNewWordSuggestion.fulfilled, (state, action) => {
        const index = state.newWordSuggestions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.newWordSuggestions[index].status = "approved";
        }
      });
  },
});

export const suggestionsReducer = suggestionSlice.reducer;
