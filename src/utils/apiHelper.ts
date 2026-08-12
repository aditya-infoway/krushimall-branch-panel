import axios from "axios";
import { storage } from "./jwt";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

// Automatically attach existing token
api.interceptors.request.use((config) => {
  const token = storage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// API URL without /api
export const getBaseUrl = () => {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://31.97.237.210/krushimall-api/api";
    // "http://localhost:5001/api";

  return apiUrl.replace(/\/api\/?$/, "");
};

const apiHelper = {
  // Image URL helper
  getImageUrl: (
    imagePath: string | null | undefined,
  ): string => {
    if (!imagePath) return "";

    // Full URL / base64
    if (
      imagePath.startsWith("http") ||
      imagePath.startsWith("data:")
    ) {
      return imagePath;
    }

    // /uploads/file.jpg
    if (imagePath.startsWith("/")) {
      return `${getBaseUrl()}${imagePath}`;
    }

    // filename only
    return `${getBaseUrl()}/uploads/${imagePath}`;
  },

  // GET
  get: async (
    url: string,
    params?: Record<string, any>,
  ) => {
    const response = await api.get(url, {
      params,
    });

    return response.data;
  },

  // GET Blob
  getBlob: async (
    url: string,
    params?: Record<string, any>,
  ) => {
    const response = await api.get(url, {
      params,
      responseType: "blob",
    });

    return response.data;
  },

  // POST
  post: async (
    url: string,
    data: Record<string, any>,
  ) => {
    const response = await api.post(url, data);

    return response.data;
  },

  // PUT
  put: async (
    url: string,
    data: any,
    config?: any,
  ) => {
    const response = await api.put(
      url,
      data,
      config,
    );

    return response.data;
  },

  // PATCH
  patch: async (
    url: string,
    data?: Record<string, any>,
  ) => {
    const response = await api.patch(url, data);

    return response.data;
  },

  // DELETE
  delete: async (url: string) => {
    const response = await api.delete(url);

    return response.data;
  },

  // IMAGE / FILE UPLOAD
  upload: async (
    url: string,
    formData: FormData,
  ) => {
    const response = await api.post(
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },
};

export default apiHelper;