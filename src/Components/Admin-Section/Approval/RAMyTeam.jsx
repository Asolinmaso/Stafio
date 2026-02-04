import React, { useState, useEffect } from "react";
import "./RAMyTeam.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import axios from "axios";

export default function RegularizationApproval() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  /* 🔹 FILTER POPUP STATE (ADDED ONLY) */
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  useEffect(() => {
    const fetchMyTeamRA = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/myteamra");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchMyTeamRA();
  }, []);

  const navigate = useNavigate();

  const filteredAndSortedLeaves = data
    .filter((leave) =>
      leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus
    )
    .sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="regularization-page">
      <div className="rightside-logo">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>

      <AdminSidebar />

      <div className="regularization-main">
        <Topbar />

        <div className="regularization-container">
          <div className="regularization-header">
            <div className="header-top">
              <h2>Regularization Approval My Team</h2>
            </div>

            <div className="header-bottom">
              {/* Left tabs */}
              <div className="left-tabs">
                <button
                  className="tab-btn"
                  onClick={() => navigate("/regularization-approval")}
                >
                  All
                </button>
                <button className="tab-btn active">My Team</button>
              </div>

              {/* Right controls */}
              <div className="right-controls">
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  className="right-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* 🔹 FILTER BUTTON */}
                <button
                  className="right-butn-filterr"
                  onClick={() => setShowFilterPopup(true)}
                >
                  <FaFilter /> Filter
                </button>

                <select
                  className="right-sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="Newest">Sort By : Newest</option>
                  <option value="Oldest">Sort By : Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* 🔽 FILTER POPUP */}
          {showFilterPopup && (
            <div
              className="modal-overlay"
              onClick={() => setShowFilterPopup(false)}
            >
              <div
                className="filter-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="filter-title">Filter</h3>

                <div className="filter-grid">
                  {/* NAME */}
                  <div className="filter-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Please enter name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* ATTENDANCE TYPE (CHANGED) */}
                  <div className="filter-field">
                    <label>Attendance Type</label>
                    <select>
                      <option value="All">All</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>

                  {/* STATUS */}
                  <div className="filter-field">
                    <label>Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="filter-actions">
                  <button
                    className="reset-btn"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("All");
                    }}
                  >
                    Reset
                  </button>

                  <button
                    className="apply-btn"
                    onClick={() => setShowFilterPopup(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="table-container">
            <table className="regularization-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Regularization Date</th>
                  <th>Attendance Type</th>
                  <th>Date Of Request</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedLeaves.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-info">
                        <img src={emp.img} alt={emp.name} />
                        <div>
                          <p className="emp-name">{emp.name}</p>
                          <span>{emp.empId}</span>
                        </div>
                      </div>
                    </td>
                    <td>{emp.regDate}</td>
                    <td>{emp.attendance}</td>
                    <td>
                      <div className="request-status">
                        <span>{emp.requestDate}</span>
                        <p className={`status-badge ${emp.status.toLowerCase()}`}>
                          {emp.status}
                        </p>
                      </div>
                    </td>
                    <td>
                      <button className="view-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <div className="showing">
              Showing <select><option>07</option></select>
            </div>
            <div className="page-btns">
              <button className="prev">Prev</button>
              <button className="page active">01</button>
              <button className="next">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
