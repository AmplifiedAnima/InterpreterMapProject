import axios from "axios";
import { store } from "./store";
import { refreshToken } from "./auth/authThunks";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  async (config) => {
    let accessToken = store.getState().authState.accessTokenState;
    const refreshTokenValue = localStorage.getItem("refreshToken"); // Zakładając, że refresh token jest przechowywany w localStorage

    if (!accessToken && refreshTokenValue) {
      try {
        const refreshAction = await store.dispatch(refreshToken({ refresh: refreshTokenValue }));
        if (refreshToken.fulfilled.match(refreshAction)) {
          accessToken = refreshAction.payload.access;
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    }

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;