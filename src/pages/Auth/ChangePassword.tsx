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
		<div className="change-password-container">
			<h2>Change Your Password</h2>
			{errorMessage && <div className="error-message">{errorMessage}</div>}

			<form onSubmit={handleChangePassword} className="change-password-form">
				<div className="input-group">
					<label htmlFor="current-password">Current Password</label>
					<input
						type="password"
						id="current-password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
					/>
					{formErrors.current_password && (
						<div className="error-text">{formErrors.current_password}</div>
					)}
				</div>

				<div className="input-group">
					<label htmlFor="new-password">New Password</label>
					<input
						type="password"
						id="new-password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
					{formErrors.new_password && (
						<div className="error-text">{formErrors.new_password}</div>
					)}
				</div>

				<div className="input-group">
					<label htmlFor="confirm-password">Confirm New Password</label>
					<input
						type="password"
						id="confirm-password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
					{formErrors.confirm_password && (
						<div className="error-text">{formErrors.confirm_password}</div>
					)}
				</div>

				<button type="submit" className="submit-btn">
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
	);
};

export default ChangePassword;
