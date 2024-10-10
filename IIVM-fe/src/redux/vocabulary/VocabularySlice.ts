import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchVocabulary,
  fetchVocabularyByCategory,
  fetchVocabularyWithSpecificId,
  fetchSavedVocabularyOfUser,
  saveVocabularyForUser,
  removeSavedVocabularyForUser,
  saveVocabularyItem,
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
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchVocabulary.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (Array.isArray(action.payload)) {
        state.items = action.payload.reduce((acc, item) => {
          if (item && typeof item === 'object' && 'id' in item) {
            acc[item.id] = item as VocabularyItemInterface;
          }
          return acc;
        }, {} as { [id: string]: VocabularyItemInterface });
        state.groupedItems = groupByCategoryDescending(action.payload);
        state.categoryLabels = [...new Set(action.payload
          .map(item => (item as VocabularyItemInterface).category)
          .filter((category): category is string => typeof category === 'string' && category !== '')
        )];
      } else if (typeof action.payload === 'object' && action.payload !== null) {
        // If payload is an object, assume it's already in the correct format
        state.items = action.payload as { [id: string]: VocabularyItemInterface };
        state.groupedItems = groupByCategoryDescending(Object.values(state.items));
        state.categoryLabels = [...new Set(
          Object.values(state.items)
            .map(item => item.category)
            .filter((category): category is string => typeof category === 'string' && category !== '')
        )];
      } else {
        console.error('Received payload is in an unexpected format:', action.payload);
        state.error = 'Received invalid data format';
      }
    })
      .addCase(fetchVocabularyByCategory.fulfilled, (state, action) => {
        const category = action.meta.arg;
        action.payload.items.forEach((item) => {
          state.items[item.id] = item;
        });
        state.groupedItems[category] = action.payload.items;
        state.currentCategory = category;
        state.categoryLabels = action.payload.categories;
      })
      .addCase(fetchVocabularyWithSpecificId.fulfilled, (state, action) => {
        const item = action.payload.item;
        state.items[item.id] = item;
        state.currentItemId = item.id;
        if (action.payload.categoryItems.length > 0) {
          const category = item.category;
          state.groupedItems[category!] = action.payload.categoryItems;
          action.payload.categoryItems.forEach((categoryItem) => {
            state.items[categoryItem.id] = categoryItem;
          });
        }
        if (action.payload.categories.length > 0) {
          state.categoryLabels = action.payload.categories;
        }
      })
      .addCase(fetchSavedVocabularyOfUser.fulfilled, (state, action) => {
        state.savedVocabularyStatus = "succeeded";
        state.savedVocabularyIds = action.payload.map((item) => item.id);
        action.payload.forEach((item) => {
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
      });
  },
});

export const { setCurrentItem, resetCurrentItem, clearSavedVocabulary } =
  vocabularySlice.actions;

export const vocabularyReducer = vocabularySlice.reducer;
