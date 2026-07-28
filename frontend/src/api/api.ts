import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/ai",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error ?? error?.response?.data?.message ?? error?.message;
    return Promise.reject(new Error(message || "An unexpected API error occurred."));
  }
);

export default api;
