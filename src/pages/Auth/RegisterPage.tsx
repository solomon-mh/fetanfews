/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { userRegister } from "../../api/auth";
import drugStore from "../../assets/images/drugstore.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../utils/validateForm";
import { FormErrors } from "../../utils/interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SignUp: React.FC = () => {
  const { setUser } = useAuth();
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const { confirmPassword, ...rest } = data;

    const payload = {
      ...rest,
      password_confirmation: confirmPassword,
    };

    try {
      const response = await userRegister(payload);
      console.log("response");
      console.log(response);

      if (response.user || response.status === 201) {
        setSubmissionMessage("User created successfully!");
        setUser(response.user);
        navigate("/");
      } else {
        setSubmissionMessage("Error creating user");

        if (response.email) {
          setError("email", {
            type: "server",
            message: "User with this email already registered",
          });
        }
        if (response.phone_number) {
          setError("phone_number", {
            type: "server",
            message: "User with this phone number already registered",
          });
        }
        if (response.password) {
          setError("password", {
            type: "server",
            message: response.password[0],
          });
        }
        if (response.general) {
          setSubmissionMessage(response.general);
        }
      }
    } catch (error) {
      setSubmissionMessage("An unexpected error occurred.");
    }
  };

  const renderError = (fieldName: keyof FormErrors) =>
    errors[fieldName] ? (
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
        {errors[fieldName]?.message?.toString()}
      </p>
    ) : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Left: Form Section */}
      <div className="w-full md:w-1/2 px-8 py-10 md:px-16 lg:px-24 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4 text-green-700 dark:text-lime-400">
          Register Here!
        </h2>
        <p className="mb-6 text-sm md:text-base text-gray-600 dark:text-gray-400">
          Welcome to Fetanfews! Use your own{" "}
          <strong>unique phone number</strong> or <strong>email address</strong>
          . If booking for someone else, use their phone number. All info is
          used for verification and booking confirmations.
        </p>

        {submissionMessage && (
          <p className="text-sm mb-4 text-red-600 dark:text-red-400">
            {submissionMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              {...register("first_name")}
              placeholder="Enter First Name"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {renderError("first_name")}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              {...register("last_name")}
              placeholder="Enter Last Name"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {renderError("last_name")}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter Email"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {renderError("email")}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              type="text"
              {...register("phone_number")}
              placeholder="e.g. 0911xxxxxx"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {renderError("phone_number")}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter Password"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {renderError("password")}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Re-enter Password"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {renderError("confirmPassword")}
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" required className="mt-1" />
            <label className="text-sm">
              I agree to the{" "}
              <span className="text-green-600 dark:text-lime-400 underline">
                terms and conditions
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/user/login"
            className="text-green-600 dark:text-lime-400 underline hover:text-green-800 dark:hover:text-lime-300"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src={drugStore}
          alt="Drugstore"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUp;
