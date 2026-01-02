import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./Employees.css";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import group10 from "../../../assets/Group10.png";

//Reusable Components

const DetailSection = ({ title, children }) => (
  <div className="detail-section">
    <h5>{title}</h5>
    <div className="detail-grid">{children}</div>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="detail-item">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);



     //Employee Profile Modal
       const EmployeeProfileModal = ({ employee, isHRAdmin, onClose }) => {
        if (!employee) return null;
  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        
        {/* Header */}
        <div className="profile-header">
          <h3>Profile</h3>
          <div className="header-actions">
            <span className="status-active">● Active</span>

            {isHRAdmin && (
              <button className="edit-btn">
                ✎
              </button>
            )}

            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="profile-body">

          {/* LEFT PROFILE */}
          <div className="profile-left">
            <img
              src={employee.image}
              alt={employee.name}
              className="profile-img"
            />
            <h4>{employee.name}</h4>
            <p className="role">{employee.position}</p>

            <div className="profile-section">
              <p><strong>Employment Type:</strong> Full Time</p>
              <p><strong>Department:</strong> {employee.department}</p>
              <p><strong>Designation:</strong> {employee.position}</p>
              <p><strong>Reporting Manager:</strong> HR Manager</p>
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="profile-right">

            <DetailSection title="Personal Details">
              <Detail label="Gender" value="Female" />
              <Detail label="DOB" value="22/07/1993" />
              <Detail label="Blood Group" value="A+" />
              <Detail label="Marital Status" value="Married" />
            </DetailSection>

            <DetailSection title="Professional Details">
              <Detail label="Employee ID" value={employee.empId} />
              <Detail label="Position" value={employee.position} />
              <Detail label="Primary Supervisor" value="HR" />
            </DetailSection>

            <DetailSection title="Educational Qualification">
              <Detail label="Institution" value="CEMP Punnapra" />
              <Detail label="Course" value="BTech" />
              <Detail label="Specialization" value="CSE" />
            </DetailSection>

            <DetailSection title="Address">
              <Detail label="City" value="Alappuzha" />
              <Detail label="State" value="Kerala" />
              <Detail label="Country" value="India" />
            </DetailSection>

            <DetailSection title="Contact Details">
              <Detail label="Phone" value={employee.phone || "989596971"} />
              <Detail label="Email" value={employee.email} />
              <Detail label="Emergency Contact" value="989596971" />
            </DetailSection>

            <DetailSection title="Previous Experience">
              <Detail label="Company" value="Azym Technology" />
              <Detail label="Job Title" value="UIUX Designer" />
            </DetailSection>

            <DetailSection title="Bank Details">
              <Detail label="Bank Name" value="SBI" />
              <Detail label="Account No" value="1234567890" />
              <Detail label="IFSC" value="SBIN000123" />
            </DetailSection>

            <DetailSection title="Submitted Documents">
              <div className="doc-row">
                <span>Signed Offer Letter.pdf</span>
                <span className="doc-status">Completed</span>
              </div>
              <div className="doc-row">
                <span>PAN Card.pdf</span>
                <span className="doc-status">Completed</span>
              </div>
            </DetailSection>

          </div>
        </div>
      </div>

      
    </div>
  );
};




const Employee = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const isHRAdmin = true; // frontend role check
  const [employees, setEmployees] = useState([
     {
    id: 1,
    name: "Aarav Bijeesh",
    email: "aarav@gmail.com",
    empId: "100849",
    position: "UIUX",
    department: "Development",
    status: "Active",
    image: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    name: "Aiswarya Shyam",
    email: "aiswarya@gmail.com",
    empId: "100849",
    position: "Developer",
    department: "Design",
    status: "Active",
    image: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    name: "Sakshi",
    email: "sakshi@gmail.com",
    empId: "100849",
    position: "Designer",
    department: "Design",
    status: "Active",
    image: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 4,
    name: "Ignatious Anto",
    email: "ignatious@gmail.com",
    empId: "100849",
    position: "Designer",
    department: "Development",
    status: "Active",
    image: "https://i.pravatar.cc/40?img=4",
  },
  {
    id: 5,
    name: "Lakshmi",
    email: "lakshmi@gmail.com",
    empId: "100849",
    position: "Developer",
    department: "Human Resource",
    status: "Active",
    image: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: 6,
    name: "Akshaya",
    email: "akshaya@gmail.com",
    empId: "100849",
    position: "UIUX",
    department: "Development",
    status: "Active",
    image: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: 7,
    name: "shalom",
    email: "shalom@gmail.com",
    empId: "100849",
    position: "UIUX",
    department: "Design",
    status: "Active",
    image: "https://i.pravatar.cc/40?img=5",
  },
  ]);




  const navigate = useNavigate();

  // ✅ Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/employeeslist");
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

      {/* PAGE CONTENT */}
      <AdminSidebar />
      <div className="employee-main">
        <Topbar />
       {/* TABLE */}
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
         {/* <div className="table-wrapper"> */}
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

                {/* <td>
              <span className="status active">{emp.status}</span>
                </td> */}

                  <td>
                    <button className="view-btn"
                    onClick={() => setSelectedEmployee(emp)}
                    >
                    View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
         {/* </div> */}

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
      
      {selectedEmployee && (
         <EmployeeProfileModal
           employee={selectedEmployee}
           isHRAdmin={isHRAdmin}
           onClose={() => setSelectedEmployee(null)}
         />
         )}

    </div>
  );
};

export default Employee;
