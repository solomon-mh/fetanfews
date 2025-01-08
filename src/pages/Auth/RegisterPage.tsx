import React, { useState } from "react";
import { SignUpData } from "../../utils/interfaces";
import { signUp } from "../../api/auth";
import "./Auth.scss";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpData>({
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signUp(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign-Up failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register to Book Online!</h2>
      <p>
        LocateMed has a strong protocol that a user should use their own phone
        number and password to login. If you are booking for someone else,
        please use their phone number to register.
      </p>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Registration Successful! Please login.</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="E.g. 0911xxxxxx or 0703xxxxxx"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter Password again"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" required /> I agree to the terms and
            conditions
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
