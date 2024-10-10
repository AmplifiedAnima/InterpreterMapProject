import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/auth/authThunks";
import RegistrationForm from "../components/Forms/RegistrationForm";
import { RootState, AppDispatch } from "../redux/store";
import { UserRegistrationData } from "../redux/auth/authTypes";

const CreateUserProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isLoggedIn } = useSelector(
    (state: RootState) => state.authState
  );

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/login-user");
    }
  }, [status, isLoggedIn, navigate]);

  const handleSubmit = (data: UserRegistrationData) => {
    dispatch(registerUser(data));
  };

  return (
    <RegistrationForm onSubmit={handleSubmit} status={status} error={error} />
  );
};

export default CreateUserProfilePage;
