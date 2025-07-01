/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { LoginCredentials } from "../../utils/interfaces";
import { login } from "../../api/auth";
import drugStore from "../../assets/images/drugstore.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { setUser } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10,15}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !emailRegex.test(formData.username) &&
      !phoneRegex.test(formData.username)
    ) {
      setFieldError("Please enter a valid email or phone number.");
      return;
    } else {
      setFieldError(null);
    }

    try {
      const response = await login(formData);
      setUser(response.data.user);
      navigate(from, { replace: true });
    } catch (errorMessage: any) {
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Left: Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 py-12 md:px-20 lg:px-24">
        <h2 className="text-3xl font-bold mb-6 text-green-700 dark:text-lime-400">
          {from === "/" ? "Please Login!" : "User Login"}
        </h2>

        {from === "/" && (
          <p className="mb-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Use your own phone number or email address and password to login.
          </p>
        )}

        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Email or Phone
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter email or phone number"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {fieldError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {fieldError}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          Don't have an account?{" "}
          <Link
            to="/user/signup"
            className="text-green-600 dark:text-lime-400 underline hover:text-green-800 dark:hover:text-lime-300"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={drugStore}
          alt="Drug Store"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
