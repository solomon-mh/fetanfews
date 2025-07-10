/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { changePassword } from "../../api/auth";
import { z } from "zod";
import SnackbarComponent from "../../admin/modals/SnackbarComponent";

const formSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Current password is required." }),

    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character.",
      }),

    confirm_password: z
      .string()
      .min(1, { message: "Password confirmation is required." }),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        message: "New password and confirmation password do not match.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    setFormErrors({});
    e.preventDefault();

    try {
      formSchema.parse({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      const data = {
        current_password: currentPassword,
        new_password: newPassword,
      };

      // Call changePassword API
      await changePassword(data);
      showSnackbar("Password updated successfully", "success");
      setErrorMessage("");
      setFormErrors({});

      // Redirect to the previous page after success
      navigate(-1);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errorMap: any = {};
        err.errors.forEach((error) => {
          errorMap[error.path[0]] = error.message;
        });
        setFormErrors(errorMap);
      } else {
        showSnackbar(err.message || "Something went wrong.", "error");
      }
    }
  };
  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Change Your Password
        </h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.current_password && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.current_password}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.new_password && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.new_password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formErrors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.confirm_password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Change Password
          </button>
        </form>

        <SnackbarComponent
          open={snackbar.open}
          message={snackbar.message}
          type={snackbar.type}
          onClose={closeSnackbar}
        />
      </div>
    </div>
  );
};

export default ChangePassword;
