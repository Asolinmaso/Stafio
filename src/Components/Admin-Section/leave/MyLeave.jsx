import React, { useState, useEffect, useRef } from "react";
import "./MyLeave.css";
import {
  FaCheckCircle,
  FaFilter,
  FaEdit,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import illustration from "../../../assets/Formsbro.png";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";

export default function Myleave() {
  const [showModal, setShowModal] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

  const leaveData = [
    {
      id: 1,
      type: "Sick Leave 1 Day(s)",
      date: "11-07-2025/Full Day",
      reason: "Hospital Case",
      requestDate: "11-07-2025",
      status: "Approved",
    },
    {
      id: 2,
      type: "Casual Leave 2 Day(s)",
      date: "12-07-2025/Full Day",
      reason: "Family Function",
      requestDate: "12-07-2025",
      status: "Approved",
    },
  ];

  const navigate = useNavigate();

  const filteredAndSortedLeaves = leaveData.filter((leave) =>
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
      <div className="myleave-container">
        <Topbar />
        <h2 className="page-title">My Leaves</h2>

        {/* Header Section */}
        <div className="leave-header">
          <div className="leave-summary">
            <div className="summary-card">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>6/7 Day(s)</strong>
                <br />
                Casual Leave
              </p>
            </div>
            <div className="summary-card">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>7/8 Day(s)</strong>
                <br />
                Annual Leave
              </p>
            </div>
            <div className="summary-card">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>3/5 Day(s)</strong>
                <br />
                Sick Leave
              </p>
            </div>
          </div>

          {/* Right - Buttons */}
          <div className="leave-actions">
            <div className="top-buttons">
              <button className="btn-apply" onClick={() => setShowModal(true)}>
                Apply Leave
              </button>
              <button
                className="btn-regularization"
                onClick={() => navigate("/admin-my-regularization")}
              >
                Regularization
              </button>
            </div>
            
            {/* Filter Button with Dropdown */}
            <div className="bottom-button" style={{ position: 'relative' }}>
              <button
                ref={filterButtonRef}
                className="btn-filter"
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
                          <option value="Casual Leave">Casual Leave</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Annual Leave">Annual Leave</option>
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
                    <button
                      className="filter-reset-btn"
                      onClick={handleResetFilter}
                    >
                      Reset
                    </button>
                    <button
                      className="filter-apply-btn"
                      onClick={handleApplyFilter}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="leave-table">
          <table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Leave Type</th>
                <th>Leave Dates</th>
                <th>Reason</th>
                <th>Date Of Request</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLeaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td>{leave.type}</td>
                  <td>{leave.date}</td>
                  <td>{leave.reason}</td>
                  <td>
                    {leave.requestDate}
                    <span className="status">{leave.status}</span>
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

        {/* Modal Popup */}
        {showModal && (
          <div className="modal-overlay">
            <div className="apply-leave-modal">
              <div className="modal-header-blue">
                <h3>Apply Leave</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  x
                </button>
              </div>

              <div className="modal-body">
                <form className="apply-leave-form">
                  <div className="form-left">
                    <label>Employee ID:</label>
                    <input type="text" />

                    <label>Leave Type:</label>
                    <select>
                      <option>Select</option>
                      <option>Casual Leave</option>
                      <option>Sick Leave</option>
                      <option>Annual Leave</option>
                    </select>

                    <label>Select Date:</label>
                    <div className="date-row">
                      <input type="date" />
                      <input type="date" />
                      <select>
                        <option>Full Day</option>
                        <option>Half Day (FN)</option>
                        <option>Half Day (AN)</option>
                      </select>
                    </div>

                    <label>Notify Others:</label>
                    <div className="notify-row">
                      <select>
                        <option>Team Lead</option>
                        <option>HR</option>
                      </select>
                      <button type="button" className="upload-btn">
                        <FaUpload /> Upload File
                      </button>
                    </div>

                    <label>Reason:</label>
                    <textarea
                      placeholder="ex: I am travelling to"
                      maxLength={30}
                    ></textarea>

                    <div className="modal-actions">
                      <button type="submit" className="apply-btn">
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="form-right">
                    <img src={illustration} alt="Leave Illustration" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}