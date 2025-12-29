import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaFilter, FaEdit, FaTimesCircle } from "react-icons/fa";
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
  const [actionType, setActionType] = useState(""); // "Approve" | "Reject"
  const [approvalReason, setApprovalReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Approved | Rejected
  const [sortOrder, setSortOrder] = useState("Newest"); // Newest | Oldest

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

  const navigate = useNavigate();

  const filteredAndSortedLeaves = leaves
    // SEARCH by employee name
    .filter((leave) =>
      leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // FILTER by status
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus
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
          {/* Left - Summary Cards */}
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

              <select
                className="right-butn-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

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
        {showModal && selectedLeave && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div
              className="apply-leave-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="modal-header-blue">
                <h3>Leave Approval</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              {/* Body */}
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

                    {/* ACTION BUTTONS – ONLY IF PENDING */}
                    {selectedLeave.status === "Pending" && (
                      <div className="modal-actions">
                        <button
                          type="button"
                          className="apply-btn"
                          onClick={() => {
                            setActionType("Approval");
                            setShowReasonModal(true);
                          }}
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="cancel-btn"
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

                  {/* Right Image */}
                  <div className="form-right">
                    <img src={illustration} alt="Leave Illustration" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showReasonModal && (
          <div className="modal-overlay">
            <div className="reason-modal">
              <button
                className="close-btn"
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

              <div className="modal-actions">
                <button
                  className="apply-btn"
                  onClick={() => {
                    setShowReasonModal(false);
                    setShowSuccessModal(true);
                  }}
                >
                  Submit
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setShowReasonModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
