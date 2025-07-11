import axios from "axios";
import { SignUpData } from "../utils/interfaces";
import { BaseUrl } from "../utils/BaseUrl";

export const publicApi = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
export const privateApi = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
privateApi.interceptors.request.use(
  (config) => {
    // Get the auth token from your storage (cookie, localStorage, etc.)
    const authToken =
      localStorage.getItem("auth_token") || getCookie("auth_token");

    // If token exists, add it to the Authorization header
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Auth functions
export const login = async (data: { username: string; password: string }) => {
  try {
    const response = await publicApi.post(`/login/`, data);
    // Store token (choose one method)
    localStorage.setItem("auth_token", response.data.token); // or
    return response;
  } catch (error: unknown) {
    console.log(error);

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
    const response = await privateApi.post("/register/", data);
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
  const response = await privateApi.get("/user");
  return response;
};

export const logout = async () => {
  try {
    await privateApi.post("/logout");
    // Clear token
    localStorage.removeItem("auth_token"); // or
    document.cookie =
      "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // Clear axios auth header
    delete privateApi.defaults.headers.common.Authorization;
  } catch (e) {
    console.error("Error logging out:", e);
  }
};

export const fetchUsers = async () => {
  const response = await privateApi.get("/accounts/users");
  return response.data;
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
}) => {
  try {
    await privateApi.put("/change-password/", data);
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

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(";").shift() || null;
  }
  return null;
}
