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
import teampluslogo from "../../assets/stafio-bg-dark.png";
import Registerlogo from "../../assets/registerlogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../../api/client";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import gicon from "../../assets/favicon.ico";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
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
  const [agree, setAgree] = useState(false);
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

    if (!formData.phone) {
      setError("Phone number required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      // ⭐ NORMAL REGISTRATION
      const res = await apiClient.post("/register", {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "admin",
      });

      setMessage(res.data?.message || "Registration successful!");

      // Reset form
      setFormData({
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
        email: "",
        role: "admin",
      });
      setStrength(0);
    } catch (err) {
      const apiMessage = err.response?.data?.message || "Registration failed.";
      setError(apiMessage);
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

  // ---------------------------
  // ⭐ Google Register
  // ---------------------------
  const handleGoogleRegister = async (tokenResponse) => {
    try {
      // Get Google profile
      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );

      const profile = await userInfoRes.json();

      const googleEmail = profile.email;
      const googleName = profile.name;

      // Send to backend for registration
      const res = await apiClient.post("/admin_google_register", {
        email: googleEmail,
        username: googleName,
        role: "admin",
      });

      setMessage(res.data?.message || "Google registration successful!");
      setError("");
    } catch (err) {
      setError("Google registration failed.");
    }
  };

  const googleRegister = useGoogleLogin({
    onSuccess: handleGoogleRegister,
    onError: () => setError("Google registration failed."),
  });

  return (
    <Container fluid className="admin-register-container">
      <Row className="vh-100">
        {/* ===== LEFT SIDE ===== */}
        <Col
          md={6}
          className="register-left d-flex flex-column align-items-center justify-content-center"
        >
          <img src={BGShape} alt="Background Shape" className="bg-shape" />

          <div className="register-left-content">
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
            <h3 className="mb-4">Sign Up</h3>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Please enter your name"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Please enter your phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // allow only numbers
                    if (value.length <= 10) {
                      handleChange({
                        target: { name: "phone", value },
                      });
                    }
                  }}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Phone number must be exactly 10 digits"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Please enter your email"
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
                      placeholder="Enter confirm password"
                      value={formData.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id="termsCheck"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                  style={{
                    width: "18px",
                    height: "18px",
                    marginTop:"-5px",
                    cursor: "pointer",
                    marginRight: "10px",
                    accentColor: "#19bde8",
                     // 🔵 Makes tick color BLUE
                  }}
                />

                <label htmlFor="termsCheck" style={{ margin: 0 }}>
                  I agree to all the{" "}
                  <span style={{ color: "#197ae8ff", cursor: "pointer",fontWeight:"600" }}>
                    Terms
                  </span>{" "}
                  &{" "}
                  <span style={{ color: "#197ae8ff", cursor: "pointer",fontWeight:"600" }}>
                    Conditions
                  </span>
                </label>
              </Form.Group>

              <Button variant="primary" type="submit" className="register-btn">
                Sign Up
              </Button>

              {/* -------- Google Register Button -------- */}
              <div className="text-center my-3">
                <button
                  type="button"
                  onClick={() => googleRegister()}
                  className="google-btn"
                >
                  <img
                    src={gicon}
                    alt="Google"
                    style={{ width: "20px", marginRight: "10px" }}
                  />
                  <span
                    style={{ color: "#19bde9", fontWeight: 600, fontSize: 18 }}
                  >
                    Continue with Google
                  </span>
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
