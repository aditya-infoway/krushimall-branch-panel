// src/utils/apiHelper.ts

import axios from "axios";
import { storage } from "./jwt";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = storage.getItem("authToken");

  

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Add this helper function
export const getBaseUrl = () => {
  const apiUrl =
    import.meta.env.VITE_API_URL || "http://192.168.1.49:5000/api";

  return apiUrl.replace(/\/api$/, "");
};

const apiHelper = {
  // ✅ Add image URL helper
  getImageUrl: (imagePath: string | null | undefined): string => {
    if (!imagePath) return "";
    
    // Already a full URL or base64
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    // Already has leading slash (like /uploads/file.jpg)
    if (imagePath.startsWith('/')) {
      return `${getBaseUrl()}${imagePath}`;
    }
    
    // Just filename
    return `${getBaseUrl()}/uploads/${imagePath}`;
  },

  // GET
  get: async (
    url: string,
    params?: Record<string, any>
  ) => {
    const response = await api.get(url, { params });
    return response.data;
  },
getBlob: async (
  url: string,
  params?: Record<string, any>
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
    data: Record<string, any>
  ) => {
    const response = await api.post(url, data);
    return response.data;
  },

  // PUT
put: async (
  url: string,
  data: any,
  config?: any
) => {
  const response = await api.put(
    url,
    data,
    config
  );

  return response.data;
},

  // PATCH
patch: async (
  url: string,
  data?: Record<string, any>
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
    formData: FormData
  ) => {
    const response = await api.post(
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export default apiHelper;