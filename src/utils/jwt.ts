import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axios";

const storage = localStorage;

const isTokenValid = (authToken: string): boolean => {
  try {
    const decoded: { exp?: number } = jwtDecode(authToken);

    if (!decoded.exp) {
      console.error("Token does not contain an expiration time.");
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return false;
  }
};

const setSession = (authToken?: string | null): void => {
  if (typeof authToken === "string" && authToken.trim() !== "") {
    storage.setItem("authToken", authToken);

    axiosInstance.defaults.headers.common.Authorization =
      `Bearer ${authToken}`;
  } else {
    storage.removeItem("authToken");

    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

const setBranchSession = (branchToken?: string | null): void => {
  if (
    typeof branchToken === "string" &&
    branchToken.trim() !== ""
  ) {
    storage.setItem("branchAuthToken", branchToken);

    axiosInstance.defaults.headers.common.Authorization =
      `Bearer ${branchToken}`;
  } else {
    storage.removeItem("branchAuthToken");

    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

const getBranchToken = (): string | null => {
  return storage.getItem("branchAuthToken");
};

axiosInstance.interceptors.request.use((config) => {
  const url = config.url || "";

  const isBranchRequest = url.startsWith("/branch/");

  const authToken = isBranchRequest
    ? storage.getItem("branchAuthToken")
    : storage.getItem("authToken");

  if (authToken) {
    if (!isTokenValid(authToken)) {
      storage.removeItem(
        isBranchRequest ? "branchAuthToken" : "authToken"
      );

      delete axiosInstance.defaults.headers.common.Authorization;

      window.location.href = "/login";

      return Promise.reject("Session expired");
    }

    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export {
  isTokenValid,
  setSession,
  setBranchSession,
  getBranchToken,
  storage,
};