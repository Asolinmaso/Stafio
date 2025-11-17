// ApplyLeave.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import axios from "axios";
import EmployeeSidebar from ".././EmployeeSidebar";
import "./ApplyLeave.css";
import { useNavigate } from "react-router-dom";

const LeaveRequestForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    num_days: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [variant, setVariant] = useState("success");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (!userId || role !== "employee") {
      setResponseMessage(
        "Please log in as an employee before applying for leave."
      );
      setVariant("danger");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5001/leave_requests",
        {
          ...formData,
          user_id: localStorage.getItem("userId"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Role": localStorage.getItem("role"),
            "X-User-ID": localStorage.getItem("userId"),
          },
        }
      );

      setVariant("success");
      setResponseMessage(res.data.message);

      // Reset form
      setFormData({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
        num_days: "",
      });

      // Refresh dashboard when request submitted
      window.dispatchEvent(new Event("leaveRequestUpdated"));

      // Redirect back to My Leave page
      setTimeout(() => {
        navigate("/my-leave");
      }, 1500);
    } catch (err) {
      setVariant("danger");
      setResponseMessage(
        err?.response?.data?.message || "An error occurred."
      );
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <div className="main-content">
        <div className="apply-leave-container">
          <Card className="apply-leave-card p-4">
            <h3 className="text-center text-primary mb-4">
              Leave Request Form
            </h3>

            {responseMessage && (
              <Alert variant={variant} className="text-center">
                {responseMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Leave Type ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="leave_type_id"
                      value={formData.leave_type_id}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Number of Days</Form.Label>
                    <Form.Control
                      type="number"
                      name="num_days"
                      value={formData.num_days}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button type="submit" className="mt-3 w-100">
                Submit Request
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
