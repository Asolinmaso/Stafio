import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  ProgressBar,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AdminRegister.css";

// Reuse same assets as login
import BGShape from "../../assets/BGShape.png";
import teampluslogo from "../../assets/stafioimg.png";
import Registerlogo from "../../assets/registerlogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../../api/client";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "admin",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const evaluatePasswordStrength = (value) => {
    let score = 0;
    if (/[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (value.length >= 8) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score += 1;
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setMessage("");

    if (!formData.username || !formData.email) {
      setError("Username and email are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (!isOtpSent) {
        // Step 1: send OTP
        const res = await apiClient.post("/send_otp", {
          email: formData.email,
          username: formData.username,
        });
        setMessage(res.data?.message || "OTP sent successfully.");
        setShowOtpInput(true);
        setIsOtpSent(true);
      } else {
        // Step 2: verify OTP & register
        const res = await apiClient.post("/verify_otp_register", {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          otp,
          role: formData.role,
        });

        setMessage(
          res.data?.message || "Registration successful! You can now log in."
        );
        setShowOtpInput(false);
        setIsOtpSent(false);
        setOtp("");
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          role: "admin",
        });
        setStrength(0);
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.message ||
        (isOtpSent ? "Registration failed." : "Failed to send OTP.");
      setError(apiMessage);
      // eslint-disable-next-line no-console
      console.error("AdminRegister error:", err.response || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });
    setStrength(evaluatePasswordStrength(value));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmPassword: value });
  };

  // Determine progress bar color and label
  const getVariant = () => {
    if (strength === 1) return "danger"; // Red
    if (strength === 2) return "warning"; // Yellow
    if (strength === 3) return "ok"; // orange
    if (strength === 4) return "success"; // Green
    return "secondary"; // Grey (empty)
  };

  const getLabel = () => {
    if (strength === 1) return "Weak";
    if (strength === 2) return "Moderate";
    if (strength === 3) return "Almost Strong";
    if (strength === 4) return "Strong";
    return "";
  };

  return (
    <Container fluid className="admin-register-container">
      <Row className="vh-100">
        {/* ===== LEFT SIDE ===== */}
        <Col
          md={6}
          className="register-left d-flex flex-column align-items-center justify-content-center"
        >
          <img src={BGShape} alt="Background Shape" className="bg-shape" />

          <div className="register-left-content text-center">
            <div className="register-logos mb-3">
              <img
                src={teampluslogo}
                alt="Team Plus Logo"
                className="teamplus-logo"
              />
            </div>

            <h2 className="register-heading">One Portal,</h2>
            <h4 className="register-subheading">Unlimited Potential</h4>

            <p className="register-description">
              Create your account — It only takes a minute!
            </p>
          </div>

          <img
            src={Registerlogo}
            alt="Register Illustration"
            className="register-illustration"
          />
        </Col>

        {/* ===== RIGHT SIDE ===== */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-left bg-white"
        >
          <div className="register-form-wrapper">
            <h5 className="mb-2">Just a Few Details to Begin</h5>
            <h3 className="mb-4">Admin Sign Up</h3>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>

                {/* Input with eye toggle */}
                <InputGroup className="align-items-center">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      required
                      style={{ paddingRight: "40px" }} // add space for the eye icon
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      {showPassword ? (
                        <FaEye size={18} />
                      ) : (
                        <FaEyeSlash size={18} />
                      )}
                    </span>
                  </div>
                </InputGroup>

                {/* Progress bar */}
                {formData.password && (
                  <div style={{ marginTop: "8px" }}>
                    <ProgressBar
                      now={(strength / 4) * 100}
                      variant={getVariant()}
                      animated
                      label={getLabel()}
                    />
                    <div style={{ fontSize: "13px", marginTop: "4px" }}>
                      <span style={{ color: strength >= 4 ? "green" : "red" }}>
                        • At least one uppercase
                      </span>
                      <br />
                      <span style={{ color: strength >= 4 ? "green" : "red" }}>
                        • At least one number
                      </span>
                      <br />
                      <span style={{ color: strength >= 4 ? "green" : "red" }}>
                        • Minimum 8 characters
                      </span>
                      <br />
                      <span style={{ color: strength >= 4 ? "green" : "red" }}>
                        • At least one special character
                      </span>
                    </div>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup className="align-items-center">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      {showConfirmPassword ? (
                        <FaEye size={18} />
                      ) : (
                        <FaEyeSlash size={18} />
                      )}
                    </span>
                  </div>
                </InputGroup>
              </Form.Group>
              {showOtpInput && (
                <Form.Group className="mb-3">
                  <Form.Label>OTP Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter 6-digit OTP sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter the 6-digit code sent to {formData.email}
                  </Form.Text>
                </Form.Group>
              )}
              <Button variant="primary" type="submit" className="register-btn">
                {isOtpSent ? "Verify & Register" : "Send OTP"}
              </Button>
              <div className="google-buttons-wrapper mt-3">
                <button
                  type="button"
                  className="google-btn google-btn-admin"
                  onClick={() => {
                    window.currentRegisterRole = "admin";
                    if (
                      window.google &&
                      window.google.accounts &&
                      window.google.accounts.id
                    ) {
                      window.google.accounts.id.prompt();
                    } else {
                      alert("Google SDK not ready - try again shortly.");
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google (Admin)</span>
                </button>

                <button
                  type="button"
                  className="google-btn google-btn-employee"
                  onClick={() => {
                    window.currentRegisterRole = "employee";
                    if (
                      window.google &&
                      window.google.accounts &&
                      window.google.accounts.id
                    ) {
                      window.google.accounts.id.prompt();
                    } else {
                      alert("Google SDK not ready - try again shortly.");
                    }
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google (Employee)</span>
                </button>
              </div>
              <div className="text-center mt-3">
                <small>
                  Already have an account?{" "}
                  <Link to="/" className="login-link">
                    Log in
                  </Link>
                </small>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRegister;
