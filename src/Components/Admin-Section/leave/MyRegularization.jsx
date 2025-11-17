import React, { useState } from "react";
import "./MyRegularization.css";
import { FaEdit, FaTimesCircle, FaFilter, FaUpload } from "react-icons/fa";
import illustration from "../../../assets/timemgnt.png"; // Add your illustration image
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";


export default function MyRegularization() {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div className="layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="regularization-container">
        <Topbar />
        {/* Page Title */}
        <h2 className="page-title">Regularization Listing</h2>

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
          <button className="btn-filter">
            <FaFilter /> Filter
          </button>
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
              {regularizationData.map((row, index) => (
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
        {/* Modal Popup */}
        {showModal && (
          <div className="regularization-overlay">
            <div className="regularization-modal">
              {/* Header */}
              <div className="regularization-headers">
                <h3>Add Regularization</h3>
                <button
                  className="regularization-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="regularization-body">
                <form className="regularization-form">
                  {/* Left Form Section */}
                  <div className="regularization-left">
                    <label>Employee ID:</label>
                    <input type="text" value="Aiswarya (100234)" readOnly />

                    <label>Leave Type:</label>
                    <select>
                      <option>Full Day</option>
                      <option>Half Day (FN)</option>
                      <option>Half Day (AN)</option>
                    </select>

                    <label>Select Date:</label>
                    <input type="date" placeholder="DD-MM-YYYY" />

                    <label>Attendance:</label>
                    <select>
                      <option>Present</option>
                      <option>Absent</option>
                    </select>

                    <label>Reason:</label>
                    <textarea
                      placeholder="ex: Forgot to Clock In"
                      maxLength={30}
                    ></textarea>
                  </div>

                  {/* Right Image Section */}
                  <div className="regularization-right">
                    <img src={illustration} alt="Regularization Illustration" />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="regularization-footer">
                <button type="submit" className="regularization-submit"
                 onClick={() => setShowModal(false)}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="regularization-cancel"
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
