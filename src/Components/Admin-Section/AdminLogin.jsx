import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

import BGShape from "../../assets/BGShape.png";
import teampluslogo from "../../assets/stafio-bg-dark.png";
import Imagelogin from "../../assets/Imagelogin.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ForgotPasswordPopup from "./ForgotPasswordPopup";

import {
  saveSession,
  isLoggedIn,
  saveRememberMe,
  saveGoogleRememberMe,
  clearRememberMe,
  getRememberMe,
} from "../../utils/sessionManager";

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // ---------------------------
  // ✅ Check if already logged in this tab
  // ---------------------------
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/admin-dashboard");
      return;
    }

    // Check for Remember Me (gets most recent)
    const remembered = getRememberMe("admin");
    if (remembered && !remembered.isGoogle) {
      setIdentifier(remembered.email);
      setPassword(remembered.password);
      setRememberMe(true);
    }
  }, [navigate]);

  // ---------------------------
  // ✅ Admin Normal Login
  // ---------------------------
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

      if (response.ok) {
        // ✅ Save session using sessionManager
        saveSession(
          {
            user_id: data.user_id,
            username: data.username,
            email: identifier,
          },
          "admin"
        );

        // ✅ Handle Remember Me with user_id
        if (rememberMe) {
          saveRememberMe(identifier, password, "admin", data.user_id);
        } else {
          clearRememberMe("admin", data.user_id);
        }

        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Check if backend is running.");
    }
  };

  // ---------------------------
  // ✅ Google Login
  // ---------------------------
  const handleGoogleLogin = (credentialResponse) => {
    if (!credentialResponse || !credentialResponse.credential) {
      setError("Google login cancelled or failed.");
      return;
    }

    fetch("http://127.0.0.1:5001/admin_google_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_token: credentialResponse.credential,
        role: "admin",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_id) {
          // ✅ Save session using sessionManager
          saveSession(
            {
              user_id: data.user_id,
              username: data.username,
              email: data.email,
            },
            "admin"
          );

          // ✅ Handle Google Remember Me with user_id
          if (rememberMe) {
            saveGoogleRememberMe(data.email, data.username, "admin", data.user_id);
          } else {
            clearRememberMe("admin", data.user_id);
          }

          navigate("/admin-dashboard");
        } else {
          setError(data.message || "Google login failed");
        }
      })
      .catch(() => setError("Google login failed"));
  };

  // ---------------------------
  // ✅ Initialize Google Login Button
  // ---------------------------
  useEffect(() => {
    /* global google */
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id:
          "337074822738-kaucna6a1olvoo8qfvs8r320iekp9hi1.apps.googleusercontent.com",
        callback: handleGoogleLogin,
        ux_mode: "popup",
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginButton"),
        {
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
        }
      );
    }
  }, []);

  return (
    <Container fluid className="admin-login-container">
      <Row className="vh-100">
        <Col
          md={6}
          className="login-left d-flex flex-column align-items-center justify-content-center"
        >
          <img src={BGShape} alt="Background Shape" className="bg-shape" />

          <div className="login-left-content">
            <img
              src={teampluslogo}
              alt="Team Plus"
              className="teampluss-logo mb-3"
            />
            <h2 className="login-heading">One Portal,</h2>
            <h4 className="login-subheading">Unlimited Potential</h4>
            <p className="login-description">
              Welcome to workspace Hub — Where people & productivity meet.
            </p>
          </div>

          <img
            src={Imagelogin}
            alt="Login Illustration"
            className="login-illustrations"
          />
        </Col>

        <Col
          md={6}
          className="d-flex align-items-center justify-content-left bg-white"
        >
          <div className="login-form-wrapper">
            <h5 className="mb-2">Welcome back! 👋</h5>
            <h3 className="mb-4">HR Login</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleAdminLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email / Username</Form.Label>
                <Form.Control
                  type="text"
                  className="email-input"
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
                  className="email-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  className="remember-me-checkbox"
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

              <ForgotPasswordPopup
                show={showForgot}
                onClose={() => setShowForgot(false)}
              />

              <Button variant="primary" type="submit" className="login-btn">
                Login
              </Button>

              <div id="googleLoginButton" style={{ marginTop: "15px" }}></div>
            </Form>

            <div className="signup-text mt-4">
              <span>New to Stafio? </span>
              <Link to="/register-admin" className="signup-page">
                Sign up
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;