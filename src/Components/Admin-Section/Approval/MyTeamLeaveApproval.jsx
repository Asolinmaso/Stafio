import React, { useState, useEffect } from "react";
import "./MyTeamLeaveApproval.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import illustration from "../../../assets/Formsbro.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import tick from "../../../assets/tickicon.png";

export default function MyTeamLeaveApproval() {
  const [leaveData, setLeaveData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [approvalReason, setApprovalReason] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  // FILTER POPUP STATES
  const [showFilter, setShowFilter] = useState(false);
  const [tempStatus, setTempStatus] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTeamLA = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/myteamla"
        );
        setLeaveData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMyTeamLA();
  }, []);

  const getStatusClass = (status) => {
    if (status === "Approved") return "status-approved";
    if (status === "Pending") return "status-pending";
    if (status === "Rejected") return "status-rejected";
  };

  const filteredAndSortedLeaves = leaveData
    .filter((leave) =>
      leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus
    )
    .sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
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
              {/* FILTER BUTTON */}
              <div className="filter-wrapper">
                <button
                  className="right-btn-filter"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <FaFilter /> Filter
                </button>

                {/* FILTER POPUP */}
                {showFilter && (
                  <div className="filter-dropdown">
                    <h3 className="filter-heading">Filter</h3>

                    <div className="filter-field">
                      <label>Name</label>
                      <input
                        type="text"
                        placeholder="Enter employee name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Leave Type</label>
                        <select>
                          <option>All</option>
                          <option>Casual</option>
                          <option>Sick</option>
                          <option>WFH</option>
                        </select>
                      </div>

                      <div className="filter-field">
                        <label>Status</label>
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value)}
                        >
                          <option value="All">All</option>
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="filter-actions">
                      <button
                        className="reset-btn"
                        onClick={() => {
                          setSearchTerm("");
                          setTempStatus("All");
                          setFilterStatus("All");
                          setShowFilter(false);
                        }}
                      >
                        Reset
                      </button>

                      <button
                        className="apply-btn"
                        onClick={() => {
                          setFilterStatus(tempStatus);
                          setShowFilter(false);
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SORT */}
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
              {filteredAndSortedLeaves.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="employee-info">
                      <img src={item.image} alt="" className="emp-avatar" />
                      <div>
                        <p className="emp-name">{item.name}</p>
                        <p className="emp-id">{item.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.type}
                    <br />
                    <span className="days">{item.days}</span>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.request}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(item.status)}`}
                    >
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
