import React, { useState, useEffect } from "react";
import { FaFilter, FaCalendarAlt, FaDownload } from "react-icons/fa";
import "./AttendanceReport.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import axios from "axios";
import group10 from "../../../assets/Group10.png";

export default function AttendanceReport() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [sortDays, setSortDays] = useState(7);

  /* FILTER POPUP STATES */
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [popupName, setPopupName] = useState("");
  const [popupStatus, setPopupStatus] = useState("On Time");
  const [popupSortDays, setPopupSortDays] = useState(7);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [statusFilter, setStatusFilter] = useState("On Time");
  const [employees, setEmployees] = useState([]);

  // ✅ NEW: date picker value
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

  /* DATE */
  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );

    // ✅ default for date input (yyyy-mm-dd)
    setSelectedDate(now.toISOString().split("T")[0]);
  }, []);

  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  };

  /* FILTER LOGIC */
  const filteredAttendance = attendanceData
    .filter((r) =>
      r.employee?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (r) =>
        r.status?.toLowerCase().trim() === statusFilter.toLowerCase().trim()
    )
    .filter((r) =>
      selectedEmployeeName ? r.employee === selectedEmployeeName : true
    )
    .filter((r) => {
      const today = new Date();
      const rd = parseDate(r.date);
      if (!rd) return true;
      return (today.getTime() - rd.getTime()) / (1000 * 60 * 60 * 24) <= sortDays;
    })
    .filter((r) => {
      if (!fromDate && !toDate) return true;
      const rd = parseDate(r.date);
      if (!rd) return true;
      if (fromDate && rd < new Date(fromDate)) return false;
      if (toDate && rd > new Date(toDate + "T23:59:59")) return false;
      return true;
    })
    // ✅ NEW: selectedDate filter
    .filter((r) => {
      if (!selectedDate) return true;
      const rd = parseDate(r.date);
      if (!rd) return true;

      const picked = new Date(selectedDate);
      return (
        rd.getDate() === picked.getDate() &&
        rd.getMonth() === picked.getMonth() &&
        rd.getFullYear() === picked.getFullYear()
      );
    });

  /* FILTER ACTIONS */
  const handleResetFilters = () => {
    setPopupName("");
    setPopupStatus("On Time");
    setPopupSortDays(7);
    setFromDate("");
    setToDate("");
  };

  const handleApplyFilters = () => {
    setSearchTerm(popupName);
    setStatusFilter(popupStatus);
    setSortDays(popupSortDays);
    setShowFilterPopup(false);
  };

  return (
    <div className="att-report-layout">
      <div className="rightside-logo">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>

      <AdminSidebar />

      <div className="att-report-main">
        <Topbar />

        {/* HEADER */}
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

        {/* FILTER BAR */}
        <div className="att-report-filterbar">
          <div className="att-report-search-box">
            <input
              type="text"
              placeholder="🔍 Search..."
              className="search-input2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* FILTER BUTTON */}
          <div style={{ position: "relative" }}>
            <button
              className="att-report-filter-btn"
              onClick={() => setShowFilterPopup(!showFilterPopup)}
            >
              <FaFilter /> Filter
            </button>

            {showFilterPopup && (
              <div className="att-filter-popup">
                <h3 className="att-filter-title">Filter</h3>

                <label className="att-filter-label">Name</label>
                <input
                  className="att-filter-input"
                  value={popupName}
                  onChange={(e) => setPopupName(e.target.value)}
                />

                <div className="att-filter-row">
                  <div className="att-filter-col">
                    <label>Status</label>
                    <select
                      className="att-filter-select"
                      value={popupStatus}
                      onChange={(e) => setPopupStatus(e.target.value)}
                    >
                      <option value="On Time">On Time</option>
                      <option value="Late Login">Late Login</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>

                  <div className="att-filter-col">
                    <label>Days</label>
                    <select
                      className="att-filter-select"
                      value={popupSortDays}
                      onChange={(e) => setPopupSortDays(Number(e.target.value))}
                    >
                      <option value={5}>Last 5 Days</option>
                      <option value={10}>Last 10 Days</option>
                      <option value={20}>Last 20 Days</option>
                    </select>
                  </div>
                </div>

                <div className="att-filter-row">
                  <div className="att-filter-col">
                    <label>From</label>
                    <input
                      type="date"
                      className="att-filter-select"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>

                  <div className="att-filter-col">
                    <label>To</label>
                    <input
                      type="date"
                      className="att-filter-select"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="att-filter-footer">
                  <button className="att-filter-reset" onClick={handleResetFilters}>
                    Reset
                  </button>
                  <button className="att-filter-apply" onClick={handleApplyFilters}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SORT */}
          <select
            className="sort-dropdown"
            value={sortDays}
            onChange={(e) => setSortDays(Number(e.target.value))}
          >
            <option value="Newest">Sort By : Newest</option>
            <option value="Oldest">Sort By : Oldest</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="att-report-table-wrapper">
          <div className="att-report-table-header">
            <h3>Attendance Overview</h3>

            {/* ✅ UPDATED: search + calendar + download */}
            <div className="header-controls">
              {/* Search bar (right side) */}
              <input
                type="text"
                className="att-header-search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Calendar working */}
              <div className="att-report-date">
                <FaCalendarAlt />
                <input
                  type="date"
                  className="att-date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
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