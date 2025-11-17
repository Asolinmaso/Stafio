import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import "./Attendance.css";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css"; // ✅ Needed for the filter icon

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/attendance");
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchAttendance();
  }, []);

  // ---- RETURN STARTS HERE ----
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <EmployeeSidebar />
      </div>

      {/* Main Content */}
      <div className="attendance-content flex-grow-1 p-4">
        <Topbar />
        <h2 className="mb-4 header-text">My Attendance</h2>

        {/* Summary Cards */}
        <Row className="summary mb-4">
          <Col md={3}>
            <Card className="summary-cards present">
              <Card.Body>
                <div className="summary-icon-circle1">
                  <FaCheck className="summary-icon" />
                </div>
                <Card.Title className="summary-title">2</Card.Title>
                <h3 className="summary-subtitle">Working Days</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-cards absent">
              <Card.Body>
                <div className="summary-icon-circle2">
                  <FaCheck className="summary-icon" />
                </div>
                <Card.Title className="summary-title">1</Card.Title>
                <h3 className="summary-subtitle">Total Leaves</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-cards leave">
              <Card.Body>
                <div className="summary-icon-circle3">
                  <FaCheck className="summary-icon" />
                </div>
                <Card.Title className="summary-title">1</Card.Title>
                <h3 className="summary-subtitle">Late Login</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-cards total">
              <Card.Body>
                <div className="summary-icon-circle4">
                  <FaCheck className="summary-icon" />
                </div>
                <Card.Title className="summary-title">3</Card.Title>
                <h3 className="summary-subtitle">On Time Login</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search + Filter + Sort Bar */}
        <div className="search-filter-sort d-flex justify-content-end mb-3 gap-2">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            className="custom-input"
          />

          <div className="filter-wrapper position-relative">
            <Form.Select className="custom-select">
              <option value="">Filter by Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </Form.Select>
            <span className="filter-icon position-absolute end-0 me-3 top-50 translate-middle-y text-secondary">
              <i className="bi bi-funnel"></i>
            </span>
          </div>

          <Form.Select className="custom-select">
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </Form.Select>
        </div>

        {/* Attendance Table */}
        <Card className="shadow-sm">
          <Card.Body>
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Attendance Overview</h5>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Quick Search..."
                  style={{ width: "200px" }}
                />
                <Form.Control type="date" style={{ width: "160px" }} />
                <Button variant="info" className="myleave-btn text-white fw-semibold">
                  My Leave Report
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Sl</th>
                  <th>Late</th>
                  <th>Overtime</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Work hours</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => {
                  // Status color
                  let statusClass =
                    record.status === "On Time"
                      ? "text-success fw-semibold"
                      : record.status === "Absent"
                      ? "text-danger fw-semibold"
                      : "text-warning fw-semibold";

                  // Check-in/out color
                  let checkClass =
                    record.status === "Absent"
                      ? "text-danger fw-semibold"
                      : record.status === "Late Login"
                      ? "text-warning fw-semibold"
                      : "text-primary";

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{record.late}</td>
                      <td>{record.overtime}</td>
                      <td className={statusClass}>{record.status}</td>
                      <td>{record.date}</td>
                      <td className={checkClass}>{record.checkIn}</td>
                      <td className={checkClass}>{record.checkOut}</td>
                      <td>{record.workHours}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="d-flex align-items-center gap-2">
                <span>Showing</span>
                <Form.Select size="sm" style={{ width: "80px" }}>
                  <option>06</option>
                  <option>10</option>
                  <option>20</option>
                </Form.Select>
              </div>
              <div>
                <Button size="sm" variant="light" className="me-2">
                  Prev
                </Button>
                <Button size="sm" variant="primary" className="nextbtn">
                  Next
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;
