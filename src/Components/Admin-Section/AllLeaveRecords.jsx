import React, { useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Dropdown,
} from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";
import { LeaveContext } from "../../context/LeaveContext"; // Adjust the path as needed

const AllLeaveRecords = () => {
  const { leaveRecords, setLeaveRecords } = useContext(LeaveContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const handleExport = () => {
    const headers = [
      "Employee ID",
      "Leave Type",
      "Start Date",
      "End Date",
      "Reason",
      "Status",
      "Department",
    ];
    const rows = filteredRecords.map((r) =>
      [
        r.employeeId,
        r.leaveType,
        r.startDate,
        r.endDate,
        r.reason,
        r.status || "Pending",
        r.department || "N/A",
      ].join(",")
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

  const handleDelete = (index) => {
    const updatedRecords = [...leaveRecords];
    updatedRecords.splice(index, 1);
    setLeaveRecords(updatedRecords);
  };

  const filteredRecords = leaveRecords.filter((record) => {
    const matchesSearch =
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? record.status === statusFilter : true;
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
                    placeholder="Search by ID or Reason"
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
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">Filter by Department</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                  </Form.Select>
                </Col>
              </Row>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee ID</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th className="text-center">Action</th>
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
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{record.employeeId}</td>
                        <td>{record.leaveType}</td>
                        <td>{record.startDate}</td>
                        <td>{record.endDate}</td>
                        <td>{record.reason}</td>
                        <td>{record.status || "Pending"}</td>
                        <td>{record.department || "N/A"}</td>
                        <td className="text-center align-middle">
                         
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default AllLeaveRecords;
