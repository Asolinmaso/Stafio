import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./Employees.css";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import group10 from "../../../assets/Group10.png";
import { useLocation } from "react-router-dom";

const Employee = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
  name: "",
  department: "all",
  position: "all",
  status: "all",
});

//new state
const [allEmployees, setAllEmployees] = useState([]);




  const navigate = useNavigate();

  const location = useLocation();
  const highlightName = location.state?.highlightName || "";

  // ✅ Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/employeeslist"
        );
        console.log("API DATA:", response.data);
        setAllEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);
  //  Filtered + Sorted Employees
  const finalEmployees = React.useMemo(() => {
  let data = [...allEmployees];

  //  Highlight name
  if (highlightName.trim()) {
    data = data.filter(emp =>
      emp.name.toLowerCase().includes(highlightName.toLowerCase())
    );
  }

  //  Search
  if (searchTerm.trim()) {
    data = data.filter(emp =>
      `${emp.name} ${emp.email} ${emp.empId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

    // Name filter (from filter panel)
if (filters.name.trim()) {
  data = data.filter(emp =>
    emp.name.toLowerCase().includes(filters.name.toLowerCase())
  );
}


  // Department
  if (filters.department !== "all") {
    data = data.filter(emp => emp.department === filters.department);
  }

  //  Position
  if (filters.position !== "all") {
    data = data.filter(emp => emp.position === filters.position);
  }

  // Status
  if (filters.status !== "all") {
    data = data.filter(emp => emp.status === filters.status);
  }

  // Sorting
  data.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "department":
        return a.department.localeCompare(b.department);
      case "status":
        return a.status.localeCompare(b.status);
      case "newest":
        return (b.id ?? 0) - (a.id ?? 0);
      case "oldest":
        return (a.id ?? 0) - (b.id ?? 0);
      default:
        return 0;
    }
  });

  return data;
}, [allEmployees, highlightName, searchTerm, filters, sortBy]);


  return (
    <div className="employee-page">
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
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
                <button
                  className="btn-apply"
                  onClick={() => navigate("/employees-list")}
                >
                  All Employee
                </button>
                <button
                  className="btn-regularization"
                  onClick={() => navigate("/el-myteam")}
                >
                  My Team
                </button>
              </div>

              <input
                type="text"
                placeholder="🔍  Search..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="header-right">
              <button className="add-btn" onClick={() => setShowModal(true)}>
                + New Employee
              </button>

            <div className="filter-sort">
                {/* FILTER BUTTON */}
              <div className="filter-wrapper">
                <button
                  className="right-butn-filterr"
                  onClick={() => setShowFilters(prev => !prev)}
                 >
                 <FaFilter /> Filter
                </button>

                 {/* DROPDOWN PANEL */}
                 {showFilters && (
              <div className="filter-dropdown">
                <h4>Filter</h4>

              {/* NAME */}
            <div className="filter-field">
                 <label>Name</label>
                   <input
                       type="text"
                       placeholder="Please enter name"
                       value={filters.name}
                       onChange={(e) =>
                       setFilters({ ...filters, name: e.target.value })
                      }
                     />
                </div>

                       {/* DEPARTMENT + POSITION */}
                    <div className="filter-row">
                        <div className="filter-field">
                          <label>Department</label>
                           <select
                             value={filters.department}
                             onChange={(e) =>
                             setFilters({ ...filters, department: e.target.value })
                            }
                        >
                            <option value="all">Select</option>
                            <option value="Human Resource">Human Resource</option>
                         <option value="Development">Development</option>
                       <option value="Design">Design</option>
                         <option value="Sales">Sales</option>
                       </select>
               </div>

                <div className="filter-field">
                <label>Position</label>
                <select
                  value={filters.position}
                  onChange={(e) =>
                   setFilters({ ...filters, position: e.target.value })
                }
               >
                  <option value="all">Select</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                  <option value="UIUX">UIUX</option>
                 </select>
             </div>
        </div>

        {/* ACTIONS */}
        <div className="filter-actions">
          <button
           className="reset-btn"
            onClick={() => {
                 setFilters({
                  name: "",
                  department: "all",
                  position: "all",
                  status: "all",
                  });
                  setSearchTerm("");
                  setShowFilters(false);
                  }}
                 >
                  Reset
                </button>


          <button
            className="apply-btn"
            onClick={() => setShowFilters(false)}
          >
            Apply
          </button>
        </div>
      </div>
    )}
  </div>

  {/* SORT */}
  <select
    className="sort-select1"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="newest">Sort By : Newest</option>
    <option value="oldest">Sort By : Oldest</option>
    <option value="name">Sort By : Name</option>
    <option value="department">Sort By : Department</option>
    <option value="status">Sort By : Status</option>
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
              {finalEmployees.length === 0 ? (
               <tr>
               <td colSpan="6" style={{ textAlign: "center" }}>
                 No employees found
               </td>
             </tr>
               ) : (
              finalEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-info">
                      <img src={emp.image} alt={emp.name} className="emp-img" />
                      <div>
                        <p
                          className={`emp-name ${
                            highlightName &&
                            emp.name
                              .toLowerCase()
                              .includes(highlightName.toLowerCase())
                              ? "highlight"
                              : ""
                          }`}
                          >
                          {emp.name}
                        </p>

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
               ) 
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
                <option>20</option>
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
                        <i className="profile-icon">👤 </i>
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