import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axios";

const storage = localStorage;

const AUTH_KEY = "authToken";
const BRANCH_KEY = "branchAuthToken";

// Branch panel ki saari APIs is prefix se shuru hoti hain
const BRANCH_PANEL_PREFIX = "/branch-panel";

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

// Admin / employee session
const setSession = (authToken?: string | null): void => {
  if (typeof authToken === "string" && authToken.trim() !== "") {
    storage.setItem(AUTH_KEY, authToken);
  } else {
    storage.removeItem(AUTH_KEY);
  }
};

// Branch panel session
const setBranchSession = (branchToken?: string | null): void => {
  if (typeof branchToken === "string" && branchToken.trim() !== "") {
    storage.setItem(BRANCH_KEY, branchToken);
  } else {
    storage.removeItem(BRANCH_KEY);
  }
};

const getBranchToken = (): string | null => {
  return storage.getItem(BRANCH_KEY);
};

// URL se pata karo ki branch panel ki request hai ya nahi
const isBranchPanelUrl = (rawUrl: string): boolean => {
  let path = rawUrl;

  // Agar full URL aaya ho to sirf path nikalo
  try {
    if (/^https?:\/\//i.test(rawUrl)) {
      path = new URL(rawUrl).pathname;
    }
  } catch {
    // ignore
  }

  // Leading slash ensure karo
  if (!path.startsWith("/")) path = `/${path}`;

  // /krushimall-api/api/branch-panel/... jaise prefix ke saath bhi chale
  return (
    path.startsWith(BRANCH_PANEL_PREFIX) ||
    path.includes(`/api${BRANCH_PANEL_PREFIX}`)
  );
};

axiosInstance.interceptors.request.use((config) => {
  const url = config.url || "";

  const isBranchRequest = isBranchPanelUrl(url);

  const tokenKey = isBranchRequest ? BRANCH_KEY : AUTH_KEY;
  const authToken = storage.getItem(tokenKey);

  if (authToken) {
    if (!isTokenValid(authToken)) {
      storage.removeItem(tokenKey);

      // Subpath deployment (/krushimall-branch) ke liye BASE_URL use karo
      window.location.href = `${import.meta.env.BASE_URL}login`;

      return Promise.reject("Session expired");
    }

    config.headers.Authorization = `Bearer ${authToken}`;
  } else {
    // Galat panel ka token kabhi na bhejo
    delete config.headers.Authorization;
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