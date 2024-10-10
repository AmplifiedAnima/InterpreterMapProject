import { createSlice } from '@reduxjs/toolkit';

interface LanguageState {
  language: string;
}

const initialState: LanguageState = {
  language: 'pl',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;