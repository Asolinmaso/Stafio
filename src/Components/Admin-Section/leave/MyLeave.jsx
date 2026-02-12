import React, { useState, useEffect } from "react";
import "./MyLeave.css";
import {
  FaCheckCircle,
  FaFilter,
  FaEdit,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import illustration from "../../../assets/Formsbro.png"; // Add your illustration image
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import axios from "axios";

export default function Myleave() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Approved | Rejected
  const [sortOrder, setSortOrder] = useState("Newest"); // Newest | Oldest
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const navigate = useNavigate();

  const filteredAndSortedLeaves = leaveData
    // SEARCH by employee name

    // FILTER by status
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus,
    );

  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        const userId = sessionStorage.getItem("current_user_id");

        if (!userId) return;

        const response = await axios.get("http://127.0.0.1:5001/api/myleave", {
          headers: {
            "X-User-ID": userId,
            "X-User-Role": "admin", // optional but safe
          },
        });

        setLeaveData(response.data);

        // 🔹 Fetch leave balance (SAME AS EMPLOYEE)
        const balanceResponse = await axios.get(
          "http://127.0.0.1:5001/api/leave_balance",
          {
            headers: {
              "X-User-ID": userId,
            },
          },
        );
        setLeaveBalance(balanceResponse.data);
      } catch (error) {
        console.error("Error fetching admin leave data:", error);
      }
    };

    fetchMyLeaves();
  }, []);

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
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="myleave-container">
        <Topbar />
        <h2 className="page-title">My Leaves</h2>

        {/* Header Section */}
        <div className="leave-header">
          <div className="leave-summary">
            {leaveBalance.length > 0 ? (
              leaveBalance.slice(0, 3).map((balance) => (
                <div className="summary-card" key={balance.id}>
                  <FaCheckCircle className="summary-icon" />
                  <p>
                    <strong>
                      {balance.remaining}/{balance.total} Day(s)
                    </strong>
                    <br />
                    {balance.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="summary-card">
                <FaCheckCircle className="summary-icon" />
                <p>
                  <strong>Loading...</strong>
                  <br />
                  Leave Balance
                </p>
              </div>
            )}
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
            <div className="bottom-button">
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
              {filteredAndSortedLeaves.length > 0 ? (
                filteredAndSortedLeaves.map((leave, index) => (
                  <tr key={leave.id}>
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>{leave.type}</td>
                    <td>{leave.date}</td>
                    <td>{leave.reason}</td>
                    <td>
                      {leave.requestDate}
                      <span className={`status ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="action-icons">
                      <FaEdit className="edit-icon" />
                      <FaTimesCircle className="delete-icon" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No leave records found.
                  </td>
                </tr>
              )}
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

                  {/* Right illustration */}
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
