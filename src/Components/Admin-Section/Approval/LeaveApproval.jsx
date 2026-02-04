import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaFilter } from "react-icons/fa";
import "./LeaveApproval.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import illustration from "../../../assets/Formsbro.png";
import tick from "../../../assets/tickicon.png";

import axios from "axios";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "Approval" | "Rejection"
  const [approvalReason, setApprovalReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");

  // New states for filter popup
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaveapprova = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/leaveapproval"
        );
        setLeaves(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchLeaveapprova();
  }, []);

  const filteredAndSortedLeaves = leaves
    // SEARCH by employee name
    .filter((leave) =>
      leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // FILTER by status
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus
    )
    // FILTER by leave type
    .filter((leave) =>
      filterLeaveType === "All" ? true : leave.type === filterLeaveType
    )
    // FILTER by date
    .filter((leave) =>
      filterDate ? leave.requestDate === filterDate : true
    )
    // SORT by request date
    .sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="leave-approval-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Section */}
      <div className="leave-approval-main">
        <Topbar />
        <h2 className="page-title">Leave Approval</h2>

        {/* Leave Summary Cards */}
        <div className="leave-header">
          <div className="leave-summary">
            <div className="summary-card-leave">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>02 Request Pending</strong>
                <br />
                Awaiting
              </p>
            </div>
            <div className="summary-card-leave">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>07 Request Approved</strong>
                <br />
                In this Month
              </p>
            </div>
            <div className="summary-card-leave">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>03 Request Rejected</strong>
                <br />
                In this Month
              </p>
            </div>
          </div>

          {/* Right - Action Buttons */}
          <div className="right-leave-actions">
            <div className="right-top-buttons">
              <button className="right-btn-apply">All</button>
              <button
                onClick={() => navigate("/myTeam-LeaveApproval")}
                className="right-btn-regularization"
              >
                My Team
              </button>
            </div>
            <div className="right-bottom-button">
              <input
                type="text"
                placeholder="🔍 Search..."
                className="right-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* FILTER BUTTON */}
              <button
                className="right-btn-filter"
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

        {/* LEAVE TABLE */}
        <table className="leave-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Leave Dates</th>
              <th>Date Of Request</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedLeaves.map((leave, index) => (
              <tr key={index}>
                <td>
                  <div className="employee-info">
                    <div className="emp-avatar">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          leave.name
                        )}&background=random`}
                        alt={leave.name}
                      />
                    </div>
                    <div>
                      <p className="emp-name">{leave.name}</p>
                      <span className="emp-id">{leave.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {leave.type} <br />
                  <span>{leave.days}</span>
                </td>
                <td>{leave.dates}</td>
                <td>{leave.requestDate}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => {
                      setSelectedLeave(leave);
                      setShowModal(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <div className="showing">
            Showing{" "}
            <select>
              <option>07</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
          <div className="page-nav">
            <button>Prev</button>
            <span className="page-num">01</span>
            <button>Next</button>
          </div>
        </div>

        {/* LEAVE DETAILS MODAL */}
        {showModal && selectedLeave && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div
              className="apply-leave-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-blue">
                <h3>Leave Approval</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <form className="apply-leave-form">
                  <div className="form-left">
                    <label>Employee ID:</label>
                    <input type="text" value={selectedLeave.id} readOnly />
                    <label>Leave Type:</label>
                    <input type="text" value={selectedLeave.type} readOnly />
                    <label>Date Of Leave:</label>
                    <div className="date-row">
                      <input type="text" value={selectedLeave.from} readOnly />
                      <input type="text" value={selectedLeave.to} readOnly />
                      <input
                        type="text"
                        value={selectedLeave.session}
                        readOnly
                      />
                    </div>
                    <label>Notify Others:</label>
                    <input type="text" value={selectedLeave.notify} readOnly />
                    <label>Uploaded Document:</label>
                    <input
                      type="text"
                      value={selectedLeave.document || "No File Uploaded"}
                      readOnly
                    />
                    <label>Reason:</label>
                    <textarea value={selectedLeave.reason} readOnly />
                  </div>
                  <div className="form-right">
                    <img src={illustration} alt="Leave Illustration" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

       {/* FILTER POPUP */}
        {showFilterPopup && (
          <div className="modal-overlay" onClick={() => setShowFilterPopup(false)}>
            <div
              className="filter-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="filter-title">Filter</h4>

              <div className="filter-grid">
                {/* Name */}
                <div className="filter-field">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Please enter name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

              {/* Leave Type */}
              <div className="filter-field">
                <label>Leave Type</label>
                <select
                  value={filterLeaveType} // link with state
                  onChange={(e) => setFilterLeaveType(e.target.value)} // update state
                >
                  <option value="All">All</option>
                  <option value="Sick Leave">Sick</option>
                  <option value="Casual Leave">Casual</option>
                  <option value="Earned Leave">Earned</option>
                </select>
              </div>

              {/* Status */}
              <div className="filter-field">
                <label>Status</label>
                <select
                  value={filterStatus} // link with state
                  onChange={(e) => setFilterStatus(e.target.value)} // update state
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
                    setFilterLeaveType("All");
                    setFilterStatus("All");
                    setFilterDate("");
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


        {/* SUCCESS MODAL */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="success-modal">
              <button
                className="close-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  setShowModal(false);
                }}
              >
                ×
              </button>
              <img className="tick-icon" src={tick} alt="tick-icon" />
              <h2>Success</h2>
              <p>Action completed successfully</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApproval;
