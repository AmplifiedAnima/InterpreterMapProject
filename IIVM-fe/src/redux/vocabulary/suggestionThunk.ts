import { createAsyncThunk } from "@reduxjs/toolkit";
import { NewWordData } from "../../interfaces/wordSuggestionSchema";
import { AllSuggestionsResponse } from "../../interfaces/suggestion";
import { RootState } from "../store";
import { SuggestionData } from "../../interfaces/wordSuggestionSchema";
export const fetchSuggestionsForWord = createAsyncThunk(
  "vocabulary/fetchSuggestionsForWord",
  async (wordId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8000/get-suggestions-for-specific-word/${wordId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllSuggestions = createAsyncThunk<AllSuggestionsResponse>(
  "vocabulary/fetchAllSuggestionsForWord",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8000/get-suggestions-for-all-words/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data: AllSuggestionsResponse = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSuggestionToBackend = createAsyncThunk<
  SuggestionData,
  Omit<SuggestionData, "id">
>(
  "vocabulary/fetchSuggestionToBackend",

  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://localhost:8000/save-suggestion-for-specific-word/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        return rejectWithValue(responseData);
      }

      return responseData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);
export const suggestNewWord = createAsyncThunk(
  "vocabulary/suggestNewWord",
  async (newWordData: NewWordData, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/suggest-new-word/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newWordData),
      });

      if (!response.ok) {
        throw new Error("Failed to suggest new word");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const likeExistingWordSuggestion = createAsyncThunk(
  "vocabulary/likeExistingWordSuggestion",
  async (suggestionId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8000/like-vocabulary-suggestion/${suggestionId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like suggestion");
      }

      const data = await response.json();
      return { id: suggestionId, ...data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const likeNewWordSuggestion = createAsyncThunk(
  "vocabulary/likeNewWordSuggestion",
  async (suggestionId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8000/like-new-word-suggestion/${suggestionId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like suggestion");
      }

      const data = await response.json();
      return { id: suggestionId, ...data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const approveVocabularySuggestion = createAsyncThunk(
  "vocabulary/approveVocabularySuggestion",
  async (suggestionId: number, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const userRole = state.authState.profile?.user_type;

    if (userRole !== "overseer" && userRole !== "superuser") {
      return rejectWithValue("Unauthorized: Insufficient permissions");
    }

    try {
      const response = await fetch(
        `http://localhost:8000/approve-vocabulary-suggestion/${suggestionId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve suggestion");
      }

      const data = await response.json();
      return { id: suggestionId, ...data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const approveNewWordSuggestion = createAsyncThunk(
  "vocabulary/approveNewWordSuggestion",
  async (suggestionId: number, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const userRole = state.authState.profile?.user_type;

    if (userRole !== "overseer" && userRole !== "superuser") {
      return rejectWithValue("Unauthorized: Insufficient permissions");
    }

    try {
      const response = await fetch(
        `http://localhost:8000/approve-new-word-suggestion/${suggestionId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve new word suggestion");
      }

      const data = await response.json();
      return { id: suggestionId, ...data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const rejectSuggestion = createAsyncThunk(
  "vocabulary/rejectSuggestion",
  async (
    {
      suggestionId,
      suggestionType,
    }: { suggestionId: number; suggestionType: "new_word" | "vocabulary" },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8000/reject-suggestion/${suggestionId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ suggestion_type: suggestionType }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject suggestion");
      }

      const data = await response.json();
      return { id: suggestionId, ...data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
