import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApplyLeave.css";
import illustration from "../../../assets/Formsbro.png";
import { FaUpload } from "react-icons/fa";

const LeaveRequestForm = ({ onClose }) => {
  const [employeeId, setEmployeeId] = useState("");

  const [formData, setFormData] = useState({
    leave_type_id: "",
    num_days: "",
    start_date: "",
    end_date: "",
    reason: "",
    notify_to: "",
  });

  useEffect(() => {
    const userId =
      localStorage.getItem("employee_user_id") ||
      sessionStorage.getItem("current_user_id");

    setEmployeeId(userId);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId =
      localStorage.getItem("employee_user_id") ||
      sessionStorage.getItem("current_user_id");

    const role =
      localStorage.getItem("employee_role") ||
      sessionStorage.getItem("current_role");

    try {
      const res = await axios.post(
        "http://127.0.0.1:5001/leave_requests",
        {
          ...formData,
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Role": role,
            "X-User-ID": userId,
          },
        }
      );

      alert(res.data.message);

      window.dispatchEvent(new Event("leaveRequestUpdated"));
      onClose();

    } catch (err) {
      alert(err?.response?.data?.message || "Error applying leave");
    }
  };

  return (
    <form className="apply-leave-form" onSubmit={handleSubmit}>
      
      {/* LEFT SIDE FORM */}
      <div className="form-left">

        <label>Employee ID:</label>
        <input type="text" value={employeeId} readOnly />

        <label>Leave Type:</label>
        <select
          name="leave_type_id"
          value={formData.leave_type_id}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="5">Casual Leave</option>
          <option value="4">Sick Leave</option>
          <option value="3">Annual Leave</option>
        </select>

        <label>No Of Days:</label>
        <input
          type="number"
          name="num_days"
          value={formData.num_days}
          onChange={handleChange}
          required
        />

        <label>Select Date:</label>
        <div className="app-leave-date-row">

          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />

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
          required
        />

      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="form-right">
        <img src={illustration} alt="Leave Illustration" />
      </div>

      {/* FOOTER BUTTONS */}
      <div className="app-leave-modal-actions">

        <button type="submit" className="apply-leave-btn">
          Apply
        </button>

        <button
          type="button"
          className="app-leave-cancel-btn"
          onClick={onClose}
        >
          Cancel
        </button>

      </div>

    </form>
  );
};

export default LeaveRequestForm;