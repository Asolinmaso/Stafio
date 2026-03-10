import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import "./Attendance.css";
/* no react-icons needed for cards */
import axios from "axios";

const Attendance = () => {
  const navigate = useNavigate();

  const [allData, setAllData]         = useState([]);
  const [stats, setStats]             = useState({ working_days: 0, total_leaves: 0, late_logins: 0, on_time_logins: 0 });
  const [search, setSearch]           = useState("");
  const [quickSearch, setQuickSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortRange, setSortRange]     = useState("7days");
  const [filterDate, setFilterDate]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId =
          localStorage.getItem("employee_user_id") ||
          sessionStorage.getItem("current_user_id");

        const [attRes, statsRes] = await Promise.all([
          axios.get("http://127.0.0.1:5001/api/attendance",       { headers: { "X-User-ID": userId } }),
          axios.get("http://127.0.0.1:5001/api/attendance_stats", { headers: { "X-User-ID": userId } }),
        ]);
        setAllData(attRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Attendance fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const resetPage = () => setCurrentPage(1);

  const filteredData = useMemo(() => {
    let data = [...allData];
    const now = new Date();

    if (sortRange === "7days") {
      const cut = new Date(now); cut.setDate(now.getDate() - 7);
      data = data.filter(r => new Date(r.date) >= cut);
    } else if (sortRange === "30days") {
      const cut = new Date(now); cut.setDate(now.getDate() - 30);
      data = data.filter(r => new Date(r.date) >= cut);
    }

    const statusMap = { present: "On Time", absent: "Absent", late: "Late Login" };
    if (filterStatus) data = data.filter(r => r.status === statusMap[filterStatus]);
    if (filterDate)   data = data.filter(r => r.date === filterDate);

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r => r.date?.toLowerCase().includes(q) || r.status?.toLowerCase().includes(q));
    }
    if (quickSearch.trim()) {
      const q = quickSearch.toLowerCase();
      data = data.filter(r =>
        r.date?.toLowerCase().includes(q)      ||
        r.status?.toLowerCase().includes(q)    ||
        r.checkIn?.toLowerCase().includes(q)   ||
        r.checkOut?.toLowerCase().includes(q)  ||
        r.workHours?.toLowerCase().includes(q) ||
        String(r.late || "").toLowerCase().includes(q) ||
        String(r.overtime || "").toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    return data;
  }, [allData, sortRange, filterStatus, filterDate, search, quickSearch]);

  const totalPages    = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const safePage      = Math.min(currentPage, totalPages);
  const paginatedData = filteredData.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const statusClass = s => s === "On Time" ? "att__status-green" : s === "Absent" ? "att__status-red" : "att__status-yellow";
  const timeClass   = s => s === "Absent" ? "att__time-red" : s === "Late Login" ? "att__time-yellow" : "att__time-blue";

  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar"><EmployeeSidebar /></div>

      <div className="att__page">
        <Topbar />
        <h2 className="att__heading">My Attendance</h2>

        {/* ── Summary Cards ── */}
        <div className="att__cards">
          {/* Card 1 — black circle */}
          <div className="att__card">
            <svg className="att__card-svg" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="#1a1a2e" strokeWidth="2"/>
              <polyline points="11,18 16,23 25,13" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="att__card-num">{stats.working_days}</div>
            <div className="att__card-lbl">Worked Days</div>
          </div>

          {/* Card 2 — red circle */}
          <div className="att__card">
            <svg className="att__card-svg" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="#dc3545" strokeWidth="2"/>
              <polyline points="11,18 16,23 25,13" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="att__card-num">{stats.total_leaves}</div>
            <div className="att__card-lbl">Total Leaves</div>
          </div>

          {/* Card 3 — yellow/gold circle */}
          <div className="att__card">
            <svg className="att__card-svg" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="#e8a800" strokeWidth="2"/>
              <polyline points="11,18 16,23 25,13" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="att__card-num">{stats.late_logins}</div>
            <div className="att__card-lbl">Late Login</div>
          </div>

          {/* Card 4 — green circle */}
          <div className="att__card">
            <svg className="att__card-svg" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="#28a745" strokeWidth="2"/>
              <polyline points="11,18 16,23 25,13" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="att__card-num">{stats.on_time_logins}</div>
            <div className="att__card-lbl">On Time Login</div>
          </div>
        </div>

        {/* ── Top Controls ── */}
        <div className="att__topbar">

          {/* Search */}
          <div className="att__search-box">
            <svg className="att__sb-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="6" stroke="#999" strokeWidth="1.7"/>
              <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="#999" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="att__input att__search-input"
              value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
            />
          </div>

          {/* Filter */}
          <div className="att__filter-box">
            <svg className="att__fn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4h18L13 13v7l-2-1v-6L3 4z" stroke="#000" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="att__filter-lbl">Filter</span>
            <select
              className="att__filter-overlay"
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); resetPage(); }}
            >
              <option value="">All</option>
              <option value="present">On Time</option>
              <option value="absent">Absent</option>
              <option value="late">Late Login</option>
            </select>
          </div>

          {/* Sort */}
          <div className="att__sort-box">
            <select
              className="att__sort-sel"
              value={sortRange}
              onChange={e => { setSortRange(e.target.value); resetPage(); }}
            >
              <option value="7days">Sort By : Last 7 Day</option>
              <option value="30days">Sort By : Last 30 Days</option>
              <option value="all">Sort By : All Time</option>
            </select>
            <svg className="att__sort-chevron" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="5,7 10,13 15,7" stroke="#555" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

        </div>

        {/* ── Overview Card ── */}
        <div className="att__overview">

          {/* Card Header */}
          <div className="att__overview-hdr">
            <span className="att__overview-title">Attendance Overview</span>
            <div className="att__overview-actions">

              {/* Quick Search */}
              <div className="att__qs-box">
                <svg className="att__qs-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="#bbb" strokeWidth="1.8"/>
                  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Quick Search..."
                  className="att__qs-input"
                  value={quickSearch}
                  onChange={e => { setQuickSearch(e.target.value); resetPage(); }}
                />
              </div>

              {/* Date Picker */}
              <div className="att__dp-box">
                <svg className="att__dp-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="17" rx="2" stroke="#888" strokeWidth="1.7"/>
                  <line x1="3" y1="9" x2="21" y2="9" stroke="#888" strokeWidth="1.7"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="#888" strokeWidth="1.7" strokeLinecap="round"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="#888" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                <input
                  type="date"
                  className="att__dp-input"
                  value={filterDate}
                  onChange={e => { setFilterDate(e.target.value); resetPage(); }}
                />
              </div>

              {/* My Leave Report — navigates to /employee-attendance-report */}
              <button
                className="att__leave-btn"
                onClick={() => navigate("/employee-attendance-report")}
              >
                <svg className="att__leave-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="3" y1="6"  x2="21" y2="6"  stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="18" x2="21" y2="18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="7"  cy="6"  r="2.5" fill="#0dcaf0" stroke="#fff" strokeWidth="2"/>
                  <circle cx="17" cy="12" r="2.5" fill="#0dcaf0" stroke="#fff" strokeWidth="2"/>
                  <circle cx="10" cy="18" r="2.5" fill="#0dcaf0" stroke="#fff" strokeWidth="2"/>
                </svg>
                My Leave Report
              </button>

            </div>
          </div>

          {/* Table */}
          <div className="att__table-wrap">
            <table className="att__table">
              <thead>
                <tr className="att__thead-tr">
                  <th>Sl</th>
                  <th>Late</th>
                  <th>Overtime</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Work hours</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="att__empty">No records found</td>
                  </tr>
                ) : paginatedData.map((r, i) => (
                  <tr key={i} className="att__tbody-tr">
                    <td>{String((safePage - 1) * rowsPerPage + i + 1).padStart(2, "0")}</td>
                    <td>{r.late || "-"}</td>
                    <td>{r.overtime || "-"}</td>
                    <td><span className={statusClass(r.status)}>{r.status}</span></td>
                    <td>{formatDate(r.date)}</td>
                    <td className={timeClass(r.status)}>{r.checkIn}</td>
                    <td className={timeClass(r.status)}>{r.checkOut}</td>
                    <td className={r.status === "Late Login" ? "att__time-red" : ""}>{r.workHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="att__footer">
            <div className="att__showing">
              <span>Showing</span>
              <select
                className="att__showing-sel"
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); resetPage(); }}
              >
                <option value={6}>06</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="att__pag">
              <button
                className="att__pag-prev"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >Prev</button>

              <button className="att__pag-num">
                {String(safePage).padStart(2, "0")}
              </button>

              <button
                className="att__pag-next"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >Next</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Attendance;