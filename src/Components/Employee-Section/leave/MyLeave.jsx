import React, {useState,useEffect} from "react";
import "./MyLeave.css";
import { FaCheckCircle, FaFilter, FaEdit, FaTimesCircle } from "react-icons/fa";
import EmployeeSidebar from ".././EmployeeSidebar";
import Topbar from ".././Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyLeave() {
   const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/myleave");
        setLeaveData(response.data);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
  }, []);

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
            <button
              className="btn-apply"
              onClick={() => navigate("/apply-leave")}
            >
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
            <button className="btn-filter">
              <FaFilter /> Filter
            </button>
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
            {leaveData.length > 0 ? (
              leaveData.map((leave, index) => (
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
    </div>
  </div>
);

}
