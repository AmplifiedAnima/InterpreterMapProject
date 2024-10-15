import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Root } from "../Root.";
import { ErrorPage } from "../Error-page";
import { VocabularyLeixconRoute } from "../vocabulary-lexicon-route";
import  LandingPage  from "../LandingPage";
import { QuizPage } from "../quiz-page";
import { Header } from "../../components/Header";
import { GraphPage } from "../Graph-page";
import { ProfilePage } from "../profile-page";
import CreateUserProfilePage from "../create-user-profile-page";
import LoginUserPage from "../login-user-page";
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
        <ErrorPage />
      </>
    ),
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "vocabulary-map/:category?/:id?",
        element: <VocabularyLeixconRoute />,
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
        element: <QuizPage />,
      },
      { path: "suggestion-acquiesce", element: <SuggestionAcquiesceRoute /> },
      {
        path: "vocabulary-graph",
        element: <GraphPage />,
      },
      {
        path: "profile-page",
        element: <ProfilePage />,
      },
      {
        path: "create-user-profile",
        element: <CreateUserProfilePage />,
      },
      {
        path: "login-user",
        element: <LoginUserPage />,
      },
    ],
  },
]);
