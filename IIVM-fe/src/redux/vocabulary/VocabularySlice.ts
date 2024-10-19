import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchVocabulary,
  fetchVocabularyByCategory,
  fetchVocabularyWithSpecificId,
  fetchSavedVocabularyOfUser,
  saveVocabularyForUser,
  removeSavedVocabularyForUser,
  saveVocabularyItem,
  fetchCategoryLabelsOnly,
} from "./vocabularyThunks";
import {
  GroupedVocabularyType,
  VocabularyItemInterface,
} from "../../interfaces/vocabulary.interface";
import { groupByCategoryDescending } from "../../utils/categoryGrouping";

interface VocabularyState {
  items: { [id: string]: VocabularyItemInterface };
  groupedItems: GroupedVocabularyType;
  categoryLabels: string[];
  currentCategory: string | null;
  currentItemId: string | null;
  savedVocabularyIds: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  savedVocabularyStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VocabularyState = {
  items: {},
  groupedItems: {},
  categoryLabels: [],
  currentCategory: null,
  currentItemId: null,
  savedVocabularyIds: [],
  status: "idle",
  savedVocabularyStatus: "idle",
  error: null,
};

const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState,
  reducers: {
    setCurrentItem(state, action: PayloadAction<string>) {
      state.currentItemId = action.payload;
    },
    resetCurrentItem(state) {
      state.currentItemId = null;
    },
    clearSavedVocabulary(state) {
      state.savedVocabularyIds = [];
    },
    clearVocabularyErrors(state) {
      state.error = null;
    },
    clearCategoryData: (state) => {
      state.groupedItems = {};
      state.currentCategory = null;
    },
    updateCategoryLabels: (state, action: PayloadAction<string[]>) => {
      const newLabels = action.payload.filter(
        (label) => !state.categoryLabels.includes(label)
      );
      state.categoryLabels = [...state.categoryLabels, ...newLabels];
    },
    updateVocabularyItem: (
      state,
      action: PayloadAction<VocabularyItemInterface>
    ) => {
      const updatedItem = action.payload;
      state.items[updatedItem.id] = updatedItem;
    },

    addApprovedNewWord: (
      state,
      action: PayloadAction<VocabularyItemInterface>
    ) => {
      const newItem = action.payload;
      // Add the new item to the state.items map
      state.items[newItem.id] = newItem;

      // If the new item has a category, group it accordingly
      if (newItem.category) {
        // Ensure the category exists in groupedItems
        if (!state.groupedItems[newItem.category]) {
          state.groupedItems[newItem.category] = [];
        }

        // Add the new item to the respective category group
        state.groupedItems[newItem.category].push(newItem);

        // Add the category to categoryLabels if it doesn't exist
        if (!state.categoryLabels.includes(newItem.category)) {
          state.categoryLabels.push(newItem.category);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVocabulary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVocabulary.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(action.payload)) {
          action.payload.forEach((item) => {
            state.items[item.id] = item;
          });
          state.groupedItems = groupByCategoryDescending(action.payload);
          const newLabels = [
            ...new Set(
              action.payload
                .map((item) => item.category)
                .filter((category): category is string => !!category)
            ),
          ];
          state.categoryLabels = [
            ...new Set([...state.categoryLabels, ...newLabels]),
          ];
        } else {
          state.error = "Received invalid data format";
        }
      })
      .addCase(fetchVocabulary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(fetchVocabularyByCategory.fulfilled, (state, action) => {
        const category = action.meta.arg;
        const items = action.payload.items;

        items.forEach((item) => {
          state.items[item.id] = item;
        });
        state.groupedItems[category] = items;
        state.currentCategory = category;

        const newCategories = action.payload.categories.filter(
          (c: string) => !state.categoryLabels.includes(c)
        );
        state.categoryLabels = [...state.categoryLabels, ...newCategories];
      })
      .addCase(fetchVocabularyWithSpecificId.fulfilled, (state, action) => {
        const item = action.payload.item;
        state.items[item.id] = item;
        state.currentItemId = item.id;

        if (action.payload.categoryItems.length > 0) {
          const category = item.category!;
          state.groupedItems[category] = action.payload.categoryItems;
          action.payload.categoryItems.forEach((catItem) => {
            state.items[catItem.id] = catItem;
          });
        }

        const newCategories = action.payload.categories.filter(
          (c: string) => !state.categoryLabels.includes(c)
        );
        state.categoryLabels = [...state.categoryLabels, ...newCategories];
      })
      .addCase(fetchSavedVocabularyOfUser.fulfilled, (state, action) => {
        state.savedVocabularyStatus = "succeeded";
        const items = action.payload;
        state.savedVocabularyIds = items.map((item) => item.id);
        items.forEach((item) => {
          state.items[item.id] = item;
        });
      })
      .addCase(saveVocabularyForUser.fulfilled, (state, action) => {
        state.savedVocabularyStatus = "succeeded";
        state.savedVocabularyIds = [
          ...new Set([...state.savedVocabularyIds, ...action.meta.arg]),
        ];
      })
      .addCase(removeSavedVocabularyForUser.fulfilled, (state, action) => {
        state.savedVocabularyStatus = "succeeded";
        state.savedVocabularyIds = state.savedVocabularyIds.filter(
          (id) => !action.meta.arg.includes(id)
        );
      })
      .addCase(saveVocabularyItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const newItem = action.payload;
        state.items[newItem.id] = newItem;

        if (newItem.category) {
          if (!state.groupedItems[newItem.category]) {
            state.groupedItems[newItem.category] = [];
          }
          state.groupedItems[newItem.category].push(newItem);
          if (!state.categoryLabels.includes(newItem.category)) {
            state.categoryLabels.push(newItem.category);
          }
        }
      })
      .addCase(fetchCategoryLabelsOnly.fulfilled, (state, action) => {
        state.categoryLabels = action.payload.categories;
      })
      .addCase(fetchCategoryLabelsOnly.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch category labels";
      });
  },
});

export const {
  setCurrentItem,
  resetCurrentItem,
  clearSavedVocabulary,
  clearVocabularyErrors,
  clearCategoryData,
  updateCategoryLabels,
  addApprovedNewWord,
  updateVocabularyItem
} = vocabularySlice.actions;

export const vocabularyReducer = vocabularySlice.reducer;
