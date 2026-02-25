import React, { useState,useEffect, useRef } from "react";
import "./MyLeave.css";
import {
  FaCheckCircle,
  FaFilter,
  FaEdit,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import illustration from "../../../assets/Formsbro.png"; // Add your illustration image
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import axios from "axios";

export default function Myleave() {
  const [showModal, setShowModal] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
   // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All")


  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    day_type: "Full Day",
    notify_to: "",
    reason: "",
  });

  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);

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

  useEffect(() => {
    fetchMyLeaves();
  }, []);

   useEffect(() => {
    if (showModal) {
      const userId = sessionStorage.getItem("current_user_id");
      setFormData((prev) => ({
        ...prev,
        employee_id: userId || "",
      }));
    }
  }, [showModal]);

const filteredAndSortedLeaves = leaveData.filter((leave) =>

    filterStatus === "All" ? true : leave.status === filterStatus
  );


   const handleResetFilter = () => {
    setFilterName("");
    setFilterLeaveType("All");
    setFilterStatus("All");
  
  };

  const handleApplyFilter = () => {
    setShowFilterPopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = sessionStorage.getItem("current_user_id");
      const userRole = sessionStorage.getItem("current_role");

      await axios.post(
        "http://localhost:5001/api/admin/leave-requests",
        {
          employee_id: formData.employee_id,
          leave_type_id: formData.leave_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          notify_to: formData.notify_to,
          day_type: formData.day_type === "Full Day" ? "full_day" : "half_day",
          reason: formData.reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": userId,
            "X-User-Role": userRole,
          },
        },
      );

      alert("Leave applied successfully ✅");
      setShowModal(false);
      // 🔥 Refresh table
      fetchMyLeaves();
    } catch (error) {
      console.error("Error applying leave:", error);
      alert("Failed to apply leave ❌");
    }
  };
  
    // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showFilterPopup &&
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilterPopup(false);
      }
  };

      document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterPopup]);

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
              <button className="btn-regularization"
              onClick={() => navigate("/admin-my-regularization")}
              >Regularization</button>
            </div>
            <div className="bottom-button" style={{ position: 'relative' }}>
              <button
                ref={filterButtonRef}
                className="app-btn-filter"
                onClick={() => setShowFilterPopup(!showFilterPopup)}
              >
                <FaFilter /> Filter
              </button>

              {/* Filter Dropdown */}
              {showFilterPopup && (
                <div ref={filterRef} className="filter-dropdown-box">
                  {/* Header */}
                  <div className="filter-popup-header">
                    <h3>Filter</h3>
                    <button
                      className="filter-popup-close"
                      onClick={() => setShowFilterPopup(false)}
                    >
                      <IoClose />
                    </button>
                  </div>
                  {/* Body */}
                  <div className="filter-popup-body">
                    {/* Name Field */}
                    <div className="filter-field">
                      <label>Name</label>
                      <input
                        type="text"
                        placeholder="Please enter name"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                    </div>
                    {/* Leave Type and Status Row */}
                    <div className="filter-row">
                      <div className="filter-field">
                        <label>Leave Type</label>
                        <select
                          value={filterLeaveType}
                          onChange={(e) => setFilterLeaveType(e.target.value)}
                        >
                          <option value="All">All</option>
                          <option value="Casual Leave">Casual Leave</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Annual Leave">Annual Leave</option>
                        </select>
                      </div>
                      <div className="filter-field">
                        <label>Status</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="All">All</option>
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="filter-popup-footer">
                    <button
                      className="filter-reset-btn"
                      onClick={handleResetFilter}
                    >
                      Reset
                    </button>
                    <button
                      className="filter-apply-btn"
                      onClick={handleApplyFilter}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
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
              {filteredAndSortedLeaves.map((leave, index) => (
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
          <div className="app-leave-modal-overlay">
            <div className="apply-leave-modal">
              <div className="app-leave-modal-header-blue">
                <h3>Apply Leave</h3>
                <button
                  className="apply-leave-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  x
                </button>
              </div>

              <div className="app-leave-modal-body">
                <form className="apply-leave-form" onSubmit={handleSubmit}>
                  <div className="form-left">
                    <label>Employee ID:</label>
                    <input 
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    readOnly 
                    />

                    <label>Leave Type:</label>
                    <select
                      name="leave_type"
                      value={formData.leave_type}
                      onChange={handleChange}
                      >
                      <option value="">Select</option>
                      <option value="1">Casual Leave</option>
                      <option value="2">Sick Leave</option>
                      <option value="3">Annual Leave</option>
                    </select>

                    <label>Select Date:</label>
                    <div className="app-leave-date-row">
                      <input 
                        type="date" 
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                      />
                      <input 
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                       />
                      <select
                        name="day_type"
                        value={formData.day_type}
                        onChange={handleChange}
                        >
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day (FN)">Half Day (FN)</option>
                        <option value="Half Day (AN)">Half Day (AN)</option>
                      </select>
                    </div>

                    <label>Notify Others:</label>
                    <div className="app-leave-notify-row">
                      <select
                        name="notify_to"
                        value={formData.notify_to}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option>Team Lead</option>
                        <option>HR</option>
                      </select>
                      <button type="button" className="apply-leave-upload-btn">
                        <FaUpload /> Upload File
                      </button>
                    </div>

                    <label>Reason:</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="ex: I am travelling to"
                      maxLength={30}
                    ></textarea>
                  </div>

                  {/* Right illustration */}
                  <div className="form-right">
                    <img src={illustration} alt="Leave Illustration" />
                  </div>
                </form>
                
                    <div className="app-leave-modal-actions">
                      <button type="submit" className="apply-leave-btn">
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="app-leave-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
