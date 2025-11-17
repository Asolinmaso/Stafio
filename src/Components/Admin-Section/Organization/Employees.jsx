import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./Employees.css";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import group10 from "../../../assets/Group10.png";


const Employee = () => {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/employeeslist");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="employee-page">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />

      <div className="employee-main">
        <Topbar />

        <div className="employee-content">
          {/* ---------- Header Section ---------- */}
          <div className="employee-header">
            {/* LEFT SIDE */}
            <div className="header-left">
              <h2>Employees</h2>

              <div className="top-buttons">
                <button className="btn-apply">All Employee</button>
                <button
                  className="btn-regularization"
                  onClick={() => navigate("/el-myteam")}
                >
                  My Team
                </button>
              </div>

              <input
                type="text"
                placeholder="🔍 Search..."
                className="search-input"
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="header-right">
              <button className="add-btn" onClick={() => setShowModal(true)}>
                + New Employee
              </button>

              <div className="filter-sort">
                <button className="filter-btn">
                  <FaFilter /> Filter
                </button>
                <select className="sort-select1">
                  <option>Sort By : Newest</option>
                  <option>Sort By : Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* ---------- Employee Table ---------- */}
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name / Email ID</th>
                <th>Employee ID</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-info">
                      <img src={emp.image} alt={emp.name} className="emp-img" />
                      <div>
                        <p className="emp-name">{emp.name}</p>
                        <p className="emp-email">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{emp.empId}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td className={`status ${emp.status.toLowerCase()}`}>
                    {emp.status}
                  </td>
                  <td>
                    <button className="view-btn">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ---------- Pagination Section ---------- */}
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

        {/* ---------- Modal Popup ---------- */}
        {showModal && (
          <div className="modal-overlay">
            <div className="add-employee-modal">
              <div className="modal-header-blue">
                <h3>Add New Employee</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <form className="add-employee-form">
                  <div className="form-left">
                    {/* Profile Upload Section */}
                    <div className="profile-upload-section">
                      <div className="profile-placeholder">
                        <i className="profile-icon">👤</i>
                      </div>
                      <div className="upload-info">
                        <h4>Upload Profile Image</h4>
                        <p>Image should be below 4 MB</p>
                        <button type="button" className="upload-btn1">
                          Upload
                        </button>
                      </div>
                    </div>

                    {/* Form Rows */}
                    <div className="form-row1">
                      <div className="form-group">
                        <label>First Name</label>
                        <input type="text" placeholder="Please enter name" />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" placeholder="Please enter name" />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Employee ID</label>
                        <input
                          type="text"
                          placeholder="Please enter employee ID"
                        />
                      </div>
                      <div className="form-group">
                        <label>Joining Date</label>
                        <input type="date" placeholder="dd/mm/yyyy" />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Please enter email" />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          placeholder="Please enter phone number"
                        />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Employment Type</label>
                        <select>
                          <option>Select</option>
                          <option>Full Time</option>
                          <option>Part Time</option>
                          <option>Contract</option>
                          <option>Intern</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Primary Supervisor</label>
                        <select>
                          <option>Select</option>
                          <option>John Doe</option>
                          <option>Jane Smith</option>
                          <option>Mike Johnson</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>HR Manager</label>
                        <select>
                          <option>Select</option>
                          <option>Sarah Wilson</option>
                          <option>David Brown</option>
                          <option>Lisa Taylor</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <select>
                          <option>Select</option>
                          <option>Engineering</option>
                          <option>Marketing</option>
                          <option>Sales</option>
                          <option>HR</option>
                          <option>Finance</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Designation</label>
                        <select>
                          <option>Select</option>
                          <option>Software Engineer</option>
                          <option>Senior Engineer</option>
                          <option>Team Lead</option>
                          <option>Manager</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Status</label>
                        <select>
                          <option>Active</option>
                          <option>Inactive</option>
                          <option>Pending</option>
                        </select>
                      </div>
                    </div>

                    {/* ---------- Modal Actions ---------- */}
                    <div className="modal-actions1">
                      <button type="submit" className="save-btn">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
