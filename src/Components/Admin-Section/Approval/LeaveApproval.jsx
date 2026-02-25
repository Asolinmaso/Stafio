  import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle, FaFilter, FaEdit, FaTimesCircle } from "react-icons/fa";
import "./LeaveApproval.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import illustration from "../../../assets/Formsbro.png";
import tick from "../../../assets/tickicon.png";
import axios from "axios";
import { getCurrentSession } from "../../../utils/sessionManager";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "Approve" | "Reject"
  const [approvalReason, setApprovalReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");

  const session = getCurrentSession();
  const currentAdminId = session?.user_id;

  // Filter states
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const navigate = useNavigate();

  // REF for filter popup (outside click close)
  const filterPopupRef = useRef(null);

  useEffect(() => {
    const fetchLeaveapprova = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/leaveapproval",
        );
        setLeaves(response.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveapprova();
  }, []);

    // Auto-close success modal after 2 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        setShowModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  // Outside click close for filter popup
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        showFilterPopup &&
        filterPopupRef.current &&
        !filterPopupRef.current.contains(e.target)
      ) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFilterPopup]);

  const filteredAndSortedLeaves = leaves
    // Search by name
    .filter((leave) =>
      leave.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    // Filter by status
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus,
    )
    // Filter by leave type
    .filter((leave) =>
      filterLeaveType === "All" ? true : leave.type === filterLeaveType
    )
    // Filter by date
    .filter((leave) => (filterDate ? leave.requestDate === filterDate : true))
    // Sort by date
    .sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    const pendingCount = leaves.filter(
    (leave) => leave.status === "Pending",
  ).length;
  const approvedCount = leaves.filter(
    (leave) => leave.status === "Approved",
  ).length;
  const rejectedCount = leaves.filter(
    (leave) => leave.status === "Rejected",
  ).length;

  return (
    <div className="leave-approval-layout">
      <div className="rightside-logo">
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
                <strong>{pendingCount} Request Pending</strong>
                <br />
                Awaiting
              </p>
            </div>

            <div className="summary-card-leave">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>{approvedCount} Request Approved</strong>
                <br />
                In this Month
              </p>
            </div>

            <div className="summary-card-leave">
              <FaCheckCircle className="summary-icon" />
              <p>
                <strong>{rejectedCount} Request Rejected</strong>
                <br />
                In this Month
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
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

            {/* Search + Filter + Sort */}
            <div className="right-bottom-button">
              <input
                type="text"
                placeholder="🔍 Search..."
                className="right-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* FILTER WRAPPER (IMPORTANT) */}
              <div className="filter-wrapper" ref={filterPopupRef}>
                <button
                  className="right-btn-filter"
                  onClick={() => setShowFilterPopup((prev) => !prev)}
                >
                  <FaFilter /> Filter
                </button>

                {/* FILTER POPUP */}
                {showFilterPopup && (
                  <div className="filter-dropdown">
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
                          value={filterLeaveType}
                          onChange={(e) => setFilterLeaveType(e.target.value)}
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
                )}
              </div>

              {/* SORT */}
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

        {/* TABLE */}
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
                <td>
                  {leave.requestDate} <br />
                  <span
                    className={`status-badge ${getStatusClass(leave.status)}`}
                  >
                    {leave.status}
                  </span>
                </td>

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
          <div className="approve-modal-overlay" onClick={() => setShowModal(false)}>
            <div
              className="approve-leave-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="approve-modal-header-blue">
                <h3>Leave Approval</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="approve-form-modal-body">
                <form className="approve-leave-form">
                  <div className="form-left">
                    <div className="form-row">
                    <label>Employee ID:</label>
                    <input type="text" value={selectedLeave.id} readOnly />
                    </div>

                    <div className="form-row">
                    <label>Leave Type:</label>
                    <input type="text" value={selectedLeave.type} readOnly />
                    </div>

                    <div className="form-row">
                    <label>Date Of Leave:</label>
                    <div className="date-row">
                      <div className="date-item">
                        <p>From</p>
                        <input type="text" value={selectedLeave.from} readOnly />
                      </div>

                      <div className="date-item">
                        <p>To</p>
                        <input type="text" value={selectedLeave.to} readOnly />
                      </div>

                      <div className="date-item">
                        <p>Session</p>
                        <input
                          type="text"
                          value={selectedLeave.session}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                    <div className="form-row">
                    <label>Notify Others:</label>
                    <input type="text" value={selectedLeave.notify} readOnly />
                    <input
                      type="text"
                      className="document-input"
                      value={selectedLeave.document || "No File Uploaded"}
                      readOnly
                    />
                    </div>

                    <div className="form-row reason-row">
                    <label>Reason:</label>
                    <textarea value={selectedLeave.reason} readOnly />
                    </div>

                    {/* ACTION BUTTONS – ONLY IF PENDING */}
                    {selectedLeave.status === "Pending" && (
                      <div className="action-approve-modal-actions">
                        <button
                          type="button"
                          className="approve-apply-btn"
                          onClick={() => {
                            setActionType("Approval");
                            setShowReasonModal(true);
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="approve-cancel-btn"
                          onClick={() => {
                            setActionType("Rejection");
                            setShowReasonModal(true);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                  </div>

                  <div className="form-right">
                    <img src={illustration} alt="Leave Illustration" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}


        {showReasonModal && (
          <div className="reason-modal-overlay">
            <div className="reason-modal">
              <button
                className="reason-close-btn"
                onClick={() => setShowReasonModal(false)}
              >
                ×
              </button>
              <h3>Reason For {actionType}</h3>

              <textarea
                placeholder="Please fill out the note for approvals"
                maxLength={250}
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
              />
              <small>maximum character limit 250</small>
              <div className="reason-modal-actions">
                <button
                  className="reason-apply-btn"
                  onClick={async () => {
                    try {
                      const endpoint =
                        actionType === "Approval"
                          ? `http://127.0.0.1:5001/api/leave_requests/${selectedLeave.request_id}/approve`
                          : `http://127.0.0.1:5001/api/leave_requests/${selectedLeave.request_id}/reject`;
                      await axios.put(endpoint, {
                        reason: approvalReason,
                        approved_by: currentAdminId,
                      });
                      // Refresh the leave list
                      const response = await axios.get(
                        "http://127.0.0.1:5001/api/leaveapproval",
                      );
                      setLeaves(response.data);
                      setShowReasonModal(false);
                      setShowSuccessModal(true);
                      setApprovalReason("");
                    } catch (error) {
                      console.error(
                        "Error processing leave request:",
                        error.response.data.message,
                      );
                      alert(
                        `Failed to process leave request. Please try again.\n ${error.response.data.message}`,
                      );
                    }
                  }}
                >
                  Submit
                </button>
                <button
                  className="reason-cancel-btn"
                  onClick={() => setShowReasonModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS MODAL */}
        {showSuccessModal && (
          <div className="success-modal-overlay">
            <div className="success-modal">
              <button
                className="success-close-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  setShowModal(false);
                }}
              >
                ×
              </button>
              <img className="tick-icon" src={tick} alt="tick-icon" />
              <h2>Success</h2>
              <p>
                Leave {actionType === "Approval" ? "Approved" : "Rejected"}{" "}
                Successfully
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApproval;
