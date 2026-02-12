import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Spinner,
} from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5001";

const AllLeaveRecords = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // Fetch leave records from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recordsRes, deptRes] = await Promise.all([
          axios.get(`${API_BASE}/api/all_leave_records`, {
            headers: {
              "X-User-Role": "admin",
              "X-User-ID": localStorage.getItem("userId") || "1",
            },
          }),
          axios.get(`${API_BASE}/api/departments`),
        ]);

        setLeaveRecords(recordsRes.data);
        setDepartments(deptRes.data);
      } catch (error) {
        console.error("Error fetching leave records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const headers = [
      "Employee Name",
      "Leave Type",
      "Start Date",
      "End Date",
      "Days",
      "Reason",
      "Status",
      "Department",
    ];
    const rows = filteredRecords.map((r) =>
      [
        r.employeeName,
        r.leaveType,
        r.startDate,
        r.endDate,
        r.days,
        r.reason,
        r.status || "Pending",
        r.department || "N/A",
      ].join(","),
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "leave_records.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = leaveRecords.filter((record) => {
    const matchesSearch =
      (record.employeeName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (record.reason?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (record.leaveType?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      );

    const matchesStatus = statusFilter
      ? record.status?.toLowerCase() === statusFilter.toLowerCase()
      : true;
    const matchesDepartment = departmentFilter
      ? record.department === departmentFilter
      : true;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div style={{ marginLeft: "240px", width: "100%", padding: "20px" }}>
        <Container fluid>
          <Row className="mb-3">
            <Col>
              <h4 className="mb-0">All Leave Records</h4>
            </Col>
            <Col className="text-end">
              <Button variant="success" onClick={handleExport}>
                Export Records
              </Button>
            </Col>
          </Row>

          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Search by Name, Type or Reason"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Filter by Status</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                    <option value="pending">Pending</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">Filter by Department</option>
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee Name</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No leave records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((record, index) => (
                        <tr key={record.id || index}>
                          <td>{index + 1}</td>
                          <td>{record.employeeName}</td>
                          <td>{record.leaveType}</td>
                          <td>{record.startDate}</td>
                          <td>{record.endDate}</td>
                          <td>{record.days}</td>
                          <td>{record.reason || "-"}</td>
                          <td>
                            <span
                              className={`badge bg-${
                                record.status === "approved"
                                  ? "success"
                                  : record.status === "declined"
                                    ? "danger"
                                    : "warning"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td>{record.department || "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default AllLeaveRecords;
