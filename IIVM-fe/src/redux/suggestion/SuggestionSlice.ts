import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllSuggestions,
  fetchSuggestionsForWord,
  submitExistingWordSuggestionToBackend,
  submitNewWordSuggestion,
  likeExistingWordSuggestion,
  likeNewWordSuggestion,
  approveVocabularySuggestion,
  approveNewWordSuggestion,
  rejectSuggestion,
} from "./suggestionThunk";
import {
  ExistingWordSuggestion,
  NewWordSuggestion,
} from "../../interfaces/suggestion";
import { RootState } from "../store";
import { SuggestionData } from "../../interfaces/wordSuggestionSchema";

// Define the SuggestionState interface with separate statuses and errors
interface SuggestionState {
  existingWordSuggestions: ExistingWordSuggestion[];
  newWordSuggestions: NewWordSuggestion[];
  existingWordStatus: "idle" | "loading" | "succeeded" | "failed";
  newWordStatus: "idle" | "loading" | "succeeded" | "failed";
  existingWordError: {
    message: string;
    details: Partial<Record<keyof SuggestionData, string>>;
  } | null;
  newWordError: {
    message: string;
    details: Partial<Record<keyof SuggestionData, string>>;
  } | null;
}

// Initialize the state with separate properties for existing and new word suggestions
const initialState: SuggestionState = {
  existingWordSuggestions: [],
  newWordSuggestions: [],
  existingWordStatus: "idle",
  newWordStatus: "idle",
  existingWordError: null,
  newWordError: null,
};

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    clearSuggestionErrors: (state) => {
      state.existingWordError = null;
      state.newWordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Existing Word Suggestions
      .addCase(fetchSuggestionsForWord.pending, (state) => {
        state.existingWordStatus = "loading";
        state.existingWordError = null;
      })
      .addCase(fetchSuggestionsForWord.fulfilled, (state, action) => {
        state.existingWordStatus = "succeeded";
        state.existingWordSuggestions = action.payload;
        state.existingWordError = null;
      })
      .addCase(fetchSuggestionsForWord.rejected, (state, action) => {
        state.existingWordStatus = "failed";
        state.existingWordError = {
          message: action.payload as string,
          details: {},
        };
      })
      // Fetch All Suggestions
      .addCase(fetchAllSuggestions.pending, (state) => {
        state.newWordStatus = "loading";
        state.existingWordStatus = "loading";
        state.newWordError = null;
        state.existingWordError = null;
      })
      .addCase(fetchAllSuggestions.fulfilled, (state, action) => {
        state.newWordStatus = "succeeded";
        state.existingWordStatus = "succeeded";
        state.existingWordSuggestions = action.payload.existing_word_suggestions;
        state.newWordSuggestions = action.payload.new_word_suggestions;
        state.newWordError = null;
        state.existingWordError = null;
      })
      .addCase(fetchAllSuggestions.rejected, (state, action) => {
        state.newWordStatus = "failed";
        state.existingWordStatus = "failed";
        state.newWordError = {
          message: action.payload as string,
          details: {},
        };
        state.existingWordError = {
          message: action.payload as string,
          details: {},
        };
      })
      // Submit New Word Suggestion
      .addCase(submitNewWordSuggestion.pending, (state) => {
        state.newWordStatus = "loading";
        state.newWordError = null;
      })
      .addCase(submitNewWordSuggestion.fulfilled, (state, action) => {
        state.newWordStatus = "succeeded";
        state.newWordSuggestions.push(action.payload);
        state.newWordError = null;
      })
      .addCase(submitNewWordSuggestion.rejected, (state, action) => {
        state.newWordStatus = "failed";
        if (typeof action.payload === "object" && action.payload !== null) {
          state.newWordError = {
            message: "Failed to suggest new word",
            details: action.payload as Partial<Record<keyof SuggestionData, string>>,
          };
        } else {
          state.newWordError = {
            message: action.payload as string,
            details: {},
          };
        }
      })
      // Submit Existing Word Suggestion
      .addCase(submitExistingWordSuggestionToBackend.pending, (state) => {
        state.existingWordStatus = "loading";
        state.existingWordError = null;
      })
      .addCase(submitExistingWordSuggestionToBackend.fulfilled, (state) => {
        state.existingWordStatus = "succeeded";
        state.existingWordError = null;
      })
      .addCase(submitExistingWordSuggestionToBackend.rejected, (state, action) => {
        state.existingWordStatus = "failed";
        if (typeof action.payload === "object" && action.payload !== null) {
          state.existingWordError = {
            message: "Failed to submit suggestion",
            details: action.payload as Partial<Record<keyof SuggestionData, string>>,
          };
        } else {
          state.existingWordError = {
            message: "An unknown error occurred",
            details: {},
          };
        }
      })
      // Like Existing Word Suggestion
      .addCase(likeExistingWordSuggestion.fulfilled, (state, action) => {
        const suggestion = state.existingWordSuggestions.find(
          (s) => s.id === action.payload.id
        );
        if (suggestion) {
          suggestion.like_count = action.payload.like_count;
        }
      })
      // Like New Word Suggestion
      .addCase(likeNewWordSuggestion.fulfilled, (state, action) => {
        const suggestion = state.newWordSuggestions.find(
          (s) => s.id === action.payload.id
        );
        if (suggestion) {
          suggestion.like_count = action.payload.like_count;
        }
      })
      // Approve Vocabulary Suggestion
      .addCase(approveVocabularySuggestion.fulfilled, (state, action) => {
        const index = state.existingWordSuggestions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.existingWordSuggestions[index].status = "approved";
        }
      })
      // Approve New Word Suggestion
      .addCase(approveNewWordSuggestion.fulfilled, (state, action) => {
        const index = state.newWordSuggestions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.newWordSuggestions[index].status = "approved";
        }
      })
      // Reject Suggestion
      .addCase(rejectSuggestion.pending, (state) => {
        state.newWordStatus = "loading";
        state.existingWordStatus = "loading";
        state.newWordError = null;
        state.existingWordError = null;
      })
      .addCase(rejectSuggestion.fulfilled, (state, action) => {
        state.newWordStatus = "succeeded";
        state.existingWordStatus = "succeeded";
        const newIndex = state.newWordSuggestions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (newIndex !== -1) {
          state.newWordSuggestions[newIndex].status = "rejected";
        } else {
          const existingIndex = state.existingWordSuggestions.findIndex(
            (s) => s.id === action.payload.id
          );
          if (existingIndex !== -1) {
            state.existingWordSuggestions[existingIndex].status = "rejected";
          }
        }
        state.newWordError = null;
        state.existingWordError = null;
      })
      .addCase(rejectSuggestion.rejected, (state, action) => {
        state.newWordStatus = "failed";
        state.existingWordStatus = "failed";
        state.newWordError = {
          message: action.payload as string,
          details: {},
        };
        state.existingWordError = {
          message: action.payload as string,
          details: {},
        };
      });
  },
});

export const { clearSuggestionErrors } = suggestionSlice.actions;
export const suggestionsReducer = suggestionSlice.reducer;

// Selectors
export const selectExistingWordStatus = (state: RootState) =>
  state.suggestions.existingWordStatus;
export const selectNewWordStatus = (state: RootState) =>
  state.suggestions.newWordStatus;
export const selectExistingWordError = (state: RootState) =>
  state.suggestions.existingWordError;
export const selectNewWordError = (state: RootState) =>
  state.suggestions.newWordError;
export const selectExistingWordSuggestions = (state: RootState) =>
  state.suggestions.existingWordSuggestions;
export const selectNewWordSuggestions = (state: RootState) =>
  state.suggestions.newWordSuggestions;
