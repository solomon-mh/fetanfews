import axios from "axios";

const API_BASE_URL = "https://example.com/api";

import { LoginCredentials,SignUpData } from "../utils/interfaces";

export const login = (credentials: LoginCredentials) => {
  return axios.post(`${API_BASE_URL}/login`, credentials);
};

export const signUp = (data: SignUpData) => {
  return axios.post(`${API_BASE_URL}/signup`, data);
};
