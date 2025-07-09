import axios from "axios";
import { SignUpData } from "../utils/interfaces";
import { BaseUrl } from "../utils/BaseUrl";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const api = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Essential for cookies
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    const stateChangingMethods = ["post", "put", "patch", "delete"];

    // Always try to get the token from cookies first
    const xsrfToken = getCookie("XSRF-TOKEN");

    if (xsrfToken) {
      config.headers["X-XSRF-TOKEN"] = xsrfToken;
    } else if (stateChangingMethods.includes(method ?? "")) {
      // If no token and it's a state-changing method, fetch CSRF cookie first
      try {
        await axios.get(`${BaseUrl}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const newToken = getCookie("XSRF-TOKEN");
        if (newToken) {
          config.headers["X-XSRF-TOKEN"] = newToken;
        }
      } catch (error) {
        console.error("CSRF token fetch failed:", error);
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to get cookies
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

// Auth functions
export const login = async (data: { username: string; password: string }) => {
  try {
    // Ensure CSRF cookie is set before login
    await axios.get(`${BaseUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    const response = await api.post(`/login/`, data);
    return response;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "detail" in error.response.data
    ) {
      throw error.response.data.detail;
    }
    throw "Login failed";
  }
};

export const userRegister = async (data: SignUpData) => {
  try {
    // Ensure CSRF cookie is set before registration
    await axios.get(`${BaseUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    const response = await api.post("/register/", data);
    return response.data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { data?: unknown } }).response
    ) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw new Error("Error during registration. Please try again.");
  }
};

// Other existing functions remain the same...
export const getCurrentUser = async () => {
  const response = await api.get("/user");
  return response;
};

export const Logout = async () => {
  try {
    await api.post("/logout");
  } catch (e) {
    console.error("Error logging out:", e);
  }
};

export const fetchUsers = async () => {
  const response = await api.get("/accounts/users");
  return response.data;
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  try {
    await api.put("/accounts/password_change/", data);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "current_password" in error.response.data
    ) {
      throw new Error(
        (
          error as { response: { data: { current_password: string } } }
        ).response.data.current_password
      );
    }
    throw new Error("Something went wrong.");
  }
};
