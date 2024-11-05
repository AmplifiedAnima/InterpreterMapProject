// CreateUserProfilePage.tsx
import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/auth/authThunks";
import { UserRegistrationData } from "../redux/auth/authTypes";
import { RootState, AppDispatch } from "../redux/store";
import RegistrationForm from "../components/Forms/RegistrationForm";
import { useNavigate } from "react-router-dom";
import { Toast } from "../components/UI/Toast";

import { useAuthErrorCleaner } from "../utils/useAuthErrorCleaner";
const CreateUserProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { status, error } = useSelector((state: RootState) => state.authState);
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useAuthErrorCleaner();

  const handleRegister = async (
    formData: Omit<UserRegistrationData, "user_type">
  ) => {
    const registrationData: UserRegistrationData = {
      ...formData,
      user_type: "interpreter",
    };

    const resultAction = await dispatch(registerUser(registrationData));
    if (registerUser.fulfilled.match(resultAction)) {
      console.log("Registration successful:", resultAction.payload);
      setToastMessage("Registration successful! Please log in.");
      setToastType("success");
      // Navigate to login page after a short delay
      setTimeout(() => navigate("/login-user"), 2000);
    } else {
      console.error("Registration failed:", resultAction.payload);
      if (
        resultAction.payload &&
        typeof resultAction.payload === "object" &&
        "error" in resultAction.payload
      ) {
        setToastMessage(resultAction.payload.error);
      } else {
        setToastMessage("Registration failed. Please try again.");
      }
      setToastType("error");
    }
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  return (
    <>
      <RegistrationForm
        onSubmit={handleRegister}
        status={status}
        error={error || null}
      />
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default CreateUserProfilePage;
