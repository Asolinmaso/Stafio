import axios from "axios";

// Centralised Axios client for the frontend
// Base URL can be overridden via Vite env: VITE_API_BASE_URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;


