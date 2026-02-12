import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import EmployeeSidebar from "./EmployeeSidebar";
import Topbar from "./Topbar";
import axios from "axios";
import {
  FaFileAlt,
  FaUpload,
  FaCheck,
  FaTimes,
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import "./EmployeeDocuments.css";

const API_BASE = "http://127.0.0.1:5001";

const EmployeeDocuments = () => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    document_type: "",
    file_name: "",
    description: "",
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const userId =
        localStorage.getItem("employee_user_id") ||
        sessionStorage.getItem("current_user_id");

      const response = await axios.get(
        `${API_BASE}/api/documents?user_id=${userId}`,
      );
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      const userId =
        localStorage.getItem("employee_user_id") ||
        sessionStorage.getItem("current_user_id");

      await axios.post(`${API_BASE}/api/documents`, {
        user_id: parseInt(userId),
        document_type: uploadForm.document_type,
        file_name: uploadForm.file_name,
        description: uploadForm.description,
      });

      setShowUploadModal(false);
      setUploadForm({ document_type: "", file_name: "", description: "" });
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to upload document");
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await axios.delete(`${API_BASE}/api/documents/${docId}`);
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    }
  };

  const documentTypes = [
    { value: "offer_letter", label: "Offer Letter" },
    { value: "id_proof", label: "ID Proof (Aadhaar/PAN)" },
    { value: "address_proof", label: "Address Proof" },
    { value: "education", label: "Educational Certificate" },
    { value: "experience", label: "Experience Letter" },
    { value: "payslip", label: "Previous Payslip" },
    { value: "photo", label: "Photo" },
    { value: "other", label: "Other" },
  ];

  // Group documents by type
  const verifiedCount = documents.filter((d) => d.is_verified).length;
  const pendingCount = documents.filter((d) => !d.is_verified).length;

  if (loading) {
    return (
      <div className="d-flex">
        <div className="sidebar">
          <EmployeeSidebar />
        </div>
        <div className="documents-content flex-grow-1 p-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <EmployeeSidebar />
      </div>

      {/* Main Content */}
      <div className="documents-content flex-grow-1 p-4">
        <Topbar />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="header-text mb-0">My Documents</h2>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <FaUpload className="me-2" /> Upload Document
          </Button>
        </div>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card
              className="summary-card shadow-sm border-0"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Total Documents</h6>
                    <h3 className="mb-0">{documents.length}</h3>
                  </div>
                  <FaFileAlt size={40} opacity={0.6} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="summary-card shadow-sm border-0"
              style={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              }}
            >
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Verified</h6>
                    <h3 className="mb-0">{verifiedCount}</h3>
                  </div>
                  <FaCheck size={40} opacity={0.6} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="summary-card shadow-sm border-0"
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            >
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Pending Verification</h6>
                    <h3 className="mb-0">{pendingCount}</h3>
                  </div>
                  <FaTimes size={40} opacity={0.6} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Documents Table */}
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Uploaded Documents</h5>
          </Card.Header>
          <Card.Body>
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Document Type</th>
                  <th>File Name</th>
                  <th>Description</th>
                  <th>Uploaded On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <tr key={doc.id}>
                      <td>{index + 1}</td>
                      <td>
                        <Badge bg="secondary">
                          {documentTypes.find(
                            (t) => t.value === doc.document_type,
                          )?.label || doc.document_type}
                        </Badge>
                      </td>
                      <td>{doc.file_name}</td>
                      <td>{doc.description || "-"}</td>
                      <td>
                        {doc.created_at
                          ? new Date(doc.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <Badge bg={doc.is_verified ? "success" : "warning"}>
                          {doc.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          title="Download"
                        >
                          <FaDownload />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(doc.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      <FaFileAlt size={40} className="mb-2 text-secondary" />
                      <p>No documents uploaded yet</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowUploadModal(true)}
                      >
                        Upload Your First Document
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Document Type</Form.Label>
              <Form.Select
                value={uploadForm.document_type}
                onChange={(e) =>
                  setUploadForm({
                    ...uploadForm,
                    document_type: e.target.value,
                  })
                }
              >
                <option value="">Select Type</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter file name (e.g., aadhaar_card.pdf)"
                value={uploadForm.file_name}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, file_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Add a description..."
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!uploadForm.document_type || !uploadForm.file_name}
          >
            <FaUpload className="me-2" /> Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeDocuments;
