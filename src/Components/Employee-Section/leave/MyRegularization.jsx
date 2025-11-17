import React, { useState, useEffect } from "react";
import "./MyRegularization.css";
import { FaEdit, FaTimesCircle, FaFilter } from "react-icons/fa";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyRegularization() {
  const navigate = useNavigate();
  const [regularizationData, setRegularizationData] = useState([]);

  useEffect(() => {
    const fetchRegularizationData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/myregularization");
        setRegularizationData(response.data);
      } catch (error) {
        console.error("Error fetching Regularization data:", error);
      }
    };
    fetchRegularizationData();
  }, []);

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
          <button className="btn-regularization-add">+ Add Regularization</button>
          <button className="btn-my-leaves" onClick={() => navigate("/my-leave")}>
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
              {regularizationData.length > 0 ? (
                regularizationData.map((row, index) => (
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
      </div>
    </div>
  );
}
