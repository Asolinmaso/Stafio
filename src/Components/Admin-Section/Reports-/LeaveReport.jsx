import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import "./LeaveReport.css";
import AdminSidebar from "../AdminSidebar";
import { Container, Row, Col, Card } from "react-bootstrap";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import AttendanceCard from "../Dashboard/AttendanceCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function LeaveReport() {
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5001/api/employeeslist");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };

    fetchEmployees();
  }, []);

  const leaveSummary = [
    { type: "Casual Leave", days: "6/7 Day(s)", color: "casual" },
    { type: "Annual Leave", days: "7/8 Day(s)", color: "annual" },
    { type: "Sick Leave", days: "3/5 Day(s)", color: "sick" },
    { type: "LOP", days: "0", color: "lop" },
  ];

  const attendanceDataSets = {
    months: [
      { label: "Jan", value: 95 },
      { label: "Feb", value: 90 },
      { label: "Mar", value: 86 },
      { label: "Apr", value: 92 },
      { label: "May", value: 88 },
    ],
    weeks: [
      { label: "W1", value: 85 },
      { label: "W2", value: 88 },
      { label: "W3", value: 90 },
      { label: "W4", value: 92 },
    ],
    days: [
      { label: "Mon", value: 90 },
      { label: "Tue", value: 85 },
      { label: "Wed", value: 88 },
      { label: "Thu", value: 92 },
      { label: "Fri", value: 95 },
    ],
  };

  return (
    <div className="leave-report-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="leave-report-main">
        <Topbar />

        {/* Page Header */}
        <div className="leave-report-header">
          <h2>Leave Report</h2>
          <select
            className="leave-report-dropdown"
            value={selectedEmployeeName}
            onChange={(e) => setSelectedEmployeeName(e.target.value)}
          >
            <option value="">Select Employee</option>

            {employees.map((emp) => (
              <option key={emp.id} value={emp.name}>
                {emp.name} ({emp.empId})
              </option>
            ))}
          </select>
        </div>

        {/* Leave Summary Cards */}
        <div className="leave-summary-container">
          {leaveSummary.map((leave, idx) => (
            <div key={idx} className={`leave-summary-card ${leave.color}`}>
              <div className="leave-icon-wrapper">
                <div className="leave-icon">✓</div>
              </div>
              <div className="leave-content">
                <div className="leave-days">{leave.days}</div>
                <div className="leave-type">{leave.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Leave Chart */}
        <Col md={4} className="attendance-graph">
          <AttendanceCard dataSets={attendanceDataSets} />
        </Col>
      </div>
    </div>
  );
}
