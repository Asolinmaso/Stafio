import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./Employees.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../../utils/apiClient";
import group10 from "../../../assets/Group10.png";
import {
  FaUserFriends,
  FaSearch,
  FaFilter,
  FaEdit,
  FaPlusCircle,
} from "react-icons/fa";
import { FiShare2, FiDownload } from "react-icons/fi";

const Employee = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    department: "all",
    position: "all",
    status: "all",
  });

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
    status: "Active",
  };

  //new state
  const [allEmployees, setAllEmployees] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
    setProfileImage(null);
    setPreviewImage(null);
  };

  // Helper to generate the next Employee ID
  const generateNextId = () => {
    if (!allEmployees || allEmployees.length === 0) return "1001";

    const numericIds = allEmployees
      .map(emp => parseInt(emp.empId))
      .filter(id => !isNaN(id));

    if (numericIds.length === 0) return "1001";

    return (Math.max(...numericIds) + 1).toString();
  };

  const handleAddNewEmployee = () => {
    resetForm();
    const nextId = generateNextId();
    setFormData(prev => ({
      ...prev,
      employeeId: nextId
    }));
    setIsEditing(false);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image should be below 4 MB");
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const navigate = useNavigate();

  const location = useLocation();
  const highlightName = location.state?.highlightName || "";

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

    const selectFields = [
      "employmentType",
      "supervisor",
      "hrManager",
      "department",
      "designation",
    ];

    selectFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "*Please select an option";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const payload = new FormData();
        Object.keys(formData).forEach((key) => {
          payload.append(key, formData[key] || "");
        });
        if (profileImage) {
          payload.append("profileImage", profileImage);
        }

        if (isEditing) {
          const response = await apiClient.put(
            `/api/employees/${editingId}`,
            payload
          );
          alert(response.data.message);
        } else {
          const response = await apiClient.post("/api/employees", payload);
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
      const parts = dateStr.split("/");
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
      skills: Array.isArray(selectedEmployee.education.skills)
        ? selectedEmployee.education.skills.join(", ")
        : selectedEmployee.education.skills || "",
      status: selectedEmployee.profile.status || "Active",
    });

    setEditingId(selectedEmployee.profile.user_id || selectedEmployee.id); // Check which ID to use
    setPreviewImage(selectedEmployee.profile.profile_image || null);
    setIsEditing(true);
    setShowProfileModal(false);
    setShowModal(true);
  };

  const handleViewDetails = async (emp) => {
    try {
      const response = await apiClient.get(`/admin_profile/${emp.id}`, {
        headers: {
          "X-User-Role": "admin",
          "X-User-ID": "1",
        },
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
        const response = await apiClient.get("/api/employeeslist");
        console.log("API DATA:", response.data);
        setAllEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch staff list for dropdowns
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await apiClient.get("/api/staff_list");
        setStaffList(response.data);
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy]);

  //  Filtered + Sorted Employees
  const finalEmployees = React.useMemo(() => {
    let data = [...allEmployees];

    //  Highlight name
    if (highlightName.trim()) {
      data = data.filter((emp) =>
        emp.name.toLowerCase().includes(highlightName.toLowerCase()),
      );
    }

    //  Search
    if (searchTerm.trim()) {
      data = data.filter((emp) =>
        `${emp.name} ${emp.email} ${emp.empId}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    }

    // Name filter (from filter panel)
    if (filters.name.trim()) {
      data = data.filter((emp) =>
        emp.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }

    // Department
    if (filters.department !== "all") {
      data = data.filter((emp) => emp.department === filters.department);
    }

    //  Position
    if (filters.position !== "all") {
      data = data.filter((emp) => emp.position === filters.position);
    }

    // Status
    if (filters.status !== "all") {
      data = data.filter((emp) => emp.status === filters.status);
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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentEmployees = finalEmployees.slice(
    indexOfFirstRow,
    indexOfLastRow,
  );

  const totalPages = Math.max(
    1,
    Math.ceil(finalEmployees.length / rowsPerPage),
  );

  const showingCount = currentEmployees.length;
  const totalCount = finalEmployees.length;

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
            <div className="empl-header-left">
              <h2>Employees</h2>

              <div className="top-buttons">
                <button
                  className="empl-btn-apply"
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
              <button
                className="add-btn"
                onClick={handleAddNewEmployee}
              >
                + New Employee
              </button>

              <div className="filter-sort">
                {/* FILTER BUTTON */}
                <div className="filter-wrapper">
                  <button
                    className="right-butn-filterr"
                    onClick={() => setShowFilters((prev) => !prev)}
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
                              setFilters({
                                ...filters,
                                department: e.target.value,
                              })
                            }
                          >
                            <option value="all">Select</option>
                            <option value="Human Resource">
                              Human Resource
                            </option>
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
                              setFilters({
                                ...filters,
                                position: e.target.value,
                              })
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
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#9ca3af",
                    }}
                  >
                    No employees found
                  </td>
                </tr>
              ) : (
                currentEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-info">
                        <img
                          src={emp.image}
                          alt={emp.name}
                          className="emp-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`;
                          }}
                        />
                        <div>
                          <p
                            className={`emp-name ${highlightName && emp.name.toLowerCase().includes(highlightName.toLowerCase()) ? "highlight" : ""}`}
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
                    <td className="status">{emp.status}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(emp)}
                      >
                        View Details
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ---------- Pagination Section ---------- */}
          <div className="pagination">
            <div className="showing">
              Showing {showingCount} of {totalCount}
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset page
                }}
              >
                <option value={7}>07</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="page-nav">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                Prev
              </button>

              <span className="page-num">
                {String(currentPage).padStart(2, "0")}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Modal Popup ---------- */}
        {showModal && (
          <div className="modal-overlay1">
            {" "}
            {/* classname changed/modified */}
            <div className="add-employee-modal1">
              {" "}
              {/* classname changed/modified */}
              <div className="empl-modal-header-blue">
                <h3>Add New Employee</h3>
                <button
                  className="empl-close-btn"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="empl-modal-body">
                <form className="add-employee-form" onSubmit={handleSubmit}>
                  <div className="empl-form-left">
                    {/* Profile Upload Section */}
                    <div className="profile-upload-section">
                      <div className="profile-placeholder">
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <i className="profile-icon">
                            <FaUserFriends size="2em" />{" "}
                          </i>
                        )}
                      </div>
                      <div className="upload-info">
                        <h4>Upload Profile Image</h4>
                        <p>Image should be below 4 MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          id="profileImageInput"
                          onChange={handleImageChange}
                        />
                        <button
                          type="button"
                          className="new-empl-upload-btn1"
                          onClick={() => document.getElementById("profileImageInput").click()}
                        >
                          Upload
                        </button>
                      </div>
                    </div>

                    {/* Form Rows */}
                    <div className="form-row1">
                      <div className="empl-form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Please enter name"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && (
                          <p className="error-text">{errors.firstName}</p>
                        )}
                      </div>
                      <div className="empl-form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Please enter name"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && (
                          <p className="error-text">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="empl-form-group">
                        <label>Employee ID</label>
                        <input
                          type="text"
                          name="employeeId"
                          placeholder="Please enter employee ID"
                          value={formData.employeeId}
                          onChange={handleChange}
                        />
                        {errors.employeeId && (
                          <p className="error-text">{errors.employeeId}</p>
                        )}
                      </div>
                      <div className="empl-form-group">
                        <label>Joining Date</label>
                        <input
                          type="date"
                          name="joiningDate"
                          placeholder="dd/mm/yyyy"
                          value={formData.joiningDate}
                          onChange={handleChange}
                        />
                        {errors.joiningDate && (
                          <p className="error-text">{errors.joiningDate}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="empl-form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Please enter email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <p className="error-text">{errors.email}</p>
                        )}
                      </div>
                      <div className="empl-form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Please enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && (
                          <p className="error-text">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="empl-form-group">
                        <label>Employment Type</label>
                        <select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Intern">Intern</option>
                        </select>
                        {errors.employmentType && (
                          <p className="error-text">{errors.employmentType}</p>
                        )}
                      </div>
                      <div className="empl-form-group">
                        <label>Primary Supervisor</label>
                        <select
                          name="supervisor"
                          value={formData.supervisor}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {staffList.map((staff) => (
                            <option key={staff.id} value={staff.name}>
                              {staff.name}
                            </option>
                          ))}
                        </select>
                        {errors.supervisor && (
                          <p className="error-text">{errors.supervisor}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="empl-form-group">
                        <label>HR Manager</label>
                        <select
                          name="hrManager"
                          value={formData.hrManager}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {staffList
                            .filter((staff) => staff.role === "admin")
                            .map((staff) => (
                              <option key={staff.id} value={staff.name}>
                                {staff.name}
                              </option>
                            ))}
                        </select>
                        {errors.hrManager && (
                          <p className="error-text">{errors.hrManager}</p>
                        )}
                      </div>
                      <div className="empl-form-group">
                        <label>Department</label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                        </select>
                        {errors.department && (
                          <p className="error-text">{errors.department}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-row1">
                      <div className="empl-form-group">
                        <label>Designation</label>
                        <select
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Software Engineer">
                            Software Engineer
                          </option>
                          <option value="Senior Engineer">
                            Senior Engineer
                          </option>
                          <option value="Team Lead">Team Lead</option>
                          <option value="Manager">Manager</option>
                        </select>
                        {errors.designation && (
                          <p className="error-text">{errors.designation}</p>
                        )}
                      </div>
                      <div className="empl-form-group">
                        <label>Status</label>
                        <select>
                          <option>Active</option>
                          <option>Inactive</option>
                          <option>Pending</option>
                        </select>
                      </div>
                    </div>

                    {/* ---------- Modal Actions ---------- */}
                    <div className="modal-actions01">
                      <button type="submit" className="save-btn">
                        Save
                      </button>
                      <button
                        type="button"
                        className="action-cancel-btn"
                        onClick={() => {
                          setShowModal(false);
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

        {/* ---------- High-Fidelity Profile Detail Modal ---------- (View details) */}
        {showProfileModal && selectedEmployee && (
          <div className="profile-overlay-fixed">
            <div className="profile-modal-container">
              {/* HEADER PART */}
              <div className="profile-modal-header">
                <button
                  className="modal-close-times"
                  onClick={closeProfileModal}
                >
                  ×
                </button>
              </div>
              <div className="profile-modal-scrollable">
                {/* TOP GRID: Image + Details */}
                <div className="profile-top-grid">
                  <div className="profile-image-col">
                    <div className="profile-title-row">
                      <h2 className="profile-title-text">Profile</h2>
                      <div
                        className="header-icon-box"
                        onClick={handleEditClick}
                      >
                        <button className="edit-icon-btn">
                          <FaEdit />
                        </button>
                      </div>
                      <div className="active-tag-box">
                        <span className="active-dot"></span>
                        <span className="active-text">Active</span>
                      </div>
                    </div>
                    <div className="profile-image-card-box">
                      <div className="profile-circular-mask">
                        <img
                          src={
                            selectedEmployee.profile.profileImage ||
                            "https://randomuser.me/api/portraits/women/44.jpg"
                          }
                          alt={selectedEmployee.profile.name}
                          className="profile-large-img-circle"
                        />
                      </div>
                      <div className="profile-name-id-pill">
                        {selectedEmployee.profile.name}(ID{" "}
                        {selectedEmployee.profile.empId})
                      </div>
                    </div>
                  </div>
                  <div className="details-col">
                    <h5 className="section-title">Personal Details</h5>
                    <div className="info-item">
                      <label>Position</label>
                      <p>{selectedEmployee.profile.position || "Not Set"}</p>
                    </div>
                    <div className="info-item">
                      <label>Employment Type</label>
                      <p>{selectedEmployee.profile.empType || "Not Set"}</p>
                    </div>
                    <div className="info-item">
                      <label>Department</label>
                      <p>{selectedEmployee.profile.department || "Not Set"}</p>
                    </div>
                    <div className="info-item">
                      <label>Joining Date</label>
                      <p>{selectedEmployee.profile.joiningDate || "Not Set"}</p>
                    </div>
                  </div>
                </div>
                <div className="profile-details-full-grid">
                  <div className="details-section-box">
                    <h5 className="section-title">Contact & Other Info</h5>
                    <div className="full-grid-2col">
                      <div className="info-item">
                        <label>Email</label>
                        <p>{selectedEmployee.profile.email || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>Phone</label>
                        <p>{selectedEmployee.profile.phone || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>Reports To</label>
                        <p>{selectedEmployee.profile.supervisor || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>HR Manager</label>
                        <p>{selectedEmployee.profile.hrManager || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>Gender</label>
                        <p>{selectedEmployee.profile.gender || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>Marital Status</label>
                        <p>{selectedEmployee.profile.maritalStatus || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>Date of Birth</label>
                        <p>{selectedEmployee.profile.dob || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>Blood Group</label>
                        <p>{selectedEmployee.profile.bloodGroup || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="details-section-box">
                    <h5 className="section-title">
                      Educational & Professional
                    </h5>
                    <div className="full-grid-2col">
                      <div className="info-item">
                        <label>Institution</label>
                        <p>{selectedEmployee.education.institution || "N/A"}</p>
                      </div>
                      <div className="info-item">
                        <label>Qualification</label>
                        <p>
                          {selectedEmployee.education.qualification || "N/A"}
                        </p>
                      </div>
                      <div className="info-item">
                        <label>Specialization</label>
                        <p>
                          {selectedEmployee.education.specialization || "N/A"}
                        </p>
                      </div>
                      <div className="info-item">
                        <label>Skills</label>
                        <p>
                          {Array.isArray(selectedEmployee.education.skills)
                            ? selectedEmployee.education.skills.join(", ")
                            : selectedEmployee.education.skills || "N/A"}
                        </p>
                      </div>
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
