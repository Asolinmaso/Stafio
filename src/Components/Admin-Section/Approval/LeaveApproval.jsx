import React from "react";
import { FaCheckCircle, FaFilter, FaEdit, FaTimesCircle } from "react-icons/fa";
import "./LeaveApproval.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";


const LeaveApproval = () => {
  const leaves = [
    {
      name: "Aarav Bijeesh",
      id: "100849",
      type: "Sick Leave",
      days: "1 Day(s)",
      dates: "11-07-2025/Full Day",
      requestDate: "11-07-2025",
      status: "Pending",
    },
    {
      name: "Aiswarya Shyam",
      id: "100849",
      type: "Sick Leave",
      days: "0.5 Day(s)",
      dates: "11-07-2025/Half Day(AN)",
      requestDate: "11-07-2025",
      status: "Pending",
    },
    {
      name: "Sakshi",
      id: "100849",
      type: "Casual Leave",
      days: "1 Day(s)",
      dates: "11-07-2025/Full Day",
      requestDate: "11-07-2025",
      status: "Approved",
    },
    {
      name: "Ignatious Anto",
      id: "100849",
      type: "Casual Leave",
      days: "3 Day(s)",
      dates: "11-07-2025–13-07-2025/Full Day",
      requestDate: "11-07-2025",
      status: "Approved",
    },
    {
      name: "Lakshmi",
      id: "100849",
      type: "Sick Leave",
      days: "1 Day(s)",
      dates: "11-07-2025/Full Day",
      requestDate: "11-07-2025",
      status: "Rejected",
    },
  ];

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


  return (
    <div className="leave-approval-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
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
                      <button
                        className="right-btn-apply"
                      >
                        All
                      </button>
                      <button
                      onClick={() => navigate("/myTeam-LeaveApproval")} 
                      className="right-btn-regularization">My Team</button>
                    </div>
                    <div className="right-bottom-button">
                      <input
                  type="text"
                  placeholder="🔍 Search..."
                  className="right-search-input"
                />
                      <button className="right-butn-filter">
                        <FaFilter /> Filter
                      </button>
                      <select className="right-sort-select">
                    <option>Sort By : Newest</option>
                    <option>Sort By : Oldest</option>
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
              {leaves.map((leave, index) => (
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
                    <button className="view-btn">View Details</button>
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
        </div>
      </div>
  );
};

export default LeaveApproval;
