import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ProfilePageComponent } from "../components/ProfilePage/ProfilePageComponent";

export const ProfilePageRoute: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.authState);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const data = useSelector((state: RootState) => state.authState.profile);
  const language = useSelector((state: RootState) => state.language.language);
  const savedVocabularyIds = useSelector(
    (state: RootState) => state.vocabulary.savedVocabularyIds
  );
  const vocabularyItems = useSelector(
    (state: RootState) => state.vocabulary.items
  );

  const savedVocabulary = savedVocabularyIds.map((id) => vocabularyItems[id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Oops! You shouldn't be here.
          </h1>
          <p className="text-gray-600 mb-4">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <ProfilePageComponent data={data!} onLogout={handleLogout} />;
};
