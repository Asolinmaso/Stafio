import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaCalendarAlt,
  FaChevronDown,
  FaDownload,
  FaSearch,
} from "react-icons/fa";
import "./AttendanceReport.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import group10 from "../../../assets/Group10.png";



export default function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [sortDays, setSortDays] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/attendancelist"
        );
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    // Function to update time & date every second
    const updateTime = () => {
      const now = new Date();

      // Format time (e.g., 9:01:09 AM)
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      // Format date (e.g., 10 Aug 2025)
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateTime(); // run immediately
    const timer = setInterval(updateTime, 1000); // update every 1s

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const filteredAttendance = attendanceData
    // SEARCH BY EMPLOYEE NAME
    .filter((record) =>
      record.employee.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // FILTER BY STATUS
    .filter((record) =>
      statusFilter === "All" ? true : record.status === statusFilter
    )

    // SORT BY LAST N DAYS

    .filter(() => true);


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


  return (
    <div className="att-report-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="att-report-main">
        <Topbar />

        {/* Header Section */}
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

        {/* Filter Bar */}
        <div className="att-report-filterbar">
          <div className="att-report-search-box">
            
            <input
              type="text"
              placeholder="Search by employee..."
              className="search-input2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="On Time">On Time</option>
            <option value="Late Login">Late Login</option>
            <option value="Absent">Absent</option>
          </select>

          <select
            className="sort-dropdown"
            value={sortDays}
            onChange={(e) => setSortDays(Number(e.target.value))}
          >
            <option value={5}>Last 5 Days</option>
            <option value={10}>Last 10 Days</option>
            <option value={20}>Last 20 Days</option>
          </select>
        </div>

        {/* Table Section */}
        <div className="att-report-table-wrapper">
          <div className="att-report-table-header">
            <h3>Attendance Overview</h3>
            <div className="header-controls">
              <div className="att-report-date">
                <FaCalendarAlt />
                <span>{currentDate}</span>
              </div>
              <button className="att-report-download-btn">
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
              {filteredAttendance .length > 0 ? (
                filteredAttendance .map((record, index) => {
                  const statusClass = record.status
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <tr key={index}>
                      <td>{record.id}</td>
                      <td>{record.employee}</td>
                      <td>{record.role}</td>
                      <td>
                        <span className={`att-report-status ${statusClass}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.date}</td>
                      <td className={`att-report-time ${statusClass}`}>
                        {record.checkIn}
                      </td>
                      <td className={`att-report-time ${statusClass}`}>
                        {record.checkOut}
                      </td>
                      <td>{record.workHours}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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