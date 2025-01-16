import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { LoginCredentials } from "../../utils/interfaces";
import { login } from "../../api/auth";
import "./Auth.scss";
import drugStore from "../../assets/images/drugstore.jpg";
import { Link } from "react-router-dom";
const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { login: loginUser } = useContext(AuthContext) || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (loginUser) loginUser(response.data.phone);
      // Redirect to dashboard or home page
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to Book Online!</h2>
        <p>
          LocateMed has a strong protocol that a user should use their own phone
          number and password to login. If you are booking for someone else,
          please use their phone number to register.
        </p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter Phone"
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
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/user/signup">Sign Up</Link>
        </p>
      </div>
      <div className="auth-image">
        <img src={drugStore} alt="drugStore image" />
      </div>
    </div>
  );
};

export default Login;
