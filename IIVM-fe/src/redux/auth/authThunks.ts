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
  { rejectValue: string }
>(
  "userAuth/registerUser",
  async (registrationData: UserRegistrationData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: registrationData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.non_field_errors &&
          Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors.join(", ")
            : "Registration failed. Please check your input.";

        return rejectWithValue(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

export const loginUser = createAsyncThunk<{
  access: string;
  refresh: string;
  profile: UserProfileData;
}, UserLoginData, { rejectValue: string }>(
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
        const errorMessage =
          response.status === 401
            ? "Unauthorized, check username and password"
            : "Login failed. Please check your input.";
        return rejectWithValue(errorMessage);
      }

      const data = await response.json();
      console.log(data);  // Log the entire response for debugging

      // Ensure that the expected fields are present in the response
      if (!data.access || !data.refresh) {
        return rejectWithValue("Missing access or refresh token");
      }

      return {
        access: data.access,
        refresh: data.refresh,
        profile: {
          username: data.username || "",  // Default to empty string if not provided
          email: data.email || "",  // Default to empty string if not provided
          savedVocabulary: data.savedVocabulary || [],  // Default to empty array if not provided
          user_type: data.user_type || "",  // Default to empty string if not provided
        },
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);


export const refreshToken = createAsyncThunk<
  { access: string },
  { refresh: string },
  { rejectValue: string }
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
      return rejectWithValue(errorMessage);
    }

    const data = await response.json();
    console.log(data);
    return { access: data.access };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An error occurred"
    );
  }
});
