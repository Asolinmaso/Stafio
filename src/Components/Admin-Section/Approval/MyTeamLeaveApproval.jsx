import React, { useState, useEffect } from "react";
import "./MyTeamLeaveApproval.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import illustration from "../../../assets/Formsbro.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import tick from "../../../assets/tickicon.png";
import { getCurrentSession } from "../../../utils/sessionManager";

export default function MyTeamLeaveApproval() {
  const [leaveData, setLeaveData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "Approval" | "Rejection"
  const [approvalReason, setApprovalReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use the centralized session manager
  const session = getCurrentSession();
  const currentUserId = session?.user_id;
  const currentUserRole = session?.role;

  const fetchMyTeamLA = async () => {
    try {
      const headers = {};
      if (currentUserId) {
        headers["X-User-ID"] = currentUserId;
        headers["X-User-Role"] = currentUserRole || "admin";
      }

      console.log("Fetching team leave with headers:", headers);

      const response = await axios.get("http://127.0.0.1:5001/api/myteamla", { headers });
      setLeaveData(response.data);
    } catch (error) {
      console.error("Error fetching team leave data:", error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchMyTeamLA();
    }
  }, [currentUserId]);

  const handleSubmitAction = async () => {
    if (!selectedLeave) return;
    setLoading(true);
    try {
      const headers = {};
      if (currentUserId) headers["X-User-ID"] = currentUserId;

      const endpoint = actionType === "Approval"
        ? `http://127.0.0.1:5001/api/leave_requests/${selectedLeave.id}/approve`
        : `http://127.0.0.1:5001/api/leave_requests/${selectedLeave.id}/reject`;

      await axios.put(endpoint, {
        reason: approvalReason,
        approved_by: currentUserId
      }, { headers });

      setShowReasonModal(false);
      setShowSuccessModal(true);
      setApprovalReason("");

      // Auto close success modal
      setTimeout(() => {
        setShowSuccessModal(false);
        setShowModal(false);
      }, 2000);

      await fetchMyTeamLA();
    } catch (error) {
      console.error("Action error:", error);
      alert(error.response?.data?.message || "Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "status-approved";
    if (status === "Pending") return "status-pending";
    if (status === "Rejected") return "status-rejected";
    return "";
  };

  const filteredAndSortedLeaves = leaveData
    .filter((leave) =>
      leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus
    )
    .sort((a, b) => {
      const dateA = new Date(a.requestDate || a.request);
      const dateB = new Date(b.requestDate || b.request);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="myteam-layout">
      <div className="rightside-logo">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="myteam-main">
        <Topbar />
        <div className="myteam-page">
          <h2 className="myteam-title">My Team Leave Approval</h2>

          <div className="myteam-controls">
            <div className="filter-sort">
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

          <table className="myteam-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Leave Dates</th>
                <th>Date Of Request</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedLeaves.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="employee-info">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="emp-avatar"
                          onError={(e) => { e.target.src = `https://i.pravatar.cc/40?u=${item.empId}`; }}
                        />
                        <div className="emp-details">
                          <p className="emp-name">{item.name}</p>
                          <p className="emp-id">{item.empId}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {item.type} <br />
                      <span className="days">{item.days}</span>
                    </td>
                    <td>{item.date}</td>
                    <td>{item.request}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => {
                          setSelectedLeave(item);
                          setShowModal(true);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <div className="showing">
              Showing{" "}
              <select>
                <option>07</option>
                <option>10</option>
                <option>20</option>
              </select>
            </div>
            <div className="page-nav">
              <button className="page-btn">Prev</button>
              <button className="page-btn active">01</button>
              <button className="page-btn">Next</button>
            </div>
          </div>
        </div>

        {/* Leave Details Modal */}
        {showModal && selectedLeave && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="apply-leave-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-blue">
                <h3>Leave Approval</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <form className="apply-leave-form">
                  <div className="form-left">
                    <label>Employee ID:</label>
                    <input type="text" value={selectedLeave.empId} readOnly />

                    <label>Leave Type:</label>
                    <input type="text" value={selectedLeave.type} readOnly />

                    <label>Date Of Leave:</label>
                    <div className="date-row">
                      <input type="text" value={selectedLeave.from} readOnly />
                      <input type="text" value={selectedLeave.to} readOnly />
                      <input type="text" value={selectedLeave.session} readOnly />
                    </div>

                    <label>Notify Others:</label>
                    <input type="text" value={selectedLeave.notify} readOnly />

                    <label>Uploaded Document:</label>
                    <input type="text" value={selectedLeave.document || "No File Uploaded"} readOnly />

                    <label>Reason:</label>
                    <textarea value={selectedLeave.reason} readOnly />

                    {selectedLeave.status === "Pending" && (
                      <div className="modal-actions">
                        <button
                          type="button"
                          className="apply-btn"
                          onClick={() => { setActionType("Approval"); setShowReasonModal(true); }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => { setActionType("Rejection"); setShowReasonModal(true); }}
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

        {/* Reason Modal */}
        {showReasonModal && (
          <div className="modal-overlay">
            <div className="reason-modal">
              <button className="close-btn" onClick={() => setShowReasonModal(false)}>×</button>
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
                  disabled={loading}
                  onClick={handleSubmitAction}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button className="cancel-btn" onClick={() => setShowReasonModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="success-modal">
              <button
                className="close-btn"
                onClick={() => { setShowSuccessModal(false); setShowModal(false); }}
              >
                ×
              </button>
              <img className="tick-icon" src={tick} alt="tick-icon" />
              <h2>Success</h2>
              <p>Leave {actionType === "Approval" ? "Approved" : "Rejected"} Successfully</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}