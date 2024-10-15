// useAuthErrorCleaner.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAuthErrors } from "../redux/auth/authSlice";

export const useAuthErrorCleaner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearAuthErrors());
    };
  }, [dispatch]);
};