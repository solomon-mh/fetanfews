/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { userRegister } from "../../api/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../utils/validateForm";
import { FormErrors, UserRole } from "../../utils/interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const SignUp: React.FC = () => {
  const { setUser } = useAuth();
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    setSubmissionMessage("");

    const { confirmPassword, ...rest } = data;
    const payload = {
      ...rest,
      password_confirmation: confirmPassword,
      role: UserRole.USER,
    };

    try {
      const response = await userRegister(payload);
      if (response.user || response.status === 201) {
        setSubmissionMessage("User created successfully!");
        setUser(response?.user);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setSubmissionMessage("Error creating user");

        if (response.email) {
          setError("email", {
            type: "server",
            message: "User with this email already registered",
          });
        }
        if (response.phone) {
          setError("phone", {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const renderInputField = (
    name: keyof FormErrors,
    label: string,
    type: string,
    placeholder: string,
    icon: React.ReactNode
  ) => (
    <motion.div variants={itemVariants} className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
            errors[name]
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          } bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-colors`}
        />
      </div>
      {errors[name] && (
        <motion.p
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
        >
          <FiAlertCircle className="mr-1" /> {errors[name]?.message?.toString()}
        </motion.p>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Join us to get started
            </p>
          </motion.div>

          {submissionMessage && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`mb-6 p-4 rounded-lg flex items-start ${
                submissionMessage.includes("successfully")
                  ? "bg-green-50 dark:bg-green-900/30"
                  : "bg-red-50 dark:bg-red-900/30"
              }`}
            >
              {submissionMessage.includes("successfully") ? (
                <FiCheck className="text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
              ) : (
                <FiAlertCircle className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              )}
              <p
                className={
                  submissionMessage.includes("successfully")
                    ? "text-green-600 dark:text-green-400 text-sm"
                    : "text-red-600 dark:text-red-400 text-sm"
                }
              >
                {submissionMessage}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputField(
                "first_name",
                "First Name",
                "text",
                "John",
                <FiUser className="h-5 w-5 text-gray-400" />
              )}

              {renderInputField(
                "last_name",
                "Last Name",
                "text",
                "Doe",
                <FiUser className="h-5 w-5 text-gray-400" />
              )}
            </div>

            {renderInputField(
              "email",
              "Email Address",
              "email",
              "your@email.com",
              <FiMail className="h-5 w-5 text-gray-400" />
            )}

            {renderInputField(
              "phone",
              "Phone Number",
              "tel",
              "0911xxxxxx",
              <FiPhone className="h-5 w-5 text-gray-400" />
            )}

            {renderInputField(
              "password",
              "Password",
              "password",
              "••••••••",
              <FiLock className="h-5 w-5 text-gray-400" />
            )}

            {renderInputField(
              "confirmPassword",
              "Confirm Password",
              "password",
              "••••••••",
              <FiLock className="h-5 w-5 text-gray-400" />
            )}

            <motion.div variants={itemVariants} className="mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold transition-all shadow-md hover:shadow-lg ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            variants={itemVariants}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            <p>
              Already have an account?{" "}
              <Link
                to="/user/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Login here
              </Link>
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        ></motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;
