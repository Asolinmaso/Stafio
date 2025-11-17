import React, { useState } from "react";
import { Container, Row, Col, Form, Table, Card } from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";

const DepartmentLeaveView = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  // 🔁 Replace this mock data with API or database later
  const leaveRecords = [
    {
      employeeId: "EMP001",
      name: "Alice",
      department: "IT",
      leaveType: "Sick Leave",
      startDate: "2025-07-10",
      endDate: "2025-07-12",
      status: "Approved",
    },
    {
      employeeId: "EMP002",
      name: "Bob",
      department: "HR",
      leaveType: "Casual Leave",
      startDate: "2025-07-15",
      endDate: "2025-07-16",
      status: "Pending",
    },
    {
      employeeId: "EMP003",
      name: "Charlie",
      department: "Finance",
      leaveType: "Earned Leave",
      startDate: "2025-07-20",
      endDate: "2025-07-22",
      status: "Approved",
    },
  ];

  const departments = ["All", "HR", "IT", "Finance", "Marketing", "Operations"];

  const filteredRecords =
    selectedDepartment === "All"
      ? leaveRecords
      : leaveRecords.filter((record) => record.department === selectedDepartment);

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

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.employeeId}</td>
                      <td>{record.name}</td>
                      <td>{record.department}</td>
                      <td>{record.leaveType}</td>
                      <td>{record.startDate}</td>
                      <td>{record.endDate}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DepartmentLeaveView;
