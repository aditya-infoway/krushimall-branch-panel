import { Capacitor } from "@capacitor/core";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axios";

const storage = Capacitor.isNativePlatform() ? localStorage : sessionStorage;

const isTokenValid = (authToken: string): boolean => {
  try {
    const decoded: { exp?: number } = jwtDecode(authToken);
    if (!decoded.exp) {
      console.error("Token does not contain an expiration time.");
      return false;
    }

    const currentTime = Date.now() / 1000; // Current time in seconds since epoch
    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return false;
  }
};

const setSession = (authToken?: string | null): void => {
  if (typeof authToken === "string" && authToken.trim() !== "") {
    // Store token — localStorage on app, sessionStorage on web
    storage.setItem("authToken", authToken);

    axiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    // Remove token
    storage.removeItem("authToken");

    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

axiosInstance.interceptors.request.use((config) => {
  const authToken = storage.getItem("authToken");
  if (authToken && !isTokenValid(authToken)) {
    storage.removeItem("authToken");
    delete axiosInstance.defaults.headers.common.Authorization;
    window.location.href = "/login";
    return Promise.reject("Session expired");
  }
  return config;
});

export { isTokenValid, setSession, storage };