import "./../styles/login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // store token and optionally user
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="navbar">
        <div className="nav-logo">SocialDashboard</div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </div>

      <div className="login-container">
        <h1 className="login-title">Welcome to Social Media Dashboard</h1>
        <p className="login-subtitle">
          Best website to manage your social media accounts
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label className="remember">
              <input type="checkbox" /> Remember Me
            </label>

            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="login-btn" type="submit">Log In</button>

          <p className="signup-link">
            Don’t have an account? <a href="/register">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
