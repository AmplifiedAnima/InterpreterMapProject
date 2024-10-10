import React, { useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/auth/authSlice";
import { refreshToken } from "../redux/auth/authThunks";

export const Root: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.authState.isLoggedIn
  );

  const refreshTokenIfNeeded = useCallback(async () => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      try {
        const action = await dispatch(refreshToken({ refresh: token }));
        if (refreshToken.fulfilled.match(action)) {
          console.log("Token refreshed successfully");
        } else {
          console.log("Token refresh failed, logging out");
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        dispatch(logout());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      refreshTokenIfNeeded();
    }
  }, [isAuthenticated, refreshTokenIfNeeded]);

  useEffect(() => {
    // Set up interval for token refresh
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        refreshTokenIfNeeded();
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(intervalId);
  }, [isAuthenticated, refreshTokenIfNeeded]);

  useEffect(() => {
    console.log("Root component mounted or updated");
  }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};