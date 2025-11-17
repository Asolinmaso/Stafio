import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "./ForgotPasswordPopup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPasswordPopup = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  // Step 2 states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // -----------------------------
  // STEP 1 → CHECK EMAIL EXISTS
  // -----------------------------
  const handleEmailCheck = async () => {
    setErrorMsg("");

    try {
      const response = await fetch("http://127.0.0.1:5001/check_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.exists) {
        setStep(2); // go to next popup
      } else {
        setErrorMsg("Email not found in database.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    }
  };

  // -----------------------------------
  // STEP 2 → UPDATE USER PASSWORD IN DB
  // -----------------------------------
  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/update_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3); // go to success message
      } else {
        setErrorMsg(data.message || "Failed to update password.");
      }
    } catch (err) {
      setErrorMsg("Network error. Try again.");
    }
  };

  // -----------------------------
  // CLOSE ALL POPUPS
  // -----------------------------
  const handleCloseAll = () => {
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setStep(1);
    onClose();
  };

  return (
    <>
      {/* POPUP - 1 (Enter Email) */}
      <Modal show={show && step === 1} onHide={handleCloseAll} centered>
        <Modal.Body className="p-4">
          <h3 className="mb-3">Forgot password</h3>
          <p>Enter your email for verification. We will send a code.</p>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button className="w-100" onClick={handleEmailCheck}>
            CONTINUE
          </Button>
        </Modal.Body>
      </Modal>

      {/* POPUP - 2 (Enter New Password) */}
      <Modal show={show && step === 2} onHide={handleCloseAll} centered>
        <Modal.Body className="p-4">
          <h4 className="mb-3">Reset Password</h4>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form.Group className="mb-3" style={{ position: "relative" }}>
            <Form.Label>New Password</Form.Label>
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
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </Form.Group>

          <Form.Group className="mb-3"  style={{ position: "relative" }}>
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
                color: "#6c757d",
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

      {/* POPUP - 3 (Success Message) */}
      <Modal show={show && step === 3} onHide={handleCloseAll} centered>
        <Modal.Body className="p-4 text-center">
          <h4>Password Updated</h4>
          <p>Your password has been successfully updated.</p>

          <Button className="w-100 mt-3" onClick={handleCloseAll}>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ForgotPasswordPopup;
