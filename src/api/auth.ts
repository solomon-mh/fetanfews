/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import {SignUpData } from "../utils/interfaces";

const URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token logic
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Refresh token request
        const refreshResponse = await axios.post(
          "http://localhost:8000/api/accounts/token/refresh/",
          { refresh: refreshToken }
        );
        const { access } = refreshResponse.data;

        // Save new token and retry original request
        localStorage.setItem("access_token", access);
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Optionally: redirect to login or clear authentication state
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (data: { username: string; password: string }) => {
  console.log("login calling",data)
  const response = await axios.post("http://localhost:8000/api/accounts/token/", data);
  const { refresh, access } = response.data;
  // Store tokens in localStorage
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  return response;
};

export const userRegister = async (data: SignUpData) => {
  console.log("userRegister calling")

  try {
    const response = await axios.post('http://localhost:8000/api/accounts/register/', data);
    const { refresh, access } = response.data;
    // Store tokens in localStorage
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
      return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "Error during registration");
  }
  }
  export const getCurrentUser = async () => {
    const response = await api.get("/accounts/current_user/");
    return response;
};
export const Logout = async () => {
  try {

    console.log('/accounts/logout/',localStorage.getItem('access_token'));

    await api.post('/accounts/logout/', { refresh_token: localStorage.getItem('refresh_token') })
    localStorage.clear();
    console.log('/accounts/logout/',localStorage.getItem('access_token'));
    
  } catch (e) { 
    console.error('Error logging out:', e)


  }
}
export const fetchUsers = async () => {
  const response = await api.get('/accounts/users');
  return response.data;
}
  