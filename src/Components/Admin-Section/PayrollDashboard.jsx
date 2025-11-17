// src/components/AdminPayrollDashboard.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AdminPayrollDashboard.css";
import AdminSidebar from "./AdminSidebar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPayrollDashboard = () => {
  // Payroll summary data
  const payrollSummary = [
    {
      title: "Company Balance",
      value: "$123,350.00",
      change: "30% ↑ since last month",
      color: "success",
    },
    {
      title: "Company Expense",
      value: "$55,000.00",
      change: "10% ↑ since last month",
      color: "danger",
    },
    {
      title: "Upcoming Salary Amount",
      value: "$4,350.00",
      change: "3,121 employees",
      color: "primary",
    },
    {
      title: "Upcoming Salary Date",
      value: "July 5, 2024",
      change: "In 4 days",
      color: "warning",
    },
  ];

  // Chart data for Payroll Expenses
  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ],
    datasets: [
      {
        label: "Payroll Expenses",
        data: [200, 400, 350, 600, 450, 700, 650, 500, 300, 400, 350],
        backgroundColor: "#19BDE8",
        borderRadius: 6,
      },
    ],
  };

  // Employee table data (stateful to update when marked as Paid)
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Aisha Doe",
      role: "HR Manager",
      hours: 160,
      salary: 1200,
      status: "Paid",
    },
    {
      id: 2,
      name: "Chukwuemeka",
      role: "Software Eng.",
      hours: 176,
      salary: 2000,
      status: "Pending",
    },
    {
      id: 3,
      name: "Mohammed",
      role: "Marketing Ex.",
      hours: 150,
      salary: 1500,
      status: "Paid",
    },
    {
      id: 4,
      name: "Afolayan",
      role: "UI/UX Designer",
      hours: 168,
      salary: 1800,
      status: "Pending",
    },
  ]);

  // Function to mark employee as Paid
  const markAsPaid = (id) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === id ? { ...emp, status: "Paid" } : emp
      )
    );
  };

  return (
    <div className="d-flex" style={{ marginLeft: "250px" }}>
      <AdminSidebar />
    <Container fluid className="p-4 dashboard-container">
      {/* Top Navbar */}
      <Row className="align-items-center mb-4">
        <Col md={6}>
          <h3 className="dashboard-title">Hi, Admin</h3>
          <p className="dashboard-subtitle">Manage your Payroll with talent</p>
        </Col>
        <Col md={4}>
          <Form.Control
            type="search"
            placeholder="Search something here..."
            className="search-bar"
          />
        </Col>
        <Col md={2} className="text-end">
          <Button className="custom-btn">Create Reports</Button>
        </Col>
      </Row>

      {/* Payroll Summary Cards */}
      <Row className="mb-4">
        {payrollSummary.map((item, index) => (
          <Col md={3} key={index}>
            <Card className="summary-card shadow-sm">
              <Card.Body>
                <Card.Title className="summary-title">{item.title}</Card.Title>
                <h5 className="summary-value">{item.value}</h5>
                <small className={`text-${item.color}`}>{item.change}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Payroll Expenses Chart + Employment Status */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm chart-card">
            <Card.Header className="card-header-custom">
              Payroll Expenses
            </Card.Header>
            <Card.Body>
              <Bar data={chartData} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm chart-card">
            <Card.Header className="card-header-custom">
              Employment Status
            </Card.Header>
            <Card.Body>
              <p>Total Employees: 150</p>
              <p>
                <Badge bg="info">Intern: 21</Badge>
              </p>
              <p>
                <Badge bg="success">Permanent: 84</Badge>
              </p>
              <p>
                <Badge bg="warning">Probationary: 45</Badge>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Employee Payroll Table */}
      <Row>
        <Col>
          <Card className="shadow-sm chart-card">
            <Card.Header className="card-header-custom">
              Employee Payroll
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Hours</th>
                    <th>Total Salary</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.role}</td>
                      <td>{emp.hours}</td>
                      <td>${emp.salary}</td>
                      <td>
                        <Badge
                          bg={emp.status === "Paid" ? "success" : "warning"}
                        >
                          {emp.status}
                        </Badge>
                      </td>
                      <td>
                        {emp.status === "Pending" ? (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => markAsPaid(emp.id)}
                          >
                            Mark as Paid
                          </Button>
                        ) : (
                          <Button size="sm" variant="success" disabled>
                            Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default AdminPayrollDashboard;
