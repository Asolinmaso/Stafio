import React, { useState, useEffect } from "react";
import "./MyLeave.css";
import {
  FaCheckCircle,
  FaFilter,
  FaEdit,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import EmployeeSidebar from ".././EmployeeSidebar";
import Topbar from ".././Topbar";
import { useNavigate } from "react-router-dom";
import illustration from "../../../assets/Formsbro.png"; // Add your illustration image
import axios from "axios";

export default function MyLeave() {
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [showModal, setShowModal] = useState(false);
   const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Approved

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/myleave");
        setLeaveData(response.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
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

const filteredAndSortedLeaves = leaveData
  // SEARCH by employee name
 

  // FILTER by status
  .filter((leave) =>
    filterStatus === "All" ? true : leave.status === filterStatus
  )


  return (
    <div className="layout">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content Area */}
      <div className="myleave-container">
        <Topbar />

        {/* Page Title */}
        <h2 className="page-title">My Leaves</h2>

        {/* Leave Summary Section */}
        <div className="leave-header">
          {/* Summary Cards */}
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

          {/* Action Buttons */}
          <div className="leave-actions">
            <div className="top-buttons">
              <button className="btn-apply" onClick={() => setShowModal(true)}>
                Apply Leave
              </button>
              <button
                className="btn-regularization"
                onClick={() => navigate("/my-regularization")}
              >
                Regularization
              </button>
            </div>
            <div className="bottom-button">
              <select
                className="right-butn-filter1"
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

        {/* Leave Table */}
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
                      <span className="status">{leave.status}</span>
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
                    <input
                      type="text"
                    />

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
