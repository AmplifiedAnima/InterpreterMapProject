import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/auth/authSlice";
import { changePassword } from "../redux/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { ProfilePageComponent } from "../components/ProfilePage/ProfilePageComponent";
import { Toast } from "../components/UI/Toast";

export const ProfilePageRoute: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.authState);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.authState.profile);

  // Toast state management
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const resultAction = await dispatch(
      changePassword({ currentPassword, newPassword })
    );

    if (changePassword.fulfilled.match(resultAction)) {
      // Show success toast
      setToast({ message: "Password changed successfully!", type: "success" });
    } else {
      // Show error toast
      setToast({ message: resultAction.error.message!, type: "error" });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

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

  return (
    <>
      <ProfilePageComponent
        data={data!}
        onLogout={handleLogout}
        onChangePassword={handleChangePassword}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};
