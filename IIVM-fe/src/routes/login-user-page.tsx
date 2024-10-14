import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/authThunks";
import { UserLoginData } from "../redux/auth/authTypes";
import { RootState, AppDispatch } from "../redux/store";
import LoginForm from "../components/Forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { Toast } from "../components/UI/Toast";

const LoginUserPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { status, error, isLoggedIn } = useSelector(
    (state: RootState) => state.authState
  );
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Handle form submission
  const handleLogin = async (loginData: UserLoginData) => {
    const resultAction = await dispatch(loginUser(loginData));
    if (loginUser.fulfilled.match(resultAction)) {
      console.log("Login successful:", resultAction.payload);
      setToastMessage("Login successful!");
      setToastType('success');
    } else {
      console.error("Login failed:", resultAction.payload);
      setToastMessage(error || "Login failed. Please try again.");
      setToastType('error');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  return (
    <>
      <LoginForm onSubmit={handleLogin} status={status} error={error} />
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

export default LoginUserPage;