import React, { useState, useEffect } from "react";
import { FaFilter, FaCalendarAlt, FaDownload } from "react-icons/fa";
import "./AttendanceReport.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import axios from "axios";
import group10 from "../../../assets/Group10.png";

export default function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  /* FETCH ATTENDANCE */
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5001/api/attendancelist")
      .then((res) => setAttendanceData(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* FETCH EMPLOYEES */
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5001/api/employeeslist")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* DEFAULT DATE */
  useEffect(() => {
    const now = new Date();
    setSelectedDate(now.toISOString().split("T")[0]);
  }, []);

  /* FILTERED DATA */
  const filteredAttendance = attendanceData
    .filter((r) =>
      r.employee?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((r) =>
      selectedEmployeeName ? r.employee === selectedEmployeeName : true
    )
    .filter((r) => {
      if (!selectedDate) return true;

      const recordDate = new Date(r.date);
      const pickedDate = new Date(selectedDate);

      return (
        recordDate.getDate() === pickedDate.getDate() &&
        recordDate.getMonth() === pickedDate.getMonth() &&
        recordDate.getFullYear() === pickedDate.getFullYear()
      );
    });

  /* DOWNLOAD FUNCTION */
  const handleDownload = () => {
    if (filteredAttendance.length === 0) {
      alert("No data available to download");
      return;
    }

    const headers = [
      "ID",
      "Employee",
      "Role",
      "Status",
      "Date",
      "Check-in",
      "Check-out",
      "Work hours",
    ];

    const rows = filteredAttendance.map((r) => [
      r.id,
      r.employee,
      r.role,
      r.status,
      r.date,
      r.checkIn,
      r.checkOut,
      r.workHours,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `attendance_report_${new Date().toISOString().split("T")[0]}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="att-report-layout">
      <div className="rightside-logo">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>

      <AdminSidebar />

      <div className="att-report-main">
        <Topbar />

        <div className="att-report-header">
          <h2>Attendance Report</h2>

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

        <div className="att-report-table-wrapper">
          <div className="att-report-table-header">
            <h3>Attendance Overview</h3>

            <div className="header-controls">
              <input
                type="text"
                className="att-header-search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="att-report-date">
                <FaCalendarAlt />
                <input
                  type="date"
                  className="att-date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <button
                className="att-report-download-btn"
                onClick={handleDownload}
              >
                <FaDownload /> Download
              </button>
            </div>
          </div>

          <table className="att-report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Work hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((r, i) => (
                <tr key={i}>
                  <td>{r.id}</td>
                  <td>{r.employee}</td>
                  <td>{r.role}</td>
                  <td>{r.status}</td>
                  <td>{r.date}</td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td>{r.workHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="att-report-pagination">
          <div className="att-report-showing">
            <span>Showing</span>
            <select>
              <option>05</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
          <div className="att-report-page-controls">
            <button>Prev</button>
            <button className="active">01</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}