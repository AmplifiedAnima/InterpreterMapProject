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

// Define the SuggestionState interface with separate fetching statuses
interface SuggestionState {
  existingWordSuggestions: ExistingWordSuggestion[];
  newWordSuggestions: NewWordSuggestion[];
  existingWordStatus: "idle" | "loading" | "succeeded" | "failed"; // Fetching status for existing word suggestions
  newWordStatus: "idle" | "loading" | "succeeded" | "failed"; // Fetching status for new word suggestions
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
  existingWordStatus: "idle", // Initialize fetching status for existing words
  newWordStatus: "idle", // Initialize fetching status for new words
  existingWordError: null,
  newWordError: null,
};

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    clearSuggestionErrors: (state) => {
      state.existingWordError = null; // Clear existing word error
      state.newWordError = null; // Clear new word error
    },
  },
  extraReducers: (builder) => {
    // Fetch Existing Word Suggestions
    builder
      .addCase(fetchSuggestionsForWord.pending, (state) => {
        state.existingWordStatus = "loading"; // Set loading status for existing words
        state.existingWordError = null; // Reset error on pending
      })
      .addCase(fetchSuggestionsForWord.fulfilled, (state, action) => {
        state.existingWordStatus = "succeeded"; // Set succeeded status for existing words
        state.existingWordSuggestions = action.payload; // Update existing word suggestions
        state.existingWordError = null; // Reset error on success
      })
      .addCase(fetchSuggestionsForWord.rejected, (state, action) => {
        state.existingWordStatus = "failed"; // Set failed status for existing words
        state.existingWordError = {
          message: action.payload as string,
          details: {},
        };
      })
      // Fetch All Suggestions
      .addCase(fetchAllSuggestions.pending, (state) => {
        state.newWordStatus = "loading"; // Set loading status for new words
        state.existingWordStatus = "loading"; // Set loading status for existing words
        state.newWordError = null; // Reset error for new words
        state.existingWordError = null; // Reset error for existing words
      })
      .addCase(fetchAllSuggestions.fulfilled, (state, action) => {
        state.newWordStatus = "succeeded"; // Set succeeded status for new words
        state.existingWordStatus = "succeeded"; // Set succeeded status for existing words
        state.existingWordSuggestions =
          action.payload.existing_word_suggestions; // Update existing word suggestions
        state.newWordSuggestions = action.payload.new_word_suggestions; // Update new word suggestions
        state.newWordError = null; // Reset error for new words
        state.existingWordError = null; // Reset error for existing words
      })
      .addCase(fetchAllSuggestions.rejected, (state, action) => {
        state.newWordStatus = "failed"; // Set failed status for new words
        state.existingWordStatus = "failed"; // Set failed status for existing words
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
        state.newWordError = null; // Reset error for new words
      })
      .addCase(submitNewWordSuggestion.fulfilled, (state, action) => {
        state.newWordSuggestions.push(action.payload); // Add new word suggestion
        state.newWordError = null; // Reset error for new words
      })
      .addCase(submitNewWordSuggestion.rejected, (state, action) => {
        if (typeof action.payload === "object" && action.payload !== null) {
          state.newWordError = {
            message: "Failed to suggest new word",
            details: action.payload as Partial<
              Record<keyof SuggestionData, string>
            >,
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
        state.existingWordError = null; // Reset error for existing words
      })
      .addCase(submitExistingWordSuggestionToBackend.fulfilled, (state,action) => {
        state.existingWordError = null; // Reset error on success
        state.existingWordSuggestions.push(action.payload); 
      })
      .addCase(
        submitExistingWordSuggestionToBackend.rejected,
        (state, action) => {
          if (typeof action.payload === "object" && action.payload !== null) {
            state.existingWordError = {
              message: "Failed to submit suggestion",
              details: action.payload as Partial<
                Record<keyof SuggestionData, string>
              >,
            };
          } else {
            state.existingWordError = {
              message: "An unknown error occurred",
              details: {},
            };
          }
        }
      )
      // Like Existing Word Suggestion
      .addCase(likeExistingWordSuggestion.fulfilled, (state, action) => {
        const suggestion = state.existingWordSuggestions.find(
          (s) => s.id === action.payload.id
        );
        if (suggestion) {
          suggestion.like_count = action.payload.like_count; // Update like count for existing word suggestion
        }
      })
      // Like New Word Suggestion
      .addCase(likeNewWordSuggestion.fulfilled, (state, action) => {
        const suggestion = state.newWordSuggestions.find(
          (s) => s.id === action.payload.id
        );
        if (suggestion) {
          suggestion.like_count = action.payload.like_count; // Update like count for new word suggestion
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
        state.newWordError = null; // Reset error for new words
        state.existingWordError = null; // Reset error for existing words
      })
      .addCase(rejectSuggestion.fulfilled, (state, action) => {
        const newIndex = state.newWordSuggestions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (newIndex !== -1) {
          state.newWordSuggestions[newIndex].status = "rejected"; // Reject new word suggestion
        } else {
          const existingIndex = state.existingWordSuggestions.findIndex(
            (s) => s.id === action.payload.id
          );
          if (existingIndex !== -1) {
            state.existingWordSuggestions[existingIndex].status = "rejected"; // Reject existing word suggestion
          }
        }
        state.newWordError = null; // Reset error for new words
        state.existingWordError = null; // Reset error for existing words
      })
      .addCase(rejectSuggestion.rejected, (state, action) => {
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
  state.suggestions.existingWordStatus; // Selector for existing word fetching status
export const selectNewWordStatus = (state: RootState) =>
  state.suggestions.newWordStatus; // Selector for new word fetching status
export const selectExistingWordError = (state: RootState) =>
  state.suggestions.existingWordError; // Selector for existing word error
export const selectNewWordError = (state: RootState) =>
  state.suggestions.newWordError; // Selector for new word error
export const selectExistingWordSuggestions = (state: RootState) =>
  state.suggestions.existingWordSuggestions; // Selector for existing word suggestions
export const selectNewWordSuggestions = (state: RootState) =>
  state.suggestions.newWordSuggestions; // Selector for new word suggestions
