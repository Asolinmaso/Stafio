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
import axios from "axios";
import group10 from "../../../assets/Group10.png";


export default function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/attendancelist");
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <div className="att-report-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="att-report-main">
        <Topbar />

        {/* Header Section */}
        <div className="att-report-header">
          <h2>Attendance Report</h2>
          <select className="att-report-dropdown">
            <option>Aiswarya (100539)</option>
          </select>
        </div>

        {/* Filter Bar */}
        <div className="att-report-filterbar">
          <div className="att-report-search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search" />
          </div>

          <button className="att-report-filter-btn">
            <FaFilter /> Filter
          </button>

          <div className="att-report-sort">
            <span>Sort By : Last 7 Days</span>
            <FaChevronDown />
          </div>
        </div>

        {/* Table Section */}
        <div className="att-report-table-wrapper">
          <div className="att-report-table-header">
            <h3>Attendance Overview</h3>
            <div className="header-controls">
              <div className="header-report-search">
                <FaSearch className="header-search-icon" />
                <input type="text" placeholder="Search..." />
              </div>
              <div className="att-report-date">
                <FaCalendarAlt />
                <span>10 Aug 2025</span>
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
              {attendanceData.length > 0 ? (
                attendanceData.map((record, index) => {
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
