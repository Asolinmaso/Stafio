// AdminLogin.jsx (FIXED)
import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

import BGShape from "../../assets/BGShape.png";
import teampluslogo from "../../assets/stafioimg.png";
import Imagelogin from "../../assets/Imagelogin.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ForgotPasswordPopup from "./ForgotPasswordPopup";

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const googleRoleRef = useRef("admin"); // which Google login clicked

  // Load Google script only once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    };

    return () => document.body.removeChild(script);
  }, []);

  // Google login callback
  const handleGoogleResponse = async (response) => {
    const id_token = response.credential;
    const role = googleRoleRef.current;

    try {
      const res = await fetch("http://127.0.0.1:5001/google_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token, role }),
      });

      const data = await res.json();

      if (!res.ok) return setError(data.message);

      // Store data
      localStorage.setItem(`${role}_user_id`, data.user_id);
      localStorage.setItem(`${role}_role`, data.role);
      localStorage.setItem(`${role}_username`, data.username);

      navigate(role === "admin" ? "/admin-dashboard" : "/employee-dashboard");
    } catch (err) {
      setError("Google login failed. Try again.");
    }
  };

  // Start Google login for selected role
  const startGoogleLogin = (role) => {
    googleRoleRef.current = role;

    if (!window.google || !window.google.accounts.id) {
      setError("Google Login not loaded yet. Try again.");
      return;
    }
    window.google.accounts.id.prompt();
  };



  // Normal login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5001/admin_login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) return setError(data.message);

      localStorage.setItem("admin_user_id", data.user_id);
      localStorage.setItem("admin_role", data.role);
      localStorage.setItem("admin_username", data.username);

      if (rememberMe) {
        localStorage.setItem("remember_admin", "true");
        localStorage.setItem("remember_email", identifier);
        localStorage.setItem("remember_password", password);
      } else {
        localStorage.removeItem("remember_admin");
        localStorage.removeItem("remember_email");
        localStorage.removeItem("remember_password");
      }

      navigate("/admin-dashboard");
    } catch {
      setError("Network error. Backend might be down.");
    }
  };

  // Auto-login if remembered
  useEffect(() => {
    if (localStorage.getItem("remember_admin") === "true") {
      setIdentifier(localStorage.getItem("remember_email") || "");
      setPassword(localStorage.getItem("remember_password") || "");
      navigate("/admin-dashboard");
    }
  }, []);

  return (
    <Container fluid className="admin-login-container">
      <Row className="vh-100">
        <Col md={6} className="login-left d-flex flex-column align-items-center justify-content-center">
          <img src={BGShape} alt="Background Shape" className="bg-shape" />
          <div className="login-left-content text-center">
            <img src={teampluslogo} alt="Team Plus Logo" className="teampluss-logo" />
            <h2 className="login-heading">One Portal,</h2>
            <h4 className="login-subheading">Unlimited Potential</h4>
            <p className="login-description">Welcome to Workspace Hub – Where people & productivity meet.</p>
          </div>
          <img src={Imagelogin} alt="Login Illustration" className="login-illustrations" />
        </Col>

        <Col md={6} className="d-flex align-items-center justify-content-left bg-white">
          <div className="login-form-wrapper">
            <h5 className="mb-2">Welcome back! 👋</h5>
            <h3 className="mb-4">HR Login</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleAdminLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email / Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" style={{ position: "relative" }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "70%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6c757d",
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span
                  onClick={() => setShowForgot(true)}
                  className="forgot-password-link"
                  style={{ cursor: "pointer" }}
                >
                  Forgot password?
                </span>
              </div>

              <ForgotPasswordPopup show={showForgot} onClose={() => setShowForgot(false)} />

              <Button variant="primary" type="submit" className="login-btn">
                Login
              </Button>
            </Form>

            {/* Google Buttons */}
            <div className="mt-4" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => startGoogleLogin("admin")}
                className="google-btn"
              >
                <img src="/google-icon.svg" alt="" /> Continue with Google (Admin)
              </button>

              <button
                onClick={() => startGoogleLogin("employee")}
                className="google-btn"
              >
                <img src="/google-icon.svg" alt="" /> Continue with Google (Employee)
              </button>
            </div>

            <div className="signup-text mt-4">
              <span>New to Stafio? </span>
              <Link to="/register-admin" className="signup-page">Sign up</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
