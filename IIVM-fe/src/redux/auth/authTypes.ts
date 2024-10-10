import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  user_type: 'interpreter' | 'overseer' | 'superuser';  // Add this line
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserProfileData {
  username: string;
  email: string;
  savedVocabulary: VocabularyItemInterface[] | [];
  user_type: 'interpreter' | 'overseer' | 'superuser';  // Add this line
}

export interface AuthState {
  profile: UserProfileData | null;
  accessTokenState: string | null;
  refreshedTokenState: string | null;
  isLoggedIn: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}