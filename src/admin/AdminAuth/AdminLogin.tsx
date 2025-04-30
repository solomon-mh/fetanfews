/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { emailRegex } from "../../utils/Regex";
import { useAuth } from "../../contexts/AuthContext";
const AdminLogin: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { setUser } = useAuth();
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			setError("Please fill in all fields.");
			return;
		}
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email");
			return;
		}
		try {
			const response = await login({ username: email, password: password });
			setUser(response.data.user);
			if (
				response.data.user.role === "admin" ||
				response.data.user.role === "pharmacist"
			) {
				navigate("/admin/dashboard");
			} else {
				setError("invalid credantial");
			}
		} catch (errorMessage: any) {
			setError(errorMessage);
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<h2 className="login-title">Admin Login</h2>
				{error && <p className="error">{error}</p>}
				<form onSubmit={handleLogin}>
					<div className="input-group">
						<label>Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
						/>
					</div>
					<div className="input-group">
						<label>Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
						/>
					</div>
					<button type="submit" className="login-button">
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default AdminLogin;
