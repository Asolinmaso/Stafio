import React, { useState, useEffect } from "react";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import "./WhoIsOnLeave.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";

const API_BASE = "http://127.0.0.1:5001";

const WhoIsOnLeave = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch leave data from backend
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/api/who_is_on_leave`);
        setLeaveList(response.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setLeaveList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter leave list based on search
  const filteredLeaveList = leaveList.filter(
    (item) =>
      item.employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="whoisleave-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="whoisleave-main">
        <Topbar />

        <div className="whoisleave-header">
          <h2>Leave List</h2>
          <button className="whoisleave-filter-btn">
            <FaFilter /> Filter
          </button>
        </div>

        <div className="whoisleave-section">
          <div className="whoisleave-section-header">
            <h3>Employees On Leave</h3>
            <div className="whoisleave-controls">
              <input
                type="text"
                placeholder="🔍 Quick Search..."
                className="whoisleave-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="whoisleave-date">
                <FaCalendarAlt />
                <span>{currentDate}</span>
              </div>
              <button
                className="whoisleave-view-btn"
                onClick={() => navigate("/attendance")}
              >
                View Attendance
              </button>
            </div>
          </div>

          <table className="whoisleave-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>No Of Days</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredLeaveList.length > 0 ? (
                filteredLeaveList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.employee}</td>
                    <td>{item.type}</td>
                    <td>{item.from}</td>
                    <td>{item.to}</td>
                    <td className="whoisleave-days">{item.days}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No employees on leave
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="whoisleave-pagination">
          <div className="whoisleave-showing">
            <span>Showing</span>
            <select className="whoisleave-page-select">
              <option>05</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
          <div className="whoisleave-page-controls">
            <button className="whoisleave-page-btn">Prev</button>
            <button className="whoisleave-page-btn active">01</button>
            <button className="whoisleave-page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoIsOnLeave;
