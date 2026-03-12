/**
 * Centralized API Client for Stafio
 * ==================================
 * Automatically:
 * - Attaches JWT access token (Authorization: Bearer) to all requests
 * - Keeps backward-compatible X-User-ID / X-User-Role headers
 * - Auto-refreshes expired access tokens using refresh token
 * - Auto-redirects to login on 401 (after refresh fails)
 *
 * All auth data is stored in localStorage for persistence across browser close.
 */
import axios from "axios";

const API_BASE = "http://127.0.0.1:5001";

const apiClient = axios.create({
  baseURL: API_BASE,
});

// ---------------------------------------------------------------------------
// Helper: get auth data from localStorage (persistent across browser close)
// ---------------------------------------------------------------------------
const getAuthToken = () => {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("admin")) return localStorage.getItem("auth_token_admin") || localStorage.getItem("auth_token");
  if (path.includes("employee")) return localStorage.getItem("auth_token_employee") || localStorage.getItem("auth_token");
  return localStorage.getItem("auth_token");
};

const getRefreshToken = () => {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("admin")) return localStorage.getItem("refresh_token_admin") || localStorage.getItem("refresh_token");
  if (path.includes("employee")) return localStorage.getItem("refresh_token_employee") || localStorage.getItem("refresh_token");
  return localStorage.getItem("refresh_token");
};

const getUserId = () =>
  localStorage.getItem("current_user_id") ||
  localStorage.getItem("employee_user_id");

const getUserRole = () => {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("admin")) return "admin";
  if (path.includes("employee")) return "employee";
  return localStorage.getItem("current_role") || localStorage.getItem("employee_role");
};

/**
 * Store a new access token in localStorage
 */
const storeAccessToken = (token) => {
  localStorage.setItem("auth_token", token);
};

/**
 * Clear all auth data from localStorage and redirect to login
 */
const clearAllAuthAndRedirect = () => {
  // Clear all auth keys from localStorage
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("current_user_id");
  localStorage.removeItem("current_username");
  localStorage.removeItem("current_role");
  localStorage.removeItem("current_email");
  localStorage.removeItem("employee_user_id");
  localStorage.removeItem("employee_role");
  localStorage.removeItem("employee_username");

  // Also clear sessionStorage for backward compat cleanup
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("current_user_id");
  sessionStorage.removeItem("current_username");
  sessionStorage.removeItem("current_role");
  sessionStorage.removeItem("current_email");

  // Determine redirect based on current path
  const isEmployeePath = window.location.pathname.includes("employee");
  window.location.href = isEmployeePath ? "/employee-login" : "/admin-login";
};


// ---------------------------------------------------------------------------
// REQUEST INTERCEPTOR: attach Authorization + backward-compat headers
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Backward compatibility headers (for migration period)
    const userId = getUserId();
    const userRole = getUserRole();
    if (userId) config.headers["X-User-ID"] = userId;
    if (userRole) config.headers["X-User-Role"] = userRole;

    return config;
  },
  (error) => Promise.reject(error)
);


// ---------------------------------------------------------------------------
// RESPONSE INTERCEPTOR: auto-refresh on 401, then retry original request
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already tried refreshing for this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // Use plain axios (not apiClient) to avoid infinite loop
          const { data } = await axios.post(`${API_BASE}/api/refresh`, {
            refresh_token: refreshToken,
          });

          // Store the new access token
          storeAccessToken(data.access_token);

          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh token is also invalid → full logout
          clearAllAuthAndRedirect();
          return Promise.reject(refreshError);
        }
      }

      // No refresh token available → logout
      clearAllAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);


export default apiClient;
export { getAuthToken, getRefreshToken, getUserId, getUserRole, clearAllAuthAndRedirect };
