import React, { useEffect, useRef, useState } from "react";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import "./WhoIsOnLeave.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";

const API_BASE = "http://127.0.0.1:5001";
const WhoIsOnLeave = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ Calendar state
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ IMPORTANT: date input ref
  const dateRef = useRef(null);

  // ✅ Filter popup state
  const [showFilter, setShowFilter] = useState(false);

  // ✅ Filter input states
  const [filterSearch, setFilterSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDuration, setFilterDuration] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const filterRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Live Date
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
    const updateDate = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setCurrentDate(date);
    };

    updateDate();
    const timer = setInterval(updateDate, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Outside click close
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleClearFilters = () => {
    setFilterSearch("");
    setFilterType("");
    setFilterDuration("");
    setFilterFromDate("");
    setFilterToDate("");
    setShowFilter(false);
  };

  const handleApplyFilters = () => {
    setShowFilter(false);
  };

  return (
    <div className="whoisleave-layout">
      <div className="rightside-logo">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>

      <AdminSidebar />

      <div className="whoisleave-main">
        <Topbar />

        {/* ===== Header ===== */}
        <div className="whoisleave-header">
          <h2>Leave List</h2>

          <div className="whoisleave-filter-wrapper" ref={filterRef}>
            <button
              className="whoisleave-filter-btn"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FaFilter /> Filter
            </button>

            {showFilter && (
              <div className="whoisleave-filter-popup">
                <div className="filter-popup-header">
                  <h3>Filter By</h3>
                  <button
                    className="filter-close-btn"
                    onClick={() => setShowFilter(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="filter-popup-body">
                  <div className="filter-group">
                    <label>Search</label>
                    <input
                      type="text"
                      placeholder="Search employee..."
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                  </div>

                  <div className="filter-row">
                    <div className="filter-group">
                      <label>Leave Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Duration</label>
                      <select
                        value={filterDuration}
                        onChange={(e) => setFilterDuration(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="1 Day">1 Day</option>
                        <option value="2 Days">2 Days</option>
                        <option value="3 Days">3 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="filter-row">
                    <div className="filter-group">
                      <label>From</label>
                      <div className="date-input-wrapper">
                        <input
                          type="date"
                          value={filterFromDate}
                          onChange={(e) => setFilterFromDate(e.target.value)}
                        />
                        <FaCalendarAlt className="date-icon" />
                      </div>
                    </div>

                    <div className="filter-group">
                      <label>To</label>
                      <div className="date-input-wrapper">
                        <input
                          type="date"
                          value={filterToDate}
                          onChange={(e) => setFilterToDate(e.target.value)}
                        />
                        <FaCalendarAlt className="date-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="filter-actions">
                  <button className="filter-clear" onClick={handleClearFilters}>
                    Reset
                  </button>
                  <button className="filter-apply" onClick={handleApplyFilters}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== Section ===== */}
        <div className="whoisleave-section">
          <div className="whoisleave-section-header">
            <h3>Employees On Leave</h3>

            <div className="whoisleave-controls">
              <input
                type="text"
                placeholder="🔍 Quick Search..."
                className="whoisleave-search"
              />

              {/* ✅ FIXED Calendar with working icon */}
              <div className="whoisleave-date-picker">
                <input
                  ref={dateRef}
                  type="date"
                  className="whoisleave-date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />

                <FaCalendarAlt
                  className="calendar-icon"
                  role="button"
                  tabIndex={0}
                  aria-label="Open calendar"
                  onClick={() => dateRef.current?.showPicker()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      dateRef.current?.showPicker();
                    }
                  }}
                />
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
              {leaveList.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.employee}</td>
                  <td>{item.type}</td>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td className="whoisleave-days">{item.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== Pagination ===== */}
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
