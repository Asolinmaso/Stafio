import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaCalendarAlt, FaTimes } from "react-icons/fa";
import "./Attendance.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import group10 from "../../../assets/Group10.png";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  // ✅ ONLY CHANGE: date picker state
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // days filter
  const [sortDays, setSortDays] = useState(7);

  // NEW: sort order
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest

  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter modal states
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDays, setFilterDays] = useState("Last 7 Days");

  // Calendar (From / To)
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const filterButtonRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch attendance data
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

  // ✅ ONLY CHANGE: set today as default date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    setSelectedDate(today);
  }, []);

  // ✅ ONLY CHANGE: format date like "07 Feb 2026"
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Convert string date (like "2025-02-07") to Date object safely
  const toDateObj = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  // Convert record.date (backend) safely
  const parseRecordDate = (recordDate) => {
    const d = new Date(recordDate);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  const handleApplyFilter = () => {
    setSearchTerm(filterName);
    setStatusFilter(filterStatus);

    const daysMap = {
      "Last 5 Days": 5,
      "Last 7 Days": 7,
      "Last 10 Days": 10,
      "Last 20 Days": 20,
    };

    setSortDays(daysMap[filterDays] || 7);
    setShowFilterModal(false);
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterStatus("All");
    setFilterDays("Last 7 Days");
    setFilterFromDate("");
    setFilterToDate("");

    setSearchTerm("");
    setStatusFilter("All");
    setSortDays(7);
    setSortOrder("newest");

    // ✅ ONLY CHANGE: reset date also
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  };

  const filteredAttendance = attendanceData
    // SEARCH BY EMPLOYEE NAME
    .filter((record) =>
      record.employee?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // FILTER BY STATUS
    .filter((record) =>
      statusFilter === "All" ? true : record.status === statusFilter
    )

    // FILTER BY FROM-TO DATE
    .filter((record) => {
      const recordDate = parseRecordDate(record.date);
      if (!recordDate) return true;

      const from = toDateObj(filterFromDate);
      const to = toDateObj(filterToDate);

      // If user didn't select from/to, skip that check
      if (from && recordDate < from) return false;

      // To date should include full day
      if (to) {
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        if (recordDate > toEnd) return false;
      }

      return true;
    })

    // FILTER BY LAST N DAYS
    .filter((record) => {
      const recordDate = parseRecordDate(record.date);
      if (!recordDate) return true;

      const today = new Date();
      const daysDifference = Math.floor(
        (today - recordDate) / (1000 * 60 * 60 * 24)
      );

      return daysDifference <= sortDays;
    })

    // SORT BY NEWEST / OLDEST
    .sort((a, b) => {
      const dateA = parseRecordDate(a.date);
      const dateB = parseRecordDate(b.date);

      if (!dateA || !dateB) return 0;

      if (sortOrder === "newest") {
        return dateB - dateA; // newest first
      } else {
        return dateA - dateB; // oldest first
      }
    });

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
            <button
              ref={filterButtonRef}
              className="attendance-filter-button"
              onClick={() => setShowFilterModal(!showFilterModal)}
            >
              <FaFilter /> Filter
            </button>

            {/* ✅ NEW SORT DROPDOWN */}
            <select
              className="sort-dropdown"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort By : Newest</option>
              <option value="oldest">Sort By : Oldest</option>
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

              {/* ✅ ONLY CHANGE: DATE PICKER ACCESS */}
              <div
                className="date-picker"
                style={{ cursor: "pointer" }}
                onClick={() => dateInputRef.current.click()}
              >
                <FaCalendarAlt />
                <span>{formatDisplayDate(selectedDate)}</span>

                {/* hidden input */}
                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ display: "none" }}
                />
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
                          ?.toLowerCase()
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

      {/* Filter Dropdown */}
      {showFilterModal && (
        <>
          <div
            className="filter-dropdown-overlay"
            onClick={() => setShowFilterModal(false)}
          />

          <div className="filter-dropdown-container">
            <div className="filter-dropdown-header">
              <h3>Filter</h3>

              <button
                className="filter-dropdown-close"
                onClick={() => setShowFilterModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="filter-dropdown-body">
              <div className="filter-dropdown-field">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter employee name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </div>

              <div className="filter-dropdown-row">
                <div className="filter-dropdown-field">
                  <label>Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="On Time">On Time</option>
                    <option value="Late Login">Late Login</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <div className="filter-dropdown-field">
                  <label>Days</label>
                  <select
                    value={filterDays}
                    onChange={(e) => setFilterDays(e.target.value)}
                  >
                    <option value="Last 5 Days">Last 5 Days</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 10 Days">Last 10 Days</option>
                    <option value="Last 20 Days">Last 20 Days</option>
                  </select>
                </div>
              </div>

              {/* ✅ WORKING CALENDAR FILTER */}
              <div className="filter-dropdown-row">
                <div className="filter-dropdown-field">
                  <label>From</label>
                  <input
                    type="date"
                    value={filterFromDate}
                    onChange={(e) => setFilterFromDate(e.target.value)}
                  />
                </div>

                <div className="filter-dropdown-field">
                  <label>To</label>
                  <input
                    type="date"
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="filter-dropdown-footer">
              <button
                className="filter-dropdown-reset"
                onClick={handleResetFilter}
              >
                Reset
              </button>

              <button
                className="filter-dropdown-apply"
                onClick={handleApplyFilter}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;
