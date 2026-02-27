import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./Employees.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import group10 from "../../../assets/Group10.png";
import { FaUserFriends, FaSearch, FaFilter, FaEdit } from "react-icons/fa";
import { FiShare2, FiDownload } from "react-icons/fi";

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
  const initialFormState = {
    firstName: "",
    lastName: "",
    employeeId: "",
    joiningDate: "",
    email: "",
    phone: "",
    employmentType: "",
    supervisor: "",
    hrManager: "",
    department: "",
    designation: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    maritalStatus: "",
    portfolioLink: "",
    institution: "",
    eduStartDate: "",
    eduEndDate: "",
    course: "",
    specialization: "",
    skills: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const highlightName = searchTerm || location.state?.highlightName || "";

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };


  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  //Validation logic for new employee form

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim() || formData.firstName.length < 3) {
      newErrors.firstName = "*First name is required";
    }

    if (!formData.lastName.trim() || formData.lastName.length < 1) {
      newErrors.lastName = "*Last name must contain at least one letter";
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "*Employee ID is required";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = "*Please select a joining date";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "*Enter a valid email address";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "*Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (isEditing) {
          const response = await axios.put(`http://127.0.0.1:5001/api/employees/${editingId}`, formData);
          alert(response.data.message);
        } else {
          const response = await axios.post("http://127.0.0.1:5001/api/employees", formData);
          alert(response.data.message);
        }
        setShowModal(false);
        resetForm();
        window.location.reload();
      } catch (error) {
        console.error("Error saving employee:", error);
        alert(error.response?.data?.message || "Failed to save employee");
      }
    }
  };

  const handleEditClick = () => {
    if (!selectedEmployee) return;

    // Helper to format date from backend (DD/MM/YYYY) to HTML date input (YYYY-MM-DD)
    const formatDate = (dateStr) => {
      if (!dateStr || dateStr === "Not Set" || dateStr === "N/A") return "";
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return "";
    };

    setFormData({
      firstName: selectedEmployee.profile.first_name || "",
      lastName: selectedEmployee.profile.last_name || "",
      employeeId: selectedEmployee.profile.empId || "",
      joiningDate: formatDate(selectedEmployee.profile.joiningDate), // Need to ensure joiningDate is in result
      email: selectedEmployee.profile.email || "",
      phone: selectedEmployee.profile.phone || "",
      employmentType: selectedEmployee.profile.empType || "",
      supervisor: selectedEmployee.profile.supervisor || "",
      hrManager: selectedEmployee.profile.hrManager || "",
      department: selectedEmployee.profile.department || "",
      designation: selectedEmployee.profile.position || "",
      gender: selectedEmployee.profile.gender || "",
      dob: formatDate(selectedEmployee.profile.dob),
      bloodGroup: selectedEmployee.profile.bloodGroup || "",
      maritalStatus: selectedEmployee.profile.maritalStatus || "",
      portfolioLink: selectedEmployee.education.portfolio || "",
      institution: selectedEmployee.education.institution || "",
      eduStartDate: formatDate(selectedEmployee.education.eduStartDate),
      eduEndDate: formatDate(selectedEmployee.education.eduEndDate),
      course: selectedEmployee.education.qualification || "",
      specialization: selectedEmployee.education.specialization || "",
      skills: Array.isArray(selectedEmployee.education.skills) ? selectedEmployee.education.skills.join(", ") : selectedEmployee.education.skills || "",
      status: selectedEmployee.profile.status || "Active",
    });

    setEditingId(selectedEmployee.profile.user_id || selectedEmployee.id); // Check which ID to use
    setIsEditing(true);
    setShowProfileModal(false);
    setShowModal(true);
  };

  const handleViewDetails = async (emp) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5001/admin_profile/${emp.id}`, {
        headers: {
          'X-User-Role': 'admin',
          'X-User-ID': '1'
        }
      });
      setSelectedEmployee(response.data);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Error fetching full profile:", error);
      alert("Could not load employee details.");
    }
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedEmployee(null);
  };




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
              <div className="search-container">
                <FaSearch className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="header-right">
              <button className="add-btn" onClick={() => { resetForm(); setShowModal(true); }}>
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
                            className={`emp-name ${highlightName &&
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
                      <button className="view-btn" onClick={() => handleViewDetails(emp)}>View Details</button>
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
          <div className="modal-overlay1">         {/* classname changed/modified */}
            <div className="add-employee-modal1">  {/* classname changed/modified */}
              <div className="modal-header-blue">
                <h3>{isEditing ? "Edit Employee" : "Add New Employee"}</h3>
                <button
                  className="close-btn"
                  onClick={() => {
                    resetForm();
                    setShowModal(false)
                  }}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <form className="add-employee-form" onSubmit={handleSubmit}>
                  <div className="form-left">
                    {/* Profile Upload Section */}
                    <div className="profile-upload-section">
                      <div className="profile-placeholder">
                        <i className="profile-icon">
                          <FaUserFriends size="2em" /> </i>
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
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Please enter name"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && <p className="error-text">{errors.firstName}</p>}
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Please enter name"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && <p className="error-text">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Employee ID</label>
                        <input
                          type="text"
                          name="employeeId"
                          placeholder="Please enter employee ID"
                          value={formData.employeeId}
                          onChange={handleChange}
                        />
                        {errors.employeeId && <p className="error-text">{errors.employeeId}</p>}
                      </div>
                      <div className="form-group">
                        <label>Joining Date</label>
                        <input
                          type="date"
                          name="joiningDate"
                          placeholder="dd/mm/yyyy"
                          value={formData.joiningDate}
                          onChange={handleChange}
                        />
                        {errors.joiningDate && <p className="error-text">{errors.joiningDate}</p>}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Please enter email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Please enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && <p className="error-text">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Employment Type</label>
                        <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Intern">Intern</option>
                        </select>
                  {errors.hrManager && (
                  <p className="error-text">{errors.hrManager}</p>
               )}
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <input type="text" name="department" placeholder="Enter Department" value={formData.department} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Designation</label>
                        <input type="text" name="designation" placeholder="Enter Designation" value={formData.designation} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Date Of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Blood Group</label>
                        <input type="text" name="bloodGroup" placeholder="e.g. A+" value={formData.bloodGroup} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Marital Status</label>
                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                          <option value="">Select</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                  {errors.designation && (
                  <p className="error-text">{errors.designation}</p>
               )}
                      </div>
                      <div className="form-group">
                        <label>Portfolio Link</label>
                        <input type="text" name="portfolioLink" placeholder="URL" value={formData.portfolioLink} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Primary Supervisor</label>
                        <input type="text" name="supervisor" placeholder="Supervisor Name" value={formData.supervisor} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>HR Manager</label>
                        <input type="text" name="hrManager" placeholder="HR Manager Name" value={formData.hrManager} onChange={handleChange} />
                      </div>
                    </div>

                    <h4 style={{ margin: '20px 0 10px', color: '#19bde8' }}>Educational Qualification</h4>
                    <div className="form-row1">
                      <div className="form-group">
                        <label>Institution</label>
                        <input type="text" name="institution" placeholder="Institution Name" value={formData.institution} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Course</label>
                        <input type="text" name="course" placeholder="e.g. Btech" value={formData.course} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Education Start Date</label>
                        <input type="date" name="eduStartDate" value={formData.eduStartDate} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Education End Date</label>
                        <input type="date" name="eduEndDate" value={formData.eduEndDate} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="form-group">
                        <label>Specialization</label>
                        <input type="text" name="specialization" placeholder="e.g. CSE" value={formData.specialization} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>Skills</label>
                        <input type="text" name="skills" placeholder="comma separated" value={formData.skills} onChange={handleChange} />
                      </div>
                    </div>

                    {/* ---------- Modal Actions ---------- */}
                    <div className="modal-actions1">
                      <button type="submit" className="save-btn">
                        {isEditing ? "Save Changes" : "Save"}
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setShowModal(false)
                        }}
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
        {/* ---------- High-Fidelity Profile Detail Modal ---------- */}
        {showProfileModal && selectedEmployee && (
          <div className="profile-overlay-fixed">
            <div className="profile-modal-container">
              {/* HEADER PART */}
              <div className="profile-modal-header">
                <button className="modal-close-times" onClick={closeProfileModal}>×</button>
              </div>

              <div className="profile-modal-scrollable">
                {/* TOP GRID: Image + Details */}
                <div className="profile-top-grid">
                  <div className="profile-image-col">
                    <div className="profile-title-row">
                      <h2 className="profile-title-text">Profile</h2>
                      <div className="header-icon-box" onClick={handleEditClick}>
                        <button className="edit-icon-btn"><FaEdit /></button>
                      </div>
                      <div className="active-tag-box">
                        <span className="active-dot"></span>
                        <span className="active-text">Active</span>
                      </div>
                    </div>

                    <div className="profile-image-card-box">
                      <div className="profile-circular-mask">
                        <img
                          src={selectedEmployee.profile.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"}
                          alt={selectedEmployee.profile.name}
                          className="profile-large-img-circle"
                        />
                      </div>
                      <div className="profile-name-id-pill">
                        {selectedEmployee.profile.name}(ID {selectedEmployee.profile.empId})
                      </div>
                    </div>
                  </div>

                  <div className="details-col">
                    <h5 className="section-title">Personal Details</h5>
                    <div className="info-item">
                      <label>Position</label>
                      <p>{selectedEmployee.profile.position || 'Not Set'}</p>
                    </div>
                    <div className="info-item">
                      <label>Employment Type</label>
                      <p>{selectedEmployee.profile.empType || 'Not Set'}</p>
                    </div>
                    <div className="info-item">
                      <label>Primary Supervisor</label>
                      <p>{selectedEmployee.profile.supervisor || 'Not Assigned'}</p>
                    </div>
                    <div className="info-item">
                      <label>Department</label>
                      <p>{selectedEmployee.profile.department || 'Not Assigned'}</p>
                    </div>
                    <div className="info-item">
                      <label>HR Manager</label>
                      <p>{selectedEmployee.profile.hrManager || 'Not Assigned'}</p>
                    </div>
                  </div>

                  <div className="details-col">
                    <h5 className="section-title">Personal Details</h5>
                    <div className="info-item">
                      <label>Gender</label>
                      <p>{selectedEmployee.profile.gender || 'Female'}</p>
                    </div>
                    <div className="info-item">
                      <label>Date Of Birth</label>
                      <p>{selectedEmployee.profile.dob || '22/07/1993'}</p>
                    </div>
                    <div className="info-item">
                      <label>Blood Group</label>
                      <p>{selectedEmployee.profile.bloodGroup || 'A+'}</p>
                    </div>
                    <div className="info-item">
                      <label>Marital Status</label>
                      <p>{selectedEmployee.profile.maritalStatus || 'Married'}</p>
                    </div>
                    <div className="info-item">
                      <label>Portfolio Link</label>
                      <p className="link-text">{selectedEmployee.education.portfolio || 'http://www.behance'}</p>
                    </div>
                  </div>

                  <div className="details-col">
                    <h5 className="section-title">Educational Qualification</h5>
                    <div className="info-item">
                      <label>Name Of the Institution</label>
                      <p>{selectedEmployee.education.institution || 'Not Specified'}</p>
                    </div>
                    <div className="info-item">
                      <label>Start & Endate</label>
                      <p>{selectedEmployee.education.eduStartDate} - {selectedEmployee.education.eduEndDate}</p>
                    </div>
                    <div className="info-item">
                      <label>Course</label>
                      <p>{selectedEmployee.education.qualification || 'Not Specified'}</p>
                    </div>
                    <div className="info-item">
                      <label>Specialization</label>
                      <p>{selectedEmployee.education.specialization || 'Not Specified'}</p>
                    </div>
                    <div className="info-item">
                      <label>Skills</label>
                      <p>{Array.isArray(selectedEmployee.education.skills) ? selectedEmployee.education.skills.join(", ") : selectedEmployee.education.skills || 'None'}</p>
                    </div>
                  </div>
                </div>

                {/* MIDDLE GRID */}
                <div className="profile-middle-grid">
                  <div className="details-col">
                    <h5 className="section-title">Address</h5>
                    <div className="info-item">
                      <label>Address Line</label>
                      <p>{selectedEmployee.profile.address || 'Not Set'}</p>
                    </div>
                    <div className="info-item">
                      <label>City</label>
                      <p>{selectedEmployee.profile.location || 'Not Set'}</p>
                    </div>
                    <div className="info-item">
                      <label>State</label>
                      <p>Kerala</p>
                    </div>
                    <div className="info-item">
                      <label>Country</label>
                      <p>India</p>
                    </div>
                  </div>

                  <div className="details-col">
                    <h5 className="section-title">Contact Details</h5>
                    <div className="info-item">
                      <label>Phone Number</label>
                      <p>{selectedEmployee.profile.phone}</p>
                    </div>
                    <div className="info-item">
                      <label>Emergency Contact</label>
                      <p>{selectedEmployee.profile.emergencyContactNumber}</p>
                    </div>
                    <div className="info-item">
                      <label>Relationship</label>
                      <p>{selectedEmployee.profile.relationship}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{selectedEmployee.profile.email}</p>
                    </div>
                  </div>

                  <div className="details-col">
                    <h5 className="section-title">Previous Experience</h5>
                    <div className="info-item">
                      <label>Name Of the Company</label>
                      <p>{selectedEmployee.experience.company || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Start & Endate</label>
                      <p>{selectedEmployee.experience.expStartDate} - {selectedEmployee.experience.expEndDate}</p>
                    </div>
                    <div className="info-item">
                      <label>Job Title</label>
                      <p>{selectedEmployee.experience.jobTitle || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Job Description</label>
                      <p className="description-text">{selectedEmployee.experience.responsibilities || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="profile-bottom-grid">
                  <div className="details-col">
                    <h5 className="section-title">Bank Details</h5>
                    <div className="info-item">
                      <label>Bank Name</label>
                      <p>{selectedEmployee.bank.bankName || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Branch</label>
                      <p>{selectedEmployee.bank.branch || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Account Number</label>
                      <p>{selectedEmployee.bank.accountNumber || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>IFSC Code</label>
                      <p>{selectedEmployee.bank.ifsc || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="details-col-span-2">
                    <h5 className="section-title">Submitted Documents</h5>
                    <div className="documents-list">
                      {[
                        { name: "Signed OfferLetter.pdf", size: "94 KB" },
                        { name: "DegreeCertificate.pdf", size: "94 KB" },
                        { name: "PAN CARD.pdf", size: "94 KB" }
                      ].map((doc, idx) => (
                        <div key={idx} className="document-card">
                          <div className="doc-icon-box">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" width="30" />
                          </div>
                          <div className="doc-info-text">
                            <span className="doc-name-main">{doc.name}</span>
                            <div className="doc-status-row">
                              <span className="doc-size-text">{doc.size} of {doc.size} · </span>
                              <div className="doc-status-pill">
                                <span className="doc-checkmark-circle">✔</span>
                                <span className="doc-completed-text">Completed</span>
                              </div>
                            </div>
                          </div>
                          <div className="doc-actions-right">
                            <button className="doc-action-btn"><FiShare2 /></button>
                            <button className="doc-action-btn"><FiDownload /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;