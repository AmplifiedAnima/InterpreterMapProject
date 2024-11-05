import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Root } from "../Root.";
import { ErrorPageRoute } from "../error-page-route";
import { VocabularyLexiconRoute } from "../vocabulary-lexicon-route";
import LandingPageRoute from "../landing-page-route";
import { QuizPageRoute } from "../quiz-page-route";
import { Header } from "../../components/Header";

import { ProfilePageRoute } from "../profile-page-route";
import CreateUserProfilePage from "../create-user-profile-page";
import LoginUserRoute from "../login-user-route";
import { AddNewWordRoute } from "../add-new-word-route";
import { SuggestionAcquiesceRoute } from "../suggestions-acquiesce-route";
import { AddSuggestionRoute } from "../add-new-suggestion-to-word-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <>
        <Header />
        <ErrorPageRoute />
      </>
    ),
    children: [
      {
        index: true,
        element: <LandingPageRoute />,
      },
      {
        path: "vocabulary-map/:category?/:id?",
        element: <VocabularyLexiconRoute/>,
      },
      {
        path: "add-word-page",
        element: <AddNewWordRoute />,
      },
      {
        path: "add-new-suggestion-to-word",
        element: <AddSuggestionRoute />,
      },
      {
        path: "quiz-page",
        element: <QuizPageRoute />,
      },
      { path: "suggestion-acquiesce", element: <SuggestionAcquiesceRoute /> },

      {
        path: "profile-page",
        element: <ProfilePageRoute />,
      },
      {
        path: "create-user-profile",
        element: <CreateUserProfilePage />,
      },
      {
        path: "login-user",
        element: <LoginUserRoute />,
      },
    ],
  },
]);
