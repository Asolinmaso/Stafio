import React, { useState,useEffect } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import "./LeavePolicies.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const LeavePolicies = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const  fetchleavepolicies = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/leavepolicies");
        setLeavePolicies(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchleavepolicies();
  }, []);

  const [showModal, setShowModal] = useState(false);

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
    <div className="leave-policies-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="leave-policies-main">
        <Topbar />

        {/* ===== Header Section ===== */}
        <div className="leave-policies-header">
          <h2 className="leave-policies-title">Leave Policies</h2>
          <button
            className="leave-policies-add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Leave Type
          </button>
        </div>

        {/* ===== Table Section ===== */}
        <table className="leave-policies-table">
          <thead>
            <tr>
              <th>Leave Name</th>
              <th>Created On</th>
              <th>Leave Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leavePolicies.map((policy, index) => (
              <tr key={index}>
                <td>{policy.name}</td>
                <td>{policy.createdOn}</td>
                <td>{policy.type}</td>
                <td className="leave-policies-actions">
                  <button className="leave-policies-edit-btn">
                    <FaEdit />
                  </button>
                  <button className="leave-policies-delete-btn">
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== Modal Section ===== */}
        {showModal && (
          <div className="leave-policies-overlay">
            <div className="leave-policies-modal">
              {/* Header */}
              <div className="leave-policies-modal-header">
                <h3 className="leave-policies-modal-title">Add New Leave</h3>
                <button
                  className="leave-policies-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="leave-policies-modal-body">
                <form className="leave-policies-form">
                  <div className="leave-policies-form-content">
                    <div className="leave-policies-field">
                      <label>Leave Name</label>
                      <input
                        type="text"
                        placeholder="Please enter name"
                        className="leave-policies-input"
                      />
                    </div>

                    <div className="leave-policies-field">
                      <label>Description</label>
                      <input
                        type="text"
                        placeholder="Please enter description"
                        className="leave-policies-input"
                      />
                    </div>

                    <div className="leave-policies-field">
                      <label>Maximum Days Allowed</label>
                      <input
                        type="text"
                        placeholder="Please enter number of days"
                        className="leave-policies-input"
                      />
                    </div>

                    <div className="leave-policies-field">
                      <label>Applicability</label>
                      <select className="leave-policies-select">
                        <option>All Employee</option>
                        <option>Specific Employee</option>
                      </select>
                    </div>

                    <div className="leave-policies-field">
                      <label>Leave Type</label>
                      <select className="leave-policies-select">
                        <option>All</option>
                        <option>Sick Leave</option>
                        <option>Casual Leave</option>
                        <option>Annual Leave</option>
                      </select>
                    </div>

                    <div className="leave-policies-field">
                      <label>Gender</label>
                      <div className="leave-policies-checkbox-group">
                        <label className="leave-policies-checkbox-label">
                          <input type="checkbox" className="leave-policies-checkbox" />
                          <span>Male</span>
                        </label>
                        <label className="leave-policies-checkbox-label">
                          <input type="checkbox" className="leave-policies-checkbox" />
                          <span>Female</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="leave-policies-modal-footer">
                <button type="submit" className="leave-policies-save-btn">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="leave-policies-cancel-btn"
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
};

export default LeavePolicies;
