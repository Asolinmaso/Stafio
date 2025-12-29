import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "./ForgotPasswordPopup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import tick from "../../assets/tickimage.png";

const ForgotPasswordPopup = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [timer, setTimer] = useState(60);

  // STEP 1 → SEND OTP
  const handleSendOtp = async () => {
    setErrorMsg("");
    setSuccessMsg(""); // 👈 clear previous success

    try {
      const response = await fetch("http://127.0.0.1:5001/forgot_send_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        setErrorMsg(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setErrorMsg("Network error. Try again.");
    }
  };
  useEffect(() => {
    if (step === 2) {
      setSuccessMsg("");
    }
  }, [step]);

  // -> Resend otp
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Allow clearing (backspace)
    if (value === "") {
      let newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));
      return;
    }

    // Allow only digits
    if (!/^\d$/.test(value)) return;

    let newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Move focus to next box
    if (index < 3) {
      e.target.nextSibling?.focus();
    }
  };

  useEffect(() => {
    if (step !== 2) return;

    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const handleResendOtp = async () => {
    setResendLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://127.0.0.1:5001/forgot_send_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to resend OTP");
        return;
      }

      setOtp("");
      setTimer(60);
      setSuccessMsg("New OTP sent to your email.");
    } catch (err) {
      setErrorMsg("Server error. Try again.");
    } finally {
      setResendLoading(false);
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = e.target.previousSibling;
      prevInput?.focus();
    }
  };

  // STEP 2 → VERIFY OTP
  const handleVerifyOtp = async () => {
    setErrorMsg("");

    try {
      const response = await fetch("http://127.0.0.1:5001/forgot_verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3); // go to reset password page
      } else {
        setErrorMsg(data.message || "Invalid OTP.");
      }
    } catch (err) {
      setErrorMsg("Network error.");
    }
  };

  // STEP 3 → RESET PASSWORD
  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4); // success page
      } else {
        setErrorMsg(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setErrorMsg("Network error. Try again.");
    }
  };

  // CLOSE POPUP
  const handleCloseAll = () => {
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    setErrorMsg("");
    setStep(1);
    onClose();
  };

  return (
    <>
      {/* STEP 1: ENTER EMAIL */}
      <Modal show={show && step === 1} onHide={handleCloseAll} centered>
        <Modal.Body className="p-4 forget-password">
          <h3 className="mb-3">Forgot Password</h3>
          <p>
            Enter your email for verification process,we will send 4 digits code
            to your email.
          </p>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>E mail</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button className="w-100" onClick={handleSendOtp}>
            CONTINUE
          </Button>
        </Modal.Body>
      </Modal>

      {/* STEP 2: ENTER OTP */}

      <Modal show={show && step === 2} onHide={handleCloseAll} centered>
        <Modal.Body className="otp-modal p-4 text-center">
          <h3 className="otp-title">Verification</h3>
          <p className="otp-subtitle">
            Enter your 4 digits code that you received on your email.
          </p>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          {/* OTP Boxes */}
          <div className="otp-inputs">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                value={otp[i] || ""}
                onChange={(e) => handleOtpChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="otp-timer">
            {timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : "00:00"}
          </div>

          {/* Continue Button */}
          <Button className="w-100 otp-btn" onClick={handleVerifyOtp}>
            VERIFY
          </Button>

          {/* Resend */}
          <p className="otp-resend-text">
            If you didn’t receive a code?
            <button
              className="resend-link"
              disabled={timer > 0 || resendLoading}
              onClick={handleResendOtp}
            >
              {resendLoading ? " Resending..." : " Resend"}
            </button>
          </p>
        </Modal.Body>
      </Modal>

      {/* STEP 3: RESET PASSWORD */}
      <Modal show={show && step === 3} onHide={handleCloseAll} centered>
        <Modal.Body className="p-4">
          <h4 className="mb-3">New Password</h4>
          <p className="new-pass-subtitle">
            Set the new Password for your account so you can login and access
            all features.
          </p>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form.Group className="mb-3" style={{ position: "relative" }}>
            <Form.Label>Enter new Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          <Form.Group className="mb-3" style={{ position: "relative" }}>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={showPassword1 ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword1(!showPassword1)}
              style={{
                position: "absolute",
                right: "10px",
                top: "70%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword1 ? <FaEye /> : <FaEyeSlash />}
            </span>
          </Form.Group>

          <Button className="w-100" onClick={handlePasswordUpdate}>
            UPDATE PASSWORD
          </Button>
        </Modal.Body>
      </Modal>

      {/* STEP 4: SUCCESS */}
      <Modal show={show && step === 4} onHide={handleCloseAll} centered>
        <Modal.Body className="success-modal p-4 text-center">
          {/* Tick Icon */}
          <div className="success-icon">
            <img src={tick} alt="Success" />
          </div>

          {/* Heading */}
          <h3 className="success-title">Successfully</h3>

          {/* Sub text */}
          <p className="success-subtitle">
            Your password has been reset successfully
          </p>

          {/* Continue Button */}
          <Button className="w-100 success-btn" onClick={handleCloseAll}>
            CONTINUE
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ForgotPasswordPopup;
