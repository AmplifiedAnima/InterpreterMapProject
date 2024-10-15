import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserLoginData, UserRegistrationData } from "./authTypes";
import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
import { UserProfileData } from "./authTypes";
export const registerUser = createAsyncThunk<
  {
    access: string;
    refresh: string;
    username: string;
    email: string;
    savedVocabulary: VocabularyItemInterface[];
  },
  UserRegistrationData,
  { rejectValue: { error: string; details: Record<string, string[]> } }
>(
  "userAuth/registerUser",
  async (registrationData: UserRegistrationData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({
        error: "An error occurred",
        details: { non_field_errors: [error instanceof Error ? error.message : "Unknown error"] }
      });
    }
  }
);
export const loginUser = createAsyncThunk<
  {
    access: string;
    refresh: string;
    profile: UserProfileData;
  },
  UserLoginData,
  { rejectValue: { error: string; details: Record<string, string[]> } }
>(
  "userAuth/loginUser",
  async (loginData: UserLoginData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({
          error: "Login failed",
          details: errorData.details || { non_field_errors: ["An error occurred"] }
        });
      }

      const data = await response.json();

      if (!data.access || !data.refresh) {
        return rejectWithValue({
          error: "Missing access or refresh token",
          details: { non_field_errors: ["Missing access or refresh token"] }
        });
      }

      return {
        access: data.access,
        refresh: data.refresh,
        profile: {
          username: data.username || "",
          email: data.email || "",
          savedVocabulary: data.savedVocabulary || [],
          user_type: data.user_type || "",
        },
      };
    } catch (error) {
      return rejectWithValue({
        error: "An unexpected error occurred",
        details: { non_field_errors: [error instanceof Error ? error.message : "Unknown error"] }
      });
    }
  }
);
export const refreshToken = createAsyncThunk<
  { access: string },
  { refresh: string },
  { rejectValue: { error: string; details: Record<string, string[]> } }
>("userAuth/refreshToken", async ({ refresh }, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:8000/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      const errorMessage =
        response.status === 401
          ? "Refresh token expired or invalid."
          : "Token refresh failed.";
      return rejectWithValue({
        error: errorMessage,
        details: { non_field_errors: [errorMessage] }
      });
    }

    const data = await response.json();
    console.log(data);
    return { access: data.access };
  } catch (error) {
    return rejectWithValue({
      error: "An unexpected error occurred",
      details: { non_field_errors: [error instanceof Error ? error.message : "An error occurred"] }
    });
  }
});