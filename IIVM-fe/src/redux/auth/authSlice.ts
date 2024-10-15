import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserProfileData } from "./authTypes";
import { loginUser, refreshToken, registerUser } from "./authThunks";

const initialState: AuthState = {
  profile: null,
  accessTokenState: null,
  refreshedTokenState: null,
  isLoggedIn: false,
  status: "idle",
  error: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    clearAuthErrors: (state) => {
      state.error = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessTokenState = action.payload.accessToken;
      state.refreshedTokenState = action.payload.refreshToken;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<UserProfileData>) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.profile = null;
      state.accessTokenState = null;
      state.refreshedTokenState = null;
      state.isLoggedIn = false;
      state.status = "idle";
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("user_type");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.accessTokenState = null;
        state.refreshedTokenState = null;
        state.profile = null;
        state.isLoggedIn = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = {
            error: "An unknown error occurred",
            details: {},
          };
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.profile; // Ensure profile includes user_type
        state.accessTokenState = action.payload.access;
        state.refreshedTokenState = action.payload.refresh;
        state.isLoggedIn = true;

        localStorage.setItem("accessToken", action.payload.access);
        localStorage.setItem("refreshToken", action.payload.refresh);
        localStorage.setItem("username", action.payload.profile.username);
        localStorage.setItem("email", action.payload.profile.email);
        localStorage.setItem("user_type", action.payload.profile.user_type); // Store the user_type
        console.log(state.profile, "user profile"); // Check that user_type is included in the profile
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = {
            error: "An unknown error occurred",
            details: { non_field_errors: ["An unknown error occurred"] },
          };
        }
        state.isLoggedIn = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessTokenState = action.payload.access;
        state.status = "succeeded";
        state.error = null;

        localStorage.setItem("accessToken", action.payload.access);

        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const user_type = localStorage.getItem(
          "user_type"
        ) as UserProfileData["user_type"];

        if (!state.isLoggedIn && username && email && user_type) {
          state.isLoggedIn = true;
          state.profile = {
            username,
            email,
            user_type,
            savedVocabulary: [],
          };
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "failed";
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = {
            error: "An unknown error occurred during token refresh",
            details: { non_field_errors: ["An unknown error occurred"] },
          };
        }
        state.profile = null;
        state.accessTokenState = null;
        state.refreshedTokenState = null;
        state.isLoggedIn = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("user_type");
      });
  },
});

export const {
  logout,
  setTokens,
  setLoggedIn,
  setUserProfile,
  clearAuthErrors,
} = userAuthSlice.actions;
export const authSliceReducer = userAuthSlice.reducer;
