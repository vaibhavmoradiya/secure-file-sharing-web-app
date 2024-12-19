import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api";
const api = axios.create({
  baseURL: API_BASE_URL
});
export const registerUser = async (userData) => {
  return api.post("/register/", userData, 
    {
    headers: {
      'Content-Type': 'application/json',
    }}
  );
};
export const loginUser = async (userData) => {
  return api.post("/login/", userData);
};
export const fetchFilesApi = async (token) => {
  return api.get("/files/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchSharedFilesApi = async (token) => {
  return api.get("/shares/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFileApi = async (formData, token) => {
  return api.post("/files/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const shareFileApi = async (shareData, token) => {
  return api.post("/shares/", shareData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchMfaQrCode = async (token) => {
  try {
    const response = await api.get("/mfa-qr/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.qr_code_url;
  } catch (error) {
    throw new Error("Failed to fetch MFA QR code");
  }
};
export default api;
