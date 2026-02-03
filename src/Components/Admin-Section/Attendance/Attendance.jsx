import React, { useState, useEffect } from "react";
import { FaFilter, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import "./Attendance.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import group10 from "../../../assets/Group10.png";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
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

  return (
    <div className="attendance-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="attendance-main">
        <Topbar />

        <div className="attendance-header">
          <h2>Attendance</h2>
          <div className="attendance-controls">
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
        </div>

        <div className="attendance-section">
          <div className="section-header">
            <h3>Attendance Overview</h3>
            <div className="section-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by employee..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="date-picker">
                <FaCalendarAlt />
                <span>{currentDate}</span>
              </div>
              <button
                className="who-is-on-leave-btn"
                onClick={() => navigate("/who-is-on-leave")}
              >
                Who Is On Leave
              </button>
            </div>
          </div>

          <table className="attendance-table">
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
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record, index) => (
                  <tr key={index}>
                    <td>{record.id}</td>
                    <td>{record.employee}</td>
                    <td>{record.role}</td>
                    <td>
                      <span
                        className={`status ${record.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td>{record.date}</td>
                    <td className="time-cell">{record.checkIn}</td>
                    <td className="time-cell">{record.checkOut}</td>
                    <td>{record.workHours}</td>
                  </tr>
                ))
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
        <div className="pagination1">
          <div className="showing-info">
            <span>Showing</span>
            <select className="page-size-select1">
              <option>05</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
          <div className="pagination-controls">
            <button className="page-btn">Prev</button>
            <button className="page-btn active">01</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;