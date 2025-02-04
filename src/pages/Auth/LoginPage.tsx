/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { LoginCredentials } from "../../utils/interfaces";
import { login } from "../../api/auth";
import "./Auth.scss";
import drugStore from "../../assets/images/drugstore.jpg";
import { Link,useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const { setLoggedin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  // Regex for email and phone validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10,15}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("from",from)

    // Validation logic in handleSubmit
    if (!emailRegex.test(formData.username) && !phoneRegex.test(formData.username)) {
      setFieldError("Please enter a valid email or phone number");
      return;
    } else {
      setFieldError(null);
    }
    try {
      const response = await login(formData);
      console.log(response.data);
      setLoggedin(true);
      
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {
          (from === "/") ? (
            <>
            <h2>Login to Book Online!</h2>
            <p>
              LocateMed has a strong protocol that a user should use their own phone
              number or email address and password to login. If you are booking for someone else,
              please use their phone number to register.
            </p>
            </>
          ) : (
              <h2>
                User Login
              </h2>
          )
        
      
}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Phone</label>
            <input
              type="text"
              name="username"
              placeholder="Enter email or phone number"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {fieldError && <p className="error">{fieldError}</p>}
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/user/signup">Sign Up</Link>
        </p>
      </div>
      <div className="auth-image">
        <img src={drugStore} alt="drugStore" />
      </div>
    </div>
  );
};

export default Login;
