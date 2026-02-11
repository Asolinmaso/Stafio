import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import Topbar from "./Topbar";
import { FaBullhorn, FaPaperPlane, FaUsers, FaClock } from "react-icons/fa";

const API_BASE = "http://127.0.0.1:5001";

const AdminBroadCast = () => {
  const [loading, setLoading] = useState(true);
  const [broadcasts, setBroadcasts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_audience: "all",
    send_notifications: true,
  });

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/broadcast`);
      setBroadcasts(response.data);
    } catch (error) {
      console.error("Error fetching broadcasts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const adminId =
        localStorage.getItem("admin_user_id") ||
        sessionStorage.getItem("current_user_id");
      await axios.post(`${API_BASE}/api/broadcast`, formData, {
        headers: { "X-User-ID": adminId },
      });

      setShowModal(false);
      setFormData({
        title: "",
        message: "",
        target_audience: "all",
        send_notifications: true,
      });
      fetchBroadcasts();
    } catch (error) {
      console.error("Error creating broadcast:", error);
      alert("Failed to send broadcast");
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 p-4" style={{ marginLeft: "240px" }}>
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: "240px",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Topbar />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold">Broadcasts</h2>
            <p className="text-muted">Send announcements to all employees</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaBullhorn className="me-2" /> New Broadcast
          </Button>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card
              className="shadow-sm border-0"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Total Broadcasts</h6>
                    <h3 className="mb-0">{broadcasts.length}</h3>
                  </div>
                  <FaBullhorn size={40} opacity={0.6} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="shadow-sm border-0"
              style={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              }}
            >
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">For All Users</h6>
                    <h3 className="mb-0">
                      {
                        broadcasts.filter((b) => b.target_audience === "all")
                          .length
                      }
                    </h3>
                  </div>
                  <FaUsers size={40} opacity={0.6} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="shadow-sm border-0"
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Active</h6>
                    <h3 className="mb-0">{broadcasts.length}</h3>
                  </div>
                  <FaClock size={40} opacity={0.6} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Broadcasts List */}
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Recent Broadcasts</h5>
          </Card.Header>
          <Card.Body>
            {broadcasts.length > 0 ? (
              <Table bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Audience</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {broadcasts.map((broadcast, index) => (
                    <tr key={broadcast.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{broadcast.title}</strong>
                      </td>
                      <td>{broadcast.message}</td>
                      <td>
                        <Badge
                          bg={
                            broadcast.target_audience === "all"
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {broadcast.target_audience}
                        </Badge>
                      </td>
                      <td>
                        {broadcast.created_at
                          ? new Date(broadcast.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <FaBullhorn size={50} className="text-secondary mb-3" />
                <p className="text-muted">No broadcasts yet</p>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Send Your First Broadcast
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* New Broadcast Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaBullhorn className="me-2" /> New Broadcast
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter broadcast title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your message..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Target Audience</Form.Label>
                  <Form.Select
                    value={formData.target_audience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_audience: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Users</option>
                    <option value="employees">Employees Only</option>
                    <option value="admins">Admins Only</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 mt-4">
                  <Form.Check
                    type="checkbox"
                    label="Send as notification"
                    checked={formData.send_notifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        send_notifications: e.target.checked,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            <FaPaperPlane className="me-2" /> Send Broadcast
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminBroadCast;
