import React, { useState, useEffect, useRef } from "react";
import "./MyRegularization.css";
import { FaEdit, FaTimesCircle, FaFilter } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import illustration from "../../../assets/timemgnt.png";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";

export default function MyRegularization() {
  const [showModal, setShowModal] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);
  
  const regularizationData = [
    {
      id: 1,
      attendanceType: "Present",
      date: "11-07-2025/Full Day",
      reason: "Forgot Clock Out",
      status: "Pending",
    },
    {
      id: 2,
      attendanceType: "Present",
      date: "11-07-2025/Half Day(AN)",
      reason: "Forgot Clock In",
      status: "Approved",
    },
    {
      id: 3,
      attendanceType: "Present",
      date: "11-07-2025/Full Day",
      reason: "Forgot Clock Out",
      status: "Approved",
    },
    {
      id: 4,
      attendanceType: "Present",
      date: "11-07-2025/Full Day",
      reason: "Forgot Clock Out",
      status: "Approved",
    },
    {
      id: 5,
      attendanceType: "Present",
      date: "11-07-2025/Full Day",
      reason: "Forgot Clock Out",
      status: "Approved",
    },
  ];
  
  const navigate = useNavigate();

  const filteredAndSortedLeaves = regularizationData
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus
    );

  const handleResetFilter = () => {
    setFilterName("");
    setFilterLeaveType("All");
    setFilterStatus("All");
  };

  const handleApplyFilter = () => {
    setShowFilterPopup(false);
  };

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showFilterPopup &&
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterPopup]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div className="layout">
      <div className="rightside-logo">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="regularization-container">
        <Topbar />
<<<<<<< HEAD
        <h2 className="page-title">Regularization Listing</h2>
=======
        <h2 className="page-title">My Regularization Listing</h2>
>>>>>>> origin/ajith-frontend

        {/* Action Buttons */}
        <div className="regularization-actions">
          <button
            className="btn-regularization-add"
            onClick={() => setShowModal(true)}
          >
            + Add Regularization
          </button>
          <button
            className="btn-my-leaves"
            onClick={() => navigate("/admin-my-leave")}
          >
            My Leaves
          </button>
          
          {/* Filter Button with Dropdown */}
          <div className="filter-wrapper" style={{ position: 'relative' }}>
            <button
              ref={filterButtonRef}
              className="right-butn-filters"
              onClick={() => setShowFilterPopup(!showFilterPopup)}
            >
              <FaFilter /> Filter
            </button>

            {/* Filter Dropdown */}
            {showFilterPopup && (
              <div ref={filterRef} className="filter-dropdown-box">
                {/* Header */}
                <div className="filter-popup-header">
                  <h3>Filter</h3>
                  <button
                    className="filter-popup-close"
                    onClick={() => setShowFilterPopup(false)}
                  >
                    <IoClose />
                  </button>
                </div>

                {/* Body */}
                <div className="filter-popup-body">
                  {/* Name Field */}
                  <div className="filter-field">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Please enter name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </div>

                  {/* Leave Type and Status Row */}
                  <div className="filter-row">
                    <div className="filter-field">
                      <label>Leave Type</label>
                      <select
                        value={filterLeaveType}
                        onChange={(e) => setFilterLeaveType(e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day(FN)">Half Day(FN)</option>
                        <option value="Half Day(AN)">Half Day(AN)</option>
                      </select>
                    </div>

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
                </div>

                {/* Footer */}
                <div className="filter-popup-footer">
                  <button className="filter-reset-btn" onClick={handleResetFilter}>
                    Reset
                  </button>
                  <button className="filter-apply-btn" onClick={handleApplyFilter}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regularization Table */}
        <div className="regularization-table">
          <table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Attendance Type</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLeaves.map((row, index) => (
                <tr key={row.id}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td>{row.attendanceType}</td>
                  <td>{row.date}</td>
                  <td>{row.reason}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        row.status === "Approved"
                          ? "approved"
                          : row.status === "Pending"
                          ? "pending"
                          : "rejected"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="action-icons">
                    <FaEdit className="edit-icon" />
                    <FaTimesCircle className="delete-icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span>Showing</span>
          <select>
            <option>07</option>
            <option>10</option>
            <option>15</option>
          </select>
          <div className="page-controls">
            <button>Prev</button>
            <button className="active">01</button>
            <button>Next</button>
          </div>
        </div>

        {/* Add Regularization Modal */}
{/* Add Regularization Modal */}
{showModal && (
  <div className="regularization-overlay">
    <div className="regularization-modal-exact">
      {/* Header */}
      <div className="regularization-header-exact">
        <h3>Add Regularization</h3>
        <button
          className="regularization-close-exact"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="regularization-body-exact">
        <div className="regularization-form-exact">
          {/* Left Form Section */}
          <div className="regularization-left-exact">
            <div className="form-row-exact">
              <label>Employee ID:</label>
              <input type="text" defaultValue="Aiswarya(100234)" />
            </div>

            <div className="form-row-exact">
              <label>Leave Type:</label>
              <select>
                <option>Full Day</option>
                <option>Half Day (FN)</option>
                <option>Half Day (AN)</option>
              </select>
            </div>

            <div className="form-row-exact">
              <label>Select Date:</label>
              <div className="date-input-wrapper-exact">
                <input type="text" placeholder="DD-MM-YYYY" />
                <span className="calendar-icon-exact">📅</span>
              </div>
            </div>

            <div className="form-row-exact">
              <label>Attendance</label>
              <select>
                <option>Present</option>
                <option>Absent</option>
              </select>
            </div>

            <div className="form-row-exact">
              <label>Reason:</label>
              <div className="textarea-wrapper-exact">
                <textarea
                  placeholder="ex: Forgot to Clock In"
                  maxLength={30}
                ></textarea>
                <span className="char-count-exact">30/30</span>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="regularization-right-exact">
            <img src={illustration} alt="Regularization Illustration" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="regularization-footer-exact">
        <button
          className="regularization-submit-exact"
          onClick={() => setShowModal(false)}
        >
          Submit
        </button>
        <button
          className="regularization-cancel-exact"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}