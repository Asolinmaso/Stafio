import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import "./LeaveReport.css";
import AdminSidebar from "../AdminSidebar";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import AttendanceCard from "../Dashboard/AttendanceCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5001";

export default function LeaveReport() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/employeeslist`);
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch leave balance when employee is selected
  useEffect(() => {
    if (!selectedEmployeeId) {
      setLeaveSummary([]);
      return;
    }

    const fetchLeaveBalance = async () => {
      setLoadingBalance(true);
      try {
        const res = await axios.get(
          `${API_BASE}/api/employee_leave_balance/${selectedEmployeeId}`,
          {
            headers: {
              "X-User-Role": "admin",
              "X-User-ID": localStorage.getItem("userId") || "1",
            },
          },
        );

        // Map API response to display format
        const colorMap = {
          "Casual Leave": "casual",
          "Annual Leave": "annual",
          "Sick Leave": "sick",
          LOP: "lop",
          "Earned Leave": "annual",
          "Maternity Leave": "casual",
        };

        const summary = res.data.map((item) => ({
          type: item.leaveType,
          days: `${item.remaining}/${item.allocated} Day(s)`,
          color: colorMap[item.leaveType] || "casual",
        }));

        setLeaveSummary(summary);
      } catch (err) {
        console.error("Error fetching leave balance", err);
        setLeaveSummary([]);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchLeaveBalance();
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEmployeeId(selectedId);

    const emp = employees.find((emp) => String(emp.id) === selectedId);
    setSelectedEmployeeName(emp ? emp.name : "");
  };

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
            value={selectedEmployeeId}
            onChange={handleEmployeeChange}
          >
            <option value="">Select Employee</option>

            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.empId})
              </option>
            ))}
          </select>
        </div>

        {/* Leave Summary Cards */}
        <div className="leave-summary-container">
          {loadingBalance ? (
            <div className="text-center w-100 py-4">
              <Spinner animation="border" size="sm" /> Loading leave balance...
            </div>
          ) : leaveSummary.length === 0 ? (
            <div className="text-center w-100 py-4 text-muted">
              {selectedEmployeeId
                ? "No leave data available"
                : "Select an employee to view leave balance"}
            </div>
          ) : (
            leaveSummary.map((leave, idx) => (
              <div key={idx} className={`leave-summary-card ${leave.color}`}>
                <div className="leave-icon-wrapper">
                  <div className="leave-icon">✓</div>
                </div>
                <div className="leave-content">
                  <div className="leave-days">{leave.days}</div>
                  <div className="leave-type">{leave.type}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Attendance Stats Card */}
        <div className="leave-report-card">
          <AttendanceCard
            title="Attendance"
            dataSets={attendanceDataSets}
            periodOptions={["months", "weeks", "days"]}
          />
        </div>
      </div>
    </div>
  );
}
