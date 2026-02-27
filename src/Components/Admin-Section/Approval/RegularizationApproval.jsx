import React, { useState, useEffect } from "react";
import "./RegularizationApproval.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import timemgnt from "../../../assets/Timemgnt.png";
import axios from "axios";

export default function RegularizationApproval() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Approved | Rejected
  const [sortOrder, setSortOrder] = useState("Newest"); // Newest | Oldest
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectedResultModal, setShowRejectedResultModal] = useState(false);
  const [modalReason, setModalReason] = useState("");
  useEffect(() => {
    const fetchRegularizationApproval = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/regularizationapproval"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchRegularizationApproval();
  }, []);

  // ✅ ADDED: close popup on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
    setShowApproveModal(false);
    setShowRejectModal(false);
    setShowSuccessModal(false);
    setShowRejectedResultModal(false);
    setModalReason("");
  };

  const handleApproveClick = () => {
    setShowApproveModal(true);
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleApproveSubmit = async () => {
    // Connect to backend
    if (selectedLeave) {
      try {
        const userId = sessionStorage.getItem("current_user_id");
        const userRole = sessionStorage.getItem("current_role") || "admin";
        await axios.put(`http://127.0.0.1:5001/api/admin/regularization/${selectedLeave.id}`,
          {
            status: "approved",
            reason: modalReason
          },
          {
            headers: {
              "X-User-ID": userId,
              "X-User-Role": userRole
            }
          }
        );

        setData(prevData => prevData.map(item =>
          item.id === selectedLeave.id ? { ...item, status: "Approved" } : item
        ));
      } catch (error) {
        console.error("Error approving regularization:", error);
        alert("Failed to approve regularization");
      }
    }
    setShowApproveModal(false);
    setShowSuccessModal(true);
    // Auto-close success
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  const handleRejectSubmit = async () => {
    // Connect to backend
    if (selectedLeave) {
      try {
        const userId = sessionStorage.getItem("current_user_id");
        const userRole = sessionStorage.getItem("current_role") || "admin";
        await axios.put(`http://127.0.0.1:5001/api/admin/regularization/${selectedLeave.id}`,
          {
            status: "rejected",
            reason: modalReason
          },
          {
            headers: {
              "X-User-ID": userId,
              "X-User-Role": userRole
            }
          }
        );

        setData(prevData => prevData.map(item =>
          item.id === selectedLeave.id ? { ...item, status: "Rejected" } : item
        ));
      } catch (error) {
        console.error("Error rejecting regularization:", error);
        alert("Failed to reject regularization");
      }
    }
    setShowRejectModal(false);
    setShowRejectedResultModal(true);
    // Auto-close result
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  const filteredAndSortedLeaves = data
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
      const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const parts = dateStr.split("-");
        if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return new Date(dateStr);
      };
      const dateA = parseDate(a.requestDate);
      const dateB = parseDate(b.requestDate);

      return sortOrder === "Newest"
        ? dateB - dateA
        : dateA - dateB;
    });



  return (
    <div className="regularization-page">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
          className="rightside-logos" />
      </div>

      <AdminSidebar />

      <div className="regularization-approval-main">
        <Topbar />

        <div className="regularization-container">
          <div className="regularization-header">
            <div className="header-top">
              <h2>Regularization Approval</h2>
            </div>

            <div className="header-bottom">
              <div className="left-tabs">
                <button className="tab-btn ">All</button>
                <button className="tab-btn active"
                  onClick={() => navigate("/ra-myteam")}
                >My Team</button>
              </div>

              <div className="right-controls">
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
                        <p
                          className={`status-badge ${emp.status.toLowerCase()}`}
                        >
                          {emp.status}
                        </p>
                      </div>
                    </td>

                    <td>
                      <button className="view-btn" onClick={() => handleViewDetails(emp)}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="showing">
              Showing{" "}
              <select>
                <option>07</option>
              </select>
            </div>
            <div className="page-btns">
              <button className="prev">Prev</button>
              <button className="page active">01</button>
              <button className="next">Next</button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedLeave && (
        <div className="ra-modal-overlay">
          <div className="ra-modal-content">
            <div className="ra-modal-header">
              <h2>Regularization Approval</h2>
              <button className="ra-close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="ra-modal-body">
              <div className="ra-form-section">
                <div className="ra-form-group">
                  <label>Employee ID:</label>
                  <input type="text" value={`${selectedLeave.name}(${selectedLeave.empId})`} readOnly />
                </div>
                <div className="ra-form-group">
                  <label>Leave Type:</label>
                  <select disabled className="ra-select">
                    <option>{selectedLeave.regDate?.split('/')[1] || "Full Day"}</option>
                  </select>
                </div>
                <div className="ra-form-group">
                  <label>Select Date:</label>
                  <div className="ra-date-input-wrapper">
                    <input type="text" value={selectedLeave.regDate?.split('/')[0] || "DD-MM-YYYY"} readOnly />
                    <span className="ra-date-icon">📅</span>
                  </div>
                </div>
                <div className="ra-form-group">
                  <label>Approved By:</label>
                  <input type="text" value="Sakshi" readOnly />
                </div>
                <div className="ra-form-group ra-reason-group">
                  <label>Reason:</label>
                  <div className="ra-reason-wrapper">
                    <textarea value="Forgot to Clock In" readOnly />
                    <span className="ra-char-count">30/30</span>
                  </div>
                </div>
              </div>
              <div className="ra-illustration-section">
                <img src={timemgnt} alt="Time Management" />
              </div>
            </div>
            <div className="ra-modal-footer">
              <span className="ra-watermark">Viewdetailsregularization</span>
              <div className="ra-footer-btns">
                <button className="ra-approve-btn" onClick={handleApproveClick}>Approve</button>
                <button className="ra-reject-btn" onClick={handleRejectClick}>Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Reason Modal */}
      {showApproveModal && (
        <div className="ra-modal-overlay ra-nested-overlay">
          <div className="ra-small-modal">
            <button className="ra-small-close" onClick={() => setShowApproveModal(false)}>&times;</button>
            <h3>Reason For Approval</h3>
            <div className="ra-small-body">
              <textarea
                placeholder="Please fill out the note for approvals"
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
              />
              <p className="ra-char-hint">maximum character limit 250</p>
              <div className="ra-small-footer">
                <button className="ra-submit-btn" onClick={handleApproveSubmit}>Submit</button>
                <button className="ra-cancel-btn" onClick={() => setShowApproveModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="ra-modal-overlay ra-nested-overlay">
          <div className="ra-small-modal">
            <button className="ra-small-close" onClick={() => setShowRejectModal(false)}>&times;</button>
            <h3>Reason For Rejection</h3>
            <div className="ra-small-body">
              <textarea
                placeholder="Please fill out the note for approvals"
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
              />
              <p className="ra-char-hint">maximum character limit 250</p>
              <div className="ra-small-footer">
                <button className="ra-submit-btn" onClick={handleRejectSubmit}>Submit</button>
                <button className="ra-cancel-btn" onClick={() => setShowRejectModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="ra-modal-overlay ra-nested-overlay">
          <div className="ra-result-modal ra-success-box">
            <button className="ra-small-close" onClick={handleCloseModal}>&times;</button>
            <div className="ra-result-content">
              <h2>Success</h2>
              <p>Leave Approved Successfully</p>
            </div>
          </div>
        </div>
      )}

      {/* Rejected Result Modal */}
      {showRejectedResultModal && (
        <div className="ra-modal-overlay ra-nested-overlay">
          <div className="ra-result-modal ra-reject-box">
            <button className="ra-small-close" onClick={handleCloseModal}>&times;</button>
            <div className="ra-result-content">
              <h2>Rejected</h2>
              <p>Leave Approval Rejected</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}