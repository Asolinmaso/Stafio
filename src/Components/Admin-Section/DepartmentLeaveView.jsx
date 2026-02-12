import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Card,
  Spinner,
} from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5001";

const DepartmentLeaveView = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/departments`);
        setDepartments(["All", ...response.data.map((d) => d.name)]);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments(["All"]);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch leave records when department changes
  useEffect(() => {
    const fetchLeaveRecords = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE}/api/all_leave_records`;

        if (selectedDepartment !== "All") {
          url = `${API_BASE}/api/leave_by_department?department=${encodeURIComponent(selectedDepartment)}`;
        }

        const response = await axios.get(url, {
          headers: {
            "X-User-Role": "admin",
            "X-User-ID": localStorage.getItem("userId") || "1",
          },
        });
        setLeaveRecords(response.data);
      } catch (error) {
        console.error("Error fetching leave records:", error);
        setLeaveRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveRecords();
  }, [selectedDepartment]);

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
          <AdminSidebar />
        </Col>
        <Col md={10}>
          <Card className="mt-4 p-4">
            <h3 className="mb-4">Department-wise Leave Records</h3>
            <Form.Group controlId="departmentFilter" className="mb-3">
              <Form.Label>Select Department</Form.Label>
              <Form.Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRecords.length > 0 ? (
                    leaveRecords.map((record, index) => (
                      <tr key={record.id || index}>
                        <td>{record.employeeId}</td>
                        <td>{record.employeeName}</td>
                        <td>{record.department}</td>
                        <td>{record.leaveType}</td>
                        <td>{record.startDate}</td>
                        <td>{record.endDate}</td>
                        <td>{record.days}</td>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DepartmentLeaveView;
