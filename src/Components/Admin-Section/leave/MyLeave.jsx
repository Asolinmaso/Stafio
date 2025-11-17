import React, { useState } from "react";
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


export default function Myleave() {
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
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
              <button className="btn-regularization"
              onClick={() => navigate("/admin-my-regularization")}
              >Regularization</button>
            </div>
            <div className="bottom-button">
              <button className="btn-filter">
                <FaFilter /> Filter
              </button>
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
              {leaveData.map((leave, index) => (
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
                    <input type="text" value="Aiswarya (100234)" readOnly />

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
