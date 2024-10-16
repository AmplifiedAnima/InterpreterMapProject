import { createAsyncThunk } from "@reduxjs/toolkit";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { RootState } from "../store";

interface CategoryLabelsResponse {
  categories: string[];
}

export const fetchVocabulary = createAsyncThunk<
  VocabularyItemInterface[],
  undefined,
  { state: RootState }
>("vocabulary/fetchData", async (_, { getState }) => {
  const state = getState();
  if (Object.keys(state.vocabulary.items).length > 0) {
    return Object.values(state.vocabulary.items); // Return cached data if available
  }

  const url = "http://127.0.0.1:8000/vocabulary-items/";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();

  if (typeof data === "object" && !Array.isArray(data) && data !== null) {
    // If data is an object, assume it's in the format { [id: string]: VocabularyItemInterface }
    return Object.values(data);
  } else if (Array.isArray(data)) {
    return data;
  } else {
    throw new Error("Received data is in an unexpected format");
  }
});

export const fetchVocabularyByCategory = createAsyncThunk<
  { items: VocabularyItemInterface[]; categories: string[] },
  string,
  { state: RootState }
>("vocabulary/fetchByCategory", async (category, { getState }) => {
  const state = getState();
  if (
    state.vocabulary.groupedItems[category] &&
    state.vocabulary.categoryLabels.length > 0
  ) {
    return {
      items: state.vocabulary.groupedItems[category],
      categories: state.vocabulary.categoryLabels,
    };
  }

  const response = await fetch(
    `http://127.0.0.1:8000/vocabulary-items/category/${category}/`
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return await response.json();
});

export const fetchCategoryLabelsOnly = createAsyncThunk<
  CategoryLabelsResponse,
  void,
  { state: RootState }
>("vocabulary/fetchCategoryLabelsOnly", async (_, { getState }) => {
  const state = getState();

  // Check if we already have category labels in the state
  if (state.vocabulary.categoryLabels.length > 0) {
    return {
      categories: state.vocabulary.categoryLabels,
    };
  }

  // If not, fetch from the API
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/vocabulary-items/category/all-category-labels`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoryLabelsResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
});
export const saveVocabularyItem = createAsyncThunk<
  VocabularyItemInterface,
  Omit<VocabularyItemInterface, "id">
>("vocabulary/saveVocabularyItem", async (formData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      "http://localhost:8000/save-vocabulary-item/",
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
});

export const fetchSuggestions = createAsyncThunk(
  "vocabulary/fetchSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:8000/all-suggestion-to-word/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchVocabularyWithSpecificId = createAsyncThunk<
  {
    item: VocabularyItemInterface;
    categoryItems: VocabularyItemInterface[];
    categories: string[];
  },
  string
>("vocabularyItemWithSpecificId", async (id) => {
  const url = `http://127.0.0.1:8000/vocabulary-items/${id}/`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
});
export const fetchSavedVocabularyOfUser = createAsyncThunk<
  VocabularyItemInterface[],
  void,
  { state: RootState }
>("savedVocabularyOfUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    const url = "http://127.0.0.1:8000/saved-vocabulary-user/";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const saveVocabularyForUser = createAsyncThunk<
  void,
  string[],
  { state: RootState }
>("saveVocabularyForUser", async (vocabularyIds, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    const url = "http://127.0.0.1:8000/save-vocabulary-items-user/";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vocabulary_ids: vocabularyIds }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    await response.json();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});

export const removeSavedVocabularyForUser = createAsyncThunk<
  void,
  string[],
  { state: RootState }
>(
  "removeSavedVocabularyForUser",
  async (vocabularyIds, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = "http://127.0.0.1:8000/remove-saved-vocabulary-user/";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vocabulary_ids: vocabularyIds }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);
