import React, { useState, useEffect } from "react";
import "./MyRegularization.css";
import { FaEdit, FaTimesCircle, FaFilter } from "react-icons/fa";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import illustration from "../../../assets/timemgnt.png";

export default function MyRegularization() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    date: "",
    session_type: "Full Day",
    attendance_type: "Present",
    reason: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [regularizationData, setRegularizationData] = useState([]);
  useEffect(() => {
    const fetchRegularizationData = async () => {
      try {
        const userId =
          localStorage.getItem("employee_user_id") ||
          sessionStorage.getItem("current_user_id");

        if (!userId) return;

        const response = await axios.get(
          "http://127.0.0.1:5001/api/myregularization",
          {
            headers: {
              "X-User-ID": userId,
            },
          },
        );

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

  const handleSubmitRegularization = async () => {
    const userId = localStorage.getItem("employee_user_id") || sessionStorage.getItem("current_user_id");

    // Frontend validation
    if (!formData.date) {
      alert("Please select a date");
      return;
    }

    try {
      if (isEdit) {
        // ✏️ EDIT
        await axios.put(
          `http://127.0.0.1:5001/api/regularization/${editId}`,
          formData,
          { headers: { "X-User-ID": userId } },
        );

        alert("Regularization updated successfully");
      } else {
        // ➕ ADD
        await axios.post("http://127.0.0.1:5001/api/regularization", formData, {
          headers: { "X-User-ID": userId },
        });

        alert("Regularization added successfully");
      }

      // Reset modal & state
      setShowModal(false);
      setIsEdit(false);
      setEditId(null);
      setFormData({
        user_id: userId,
        date: "",
        session_type: "Full Day",
        attendance_type: "Present",
        reason: "",
      });

      // Refresh table
      const res = await axios.get(
        "http://127.0.0.1:5001/api/myregularization",
        { headers: { "X-User-ID": userId } },
      );
      setRegularizationData(res.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      );
    }
  };

  const handleEdit = (row) => {
    if (row.status !== "Pending") return;

    setIsEdit(true);
    setEditId(row.id);

    const datePart = row.date.split("/")[0].trim();
    setFormData({
      user_id:
        localStorage.getItem("employee_user_id") ||
        sessionStorage.getItem("current_user_id"),
      date: datePart.split("-").reverse().join("-"),
      session_type: row.date.split("/")[1]?.trim() || "Full Day",
      attendance_type: row.attendanceType,
      reason: row.reason,
    });

    setShowModal(true);
  };

  const handleDelete = async (id, status) => {
    if (status !== "Pending") return;

    if (!window.confirm("Delete this regularization?")) return;

    const userId = localStorage.getItem("employee_user_id") || sessionStorage.getItem("current_user_id");

    await axios.delete(`http://127.0.0.1:5001/api/regularization/${id}`, {
      headers: { "X-User-ID": userId },
    });

    setRegularizationData((prev) => prev.filter((item) => item.id !== id));
  };

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
            onClick={() => {
              setFormData({
                user_id:
                  localStorage.getItem("employee_user_id") ||
                  sessionStorage.getItem("current_user_id"),
                date: "",
                session_type: "Full Day",
                attendance_type: "Present",
                reason: "",
              });
              setShowModal(true);
            }}
          >
            + Add Regularization
          </button>
          <button
            className="btn-my-leaves"
            onClick={() => navigate("/my-leave")}
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
              {regularizationData.length > 0 ? (
                regularizationData.map((row, index) => (
                  <tr key={row.id}>
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>{row.attendanceType}</td>
                    <td>{row.date}</td>
                    <td>{row.reason}</td>
                    <td>
                      <span
                        className={`status-badge ${row.status === "Approved"
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
                      {row.status === "Pending" ? (
                        <>
                          <FaEdit
                            className="edit-icon"
                            onClick={() => handleEdit(row)}
                          />
                          <FaTimesCircle
                            className="delete-icon"
                            onClick={() => handleDelete(row.id, row.status)}
                          />
                        </>
                      ) : (
                        <span className="disabled-text">—</span>
                      )}
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
        {/* Modal Popup */}
        {showModal && (
          <div className="regularization-overlay">
            <div className="regularization-modal">
              {/* Header */}
              <div className="regularization-headers">
                <h3>{isEdit ? "Edit Regularization" : "Add Regularization"}</h3>
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
                    <input type="text" value={formData.user_id} readOnly />

                    <label>Leave Type:</label>
                    <select
                      value={formData.session_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          session_type: e.target.value,
                        })
                      }
                    >
                      <option>Full Day</option>
                      <option>Half Day (FN)</option>
                      <option>Half Day (AN)</option>
                    </select>

                    <label>Select Date:</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />

                    <label>Attendance:</label>
                    <select
                      value={formData.attendance_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attendance_type: e.target.value,
                        })
                      }
                    >
                      <option>Present</option>
                      <option>Absent</option>
                    </select>

                    <label>Reason:</label>
                    <textarea
                      placeholder="ex: Forgot to Clock In"
                      maxLength={30}
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
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
                <button
                  type="button"
                  className="regularization-submit"
                  onClick={handleSubmitRegularization}
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
