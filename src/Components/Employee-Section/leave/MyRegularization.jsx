import React, { useState, useEffect } from "react";
import "./MyRegularization.css";
import { FaEdit, FaTimesCircle, FaFilter } from "react-icons/fa";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import illustration from "../../../assets/timemgnt.png"; // Add your illustration image

import axios from "axios";

export default function MyRegularization() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [regularizationData, setRegularizationData] = useState([]);
     const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Approved
  

  useEffect(() => {
    const fetchRegularizationData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/myregularization");
        setRegularizationData(response.data);
      } catch (error) {
        console.error("Error fetching Regularization data:", error);
      }
    };
    fetchRegularizationData();
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


const filteredAndSortedLeaves = regularizationData
  // SEARCH by employee name
 

  // FILTER by status
  .filter((leave) =>
    filterStatus === "All" ? true : leave.status === filterStatus
  )

  return (
    <div className="layout">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
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
          <button className="btn-my-leaves" onClick={() => navigate("/my-leave")}>
            My Leaves
          </button>
          <select
                className="right-butn-filter2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
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
              {filteredAndSortedLeaves.length > 0 ? (
                filteredAndSortedLeaves.map((row, index) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No regularization records found.
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
                            <input type="text"/>
        
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
