/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import { SignUpData } from "../utils/interfaces";
import { BaseUrl } from "../utils/BaseUrl";

export const api = axios.create({
	baseURL: BaseUrl,
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
				const refreshResponse = await api.post(`/accounts/token/refresh/`, {
					refresh: refreshToken,
				});
				const { access } = refreshResponse.data;

				// Save new token and retry original request
				localStorage.setItem("access_token", access);
				api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
				return api(originalRequest);
			} catch (refreshError) {
				console.error("Error refreshing token:", refreshError);
				const user_type = localStorage.getItem("user_type");
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				if (user_type === "admin") {
					window.location.href = "/admin/login";
				} else {
					window.location.href = "/user/login";
				}
				// Optionally: redirect to login or clear authentication state
			}
		}

		return Promise.reject(error);
	}
);
export const login = async (data: { username: string; password: string }) => {
	try {
		const response = await api.post(`/accounts/token/`, data);

		const { refresh, access, user } = response.data;

		// Store tokens and user data in localStorage
		localStorage.setItem("access_token", access);
		localStorage.setItem("refresh_token", refresh);
		localStorage.setItem("user", JSON.stringify(user));

		return response;
	} catch (error: any) {
		throw error.response?.data?.detail || "Login failed";
	}
};
export const userRegister = async (data: SignUpData) => {
	try {
		console.log(data);

		const response = await api.post("/accounts/register/", data);
		const { refresh, access } = response.data;

		// Store tokens in localStorage
		localStorage.setItem("access_token", access);
		localStorage.setItem("refresh_token", refresh);

		return response.data;
	} catch (error: any) {
		if (error.response) {
			return error.response.data;
		}
		return { general: "Error during registration. Please try again." };
	}
};

export const getCurrentUser = async () => {
	const response = await api.get("/accounts/current_user/");
	return response;
};
export const Logout = async () => {
	try {
		await api.post("/accounts/logout/", {
			refresh_token: localStorage.getItem("refresh_token"),
		});
		localStorage.clear();
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
	} catch (error: any) {
		throw new Error(
			error.response?.data?.current_password || "Something went wrong."
		);
	}
};
