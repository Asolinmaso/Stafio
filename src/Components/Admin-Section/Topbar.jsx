import React, { useEffect, useState, useRef } from "react";
import {
  FaBell,
  FaChevronDown,
  FaPlus,
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaEdit,
  FaShareAlt,
} from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import profileimg from "../../assets/profileimg.png";
import profileimg2 from "../../assets/profileimg2.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import "./Topbar.css";
import topbarsettings from "../../assets/topbarsettings.png";
import { Navigate, useNavigate } from "react-router-dom";
import { searchData } from "./searchData";
import axios from "axios";

import { getCurrentSession } from "../../utils/sessionManager";

const API_BASE = "http://127.0.0.1:5001";

// ProfilePopup Component - fetches data from backend
const ProfilePopup = ({ onClose, username }) => {
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);

  const getAuthHeaders = () => {
    return {
      "X-User-Role": sessionStorage.getItem("current_role"),
      "X-User-ID":
        sessionStorage.getItem("current_user_id") ||
        localStorage.getItem("employee_user_id"),
    };
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId =
          sessionStorage.getItem("current_user_id") ||
          localStorage.getItem("employee_user_id");
        console.log(userId || "nothing");
        const res = await axios.get(`${API_BASE}/admin_profile/${userId}`, {
          headers: {
            ...getAuthHeaders(),
          },
        });
        setProfileData(res.data);
        setEditableData(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const profile = profileData?.profile || {};
  const education = profileData?.education || {};
  const experience = profileData?.experience || {};
  const bank = profileData?.bank || {};

  const handleChange = (section, field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async () => {
    try {
      const userId =
        sessionStorage.getItem("current_user_id") ||
        localStorage.getItem("employee_user_id");

      await axios.put(`${API_BASE}/admin_profile/${userId}`, editableData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      const res = await axios.get(`${API_BASE}/admin_profile/${userId}`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      setProfileData(res.data);
      setEditableData(res.data);

      setIsEditing(false);

      alert("Profile Updated Successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="full-profile-popups">
      <div className="popup-header">
        <h5>
          Profile Details
          {!isEditing ? (
            <FaEdit
              style={{ cursor: "pointer", marginLeft: "15px" }}
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <button
              className="btn btn-success btn-sm ms-2"
              onClick={handleUpdate}
            >
              Save
            </button>
          )}
        </h5>

        <button className="btn-close" onClick={onClose}>
          x
        </button>
      </div>

      <div className="popup-content">
        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : (
          <div className="profile-section">
            <div className="profile-photo">
              <img src={profileimg2} alt="Profile" />
              <h6>{profile.name || username || "User"}</h6>
              <p className="text-success">● {profile.status || "Active"}</p>
            </div>

            <div className="details-grid">
              <div>
                <h6>Personal Details</h6>
                <strong>Position:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.position || ""}
                    onChange={(e) =>
                      handleChange("profile", "position", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.position || "-"}</p>
                )}
                <strong>Employment Type:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.empType || ""}
                    onChange={(e) =>
                      handleChange("profile", "empType", e.target.value)
                    }
                  />
                ) : (
                  <p>{editableData?.profile?.empType || "-"}</p>
                )}
                <strong>
                  {isEditing ? "Supervisor ID" : "Primary Supervisor"}
                </strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.supervisor_id || ""}
                    onChange={(e) =>
                      handleChange("profile", "supervisor_id", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.supervisor || "-"}</p>
                )}
                <strong>Department:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.department || ""}
                    onChange={(e) =>
                      handleChange("profile", "department", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.department || "-"}</p>
                )}
                <strong>{isEditing ? "HR Manager ID" : "HR Manager"}</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.hr_manager_id || ""}
                    onChange={(e) =>
                      handleChange("profile", "hr_manager_id", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.hrManager || "-"}</p>
                )}
              </div>
              <div>
                <h6>Personal Details</h6>
                <strong>Gender:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.gender || ""}
                    onChange={(e) =>
                      handleChange("profile", "gender", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.gender || "-"}</p>
                )}
                <strong>Date of Birth:</strong>
                {isEditing ? (
                  <input
                    type="date"
                    value={editableData?.profile?.dob || ""}
                    onChange={(e) =>
                      handleChange("profile", "dob", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.dob || "-"}</p>
                )}
                <strong>Blood Group:</strong>
                <p>{profile.bloodGroup || "-"}</p>
                <strong>Marital Status:</strong>
                <p>{profile.maritalStatus || "-"}</p>
                <strong>Portfolio:</strong>
                <p>
                  {isEditing ? (
                    <input
                      value={editableData?.education?.portfolio || ""}
                      onChange={(e) =>
                        handleChange("education", "portfolio", e.target.value)
                      }
                    />
                  ) : (
                    <p>{education.portfolio || "-"}</p>
                  )}
                </p>
              </div>
              <div>
                <h6>Educational Qualification</h6>
                <strong>Institution:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.education?.institution || ""}
                    onChange={(e) =>
                      handleChange("education", "institution", e.target.value)
                    }
                  />
                ) : (
                  <p>{education.institution || "-"}</p>
                )}
                <strong>Start & End Date:</strong>

                {isEditing ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={editableData?.education?.eduStartDate || ""}
                      onChange={(e) =>
                        handleChange(
                          "education",
                          "eduStartDate",
                          e.target.value,
                        )
                      }
                    />

                    <input
                      type="date"
                      value={editableData?.education?.eduEndDate || ""}
                      onChange={(e) =>
                        handleChange("education", "eduEndDate", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <p>
                    {education.eduStartDate && education.eduEndDate
                      ? `${education.eduStartDate} & ${education.eduEndDate}`
                      : "-"}
                  </p>
                )}

                <strong>Course:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.education?.qualification || ""}
                    onChange={(e) =>
                      handleChange("education", "qualification", e.target.value)
                    }
                  />
                ) : (
                  <p>{education.qualification || "-"}</p>
                )}
                <strong>Specialization:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.education?.specialization || ""}
                    onChange={(e) =>
                      handleChange(
                        "education",
                        "specialization",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  <p>{education.specialization || "-"}</p>
                )}
                <strong>Skills:</strong>
                <p>
                  {Array.isArray(education.skills)
                    ? education.skills.join(", ")
                    : education.skills || "-"}
                </p>
              </div>
            </div>

            <div className="details-grid">
              <div>
                <h6>Address</h6>
                <strong>Address:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.address || ""}
                    onChange={(e) =>
                      handleChange("profile", "address", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.address || "-"}</p>
                )}
                <strong>Location:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.location || ""}
                    onChange={(e) =>
                      handleChange("profile", "location", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.location || "-"}</p>
                )}
              </div>
              <div>
                <h6>Contact Details</h6>
                <strong>Phone:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.profile?.phone || ""}
                    onChange={(e) =>
                      handleChange("profile", "phone", e.target.value)
                    }
                  />
                ) : (
                  <p>{profile.phone || "-"}</p>
                )}
                <strong>Email:</strong>
                <p>{profile.email || "-"}</p>
              </div>
              <div>
                <h6>Previous Experience</h6>
                <strong>Company:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.experience?.company || ""}
                    onChange={(e) =>
                      handleChange("experience", "company", e.target.value)
                    }
                  />
                ) : (
                  <p>{experience.company || "-"}</p>
                )}
                <strong>Start & End:</strong>

                {isEditing ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={editableData?.experience?.expStartDate || ""}
                      onChange={(e) =>
                        handleChange(
                          "experience",
                          "expStartDate",
                          e.target.value,
                        )
                      }
                    />

                    <input
                      type="date"
                      value={editableData?.experience?.expEndDate || ""}
                      onChange={(e) =>
                        handleChange("experience", "expEndDate", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <p>
                    {experience.expStartDate && experience.expEndDate
                      ? `${experience.expStartDate} – ${experience.expEndDate}`
                      : "-"}
                  </p>
                )}
                <strong>Job Title:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.experience?.jobTitle || ""}
                    onChange={(e) =>
                      handleChange("experience", "jobTitle", e.target.value)
                    }
                  />
                ) : (
                  <p>{experience.jobTitle || "-"}</p>
                )}
                <strong>Description:</strong>
                {isEditing ? (
                  <textarea
                    value={editableData?.experience?.responsibilities || ""}
                    onChange={(e) =>
                      handleChange(
                        "experience",
                        "responsibilities",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  <p>{experience.responsibilities || "-"}</p>
                )}
              </div>
            </div>

            <div className="details-grid">
              <div>
                <h6>Bank Details</h6>
                <strong>Bank Name:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.bank?.bankName || ""}
                    onChange={(e) =>
                      handleChange("bank", "bankName", e.target.value)
                    }
                  />
                ) : (
                  <p>{bank.bankName || "-"}</p>
                )}
                <strong>Branch:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.bank?.branch || ""}
                    onChange={(e) =>
                      handleChange("bank", "branch", e.target.value)
                    }
                  />
                ) : (
                  <p>{bank.branch || "-"}</p>
                )}
                <strong>Account Number:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.bank?.accountNumber || ""}
                    onChange={(e) =>
                      handleChange("bank", "accountNumber", e.target.value)
                    }
                  />
                ) : (
                  <p>{bank.accountNumber || "-"}</p>
                )}
                <strong>IFSC Code:</strong>
                {isEditing ? (
                  <input
                    value={editableData?.bank?.ifsc || ""}
                    onChange={(e) =>
                      handleChange("bank", "ifsc", e.target.value)
                    }
                  />
                ) : (
                  <p>{bank.ifsc || "-"}</p>
                )}
              </div>
              <div className="submitted-docs">
                <h6>Submitted Documents</h6>
                <div className="doc-item">No documents uploaded</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Topbar = () => {
  const [adminusername, setAdminusername] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [query, setQuery] = useState("");
  const [searchItems, setSearchItems] = useState(searchData);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const popupRef = useRef(null);
  const dateInputRef = useRef(null);

  const [formData, setFormData] = useState({
    date: "",
    eventName: "",
    time: "",
    eventType: "",
    message: "",
    employee: "",
    name: "",
    email: "",
    designation: "",
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/broadcast`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    // Load saved announcements from localStorage as fallback
    const savedAnnouncements = localStorage.getItem("announcements");
    if (savedAnnouncements && savedAnnouncements !== "undefined") {
      try {
        setAnnouncements(JSON.parse(savedAnnouncements));
      } catch (err) {
        console.error("Error parsing announcements:", err);
        setAnnouncements([]);
      }
    }
  }, []);

  useEffect(() => {
    const session = getCurrentSession();

    if (session) {
      setAdminusername(session.username);
      setUsername(session.username);
      setRole(session.role);
    }
  }, []);

  const togglePopup = () => {
    if (!showPopup) {
      fetchAnnouncements();
    }
    setShowPopup(!showPopup);
    setShowAddForm(false);
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
        setShowAddForm(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminId =
        sessionStorage.getItem("current_user_id") ||
        localStorage.getItem("employee_user_id") ||
        "1";
      const payload = {
        event_date: formData.date || null,
        event_name: formData.eventName || formData.title,
        event_time: formData.time || null,
        event_type: formData.eventType || null,
        message: formData.message,
        target_audience: "all",
        mentioned_employee_id: formData.employee
          ? parseInt(formData.employee)
          : null,
        author_name: formData.name || null,
        author_email: formData.email || null,
        author_designation: formData.designation || null,
      };

      await axios.post(`${API_BASE}/api/admin/announcements`, payload, {
        headers: {
          "X-User-ID": adminId,
          "X-User-Role": "admin",
        },
      });

      fetchAnnouncements();
      setFormData({
        date: "",
        eventName: "",
        time: "",
        eventType: "",
        message: "",
        employee: "",
        name: "",
        email: "",
        designation: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("Failed to send announcement to the backend.");
    }
  };

  const navigate = useNavigate();

  const handleSelect = (item) => {
    setQuery("");

    if (item.type === "employee") {
      navigate("/employees-list", {
        state: {
          highlightName: item.label,
          empId: item.subLabel,
        },
      });
    } else {
      navigate(item.path);
    }
  };

  const filteredResults = searchItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.subLabel?.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5001/api/employeeslist");

        const employeeItems = res.data.map((emp) => ({
          type: "employee",
          label: emp.name,
          subLabel: emp.empId,
          path: `/employees-list/${emp.empId}`,
        }));

        setSearchItems([...searchData, ...employeeItems]);
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      <div className="topbar shadow-sm d-flex align-items-center justify-content-between px-3">
        {/* Left logo */}
        <div className="topbar-logo d-flex align-items-center">
          <img src={stafiologoimg} alt="Logo" className="topbar-img" />
        </div>

        {/* Search box */}
        <div className="topbar-searches flex-grow-1 mx-3 position-relative">
          <input
            type="text"
            className="form-controler"
            placeholder="Quick Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              console.log(e.target.value);
            }}
          />

          {query && (
            <div className="search-dropdown">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <div
                    key={index}
                    className="search-item"
                    onClick={() => handleSelect(item)}
                  >
                    <span className="search-type">{item.type}</span>
                    <span>{item.label}</span>
                  </div>
                ))
              ) : (
                <div className="search-item no-result">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Right side user + bell */}
        <div className="profile d-flex align-items-center gap-3">
          <div style={{ cursor: "pointer", position: "relative" }}>
            <FaBell size={20} className="text-dark" onClick={togglePopup} />
          </div>
          <div style={{ cursor: "pointer" }}>
            <img
              src={topbarsettings}
              alt="Profile Logo"
              className="topbar-settings"
              onClick={() => navigate("/admin-settings")}
            />
          </div>

          <div
            className="profile-data d-flex align-items-center"
            onClick={() => setShowProfilePopup((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={profileimg}
              alt="User"
              className="topbar-avatar rounded-circle me-2"
            />
            <div>
              <div className="fw-bold">{username || "User"}</div>
              <div className="text-muted small">{role}</div>
            </div>
          </div>

          <div
            className="chevron-container"
            onClick={() => setShowProfilePopup((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <FaChevronDown />
          </div>
        </div>
      </div>

      {/* Announcement Popup */}
      {showPopup && !showAddForm && (
        <div className="announcement-popup shadow-lg" ref={popupRef}>
          <div className="popup-header d-flex align-items-center justify-content-between">
            <div className="announcement-left">
              <div
                className="announcement-dropdown"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <span className="fw-semi-bold fs-5">Announcement</span>
                <span className="filter-text">{selectedFilter}</span>
                <FaChevronDown />
              </div>

              {filterOpen && (
                <div className="dropdown-menu-custom">
                  <div
                    onClick={() => {
                      setSelectedFilter("All");
                      setFilterOpen(false);
                    }}
                  >
                    All
                  </div>
                  <div
                    onClick={() => {
                      setSelectedFilter("New");
                      setFilterOpen(false);
                    }}
                  >
                    New
                  </div>
                  <div
                    onClick={() => {
                      setSelectedFilter("Old");
                      setFilterOpen(false);
                    }}
                  >
                    Old
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="announcement-right">
              <div className="announce-calendar-box">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="custom-date-input"
                />
                <FaChevronDown
                  className="fachevron-box"
                  onClick={() => {
                    if (dateInputRef.current) {
                      dateInputRef.current.showPicker();
                    }
                  }}
                />
              </div>

              <div
                className="add-new-link"
                onClick={() => {
                  setShowPopup(false);
                  setShowAddForm(true);
                }}
              >
                <FaPlus className="plus-icon" /> Add New
              </div>
            </div>
          </div>

          <hr />

          <div className="popup-content">
            {announcements.length === 0 ? (
              <div className="text-center text-muted py-5">
                No announcements yet.
              </div>
            ) : (
              <ul className="announcement-list">
                {announcements.map((a, i) => (
                  <li key={i} className="announcement-item">
                    <div className="announcement-header">
                      <div className="announcement-name fw-bold">
                        {a.author_name || a.name || "Unknown"}
                      </div>
                    </div>
                    <div className="announcement-meta text-muted small">
                      <span>
                        {a.author_designation || a.designation || "No Designation"}
                      </span>
                    </div>
                    <div className="announcement-eventname">
                      <span className="eventname">
                        {a.eventName || a.title || "Untitled Event"}
                        <span className="dot"> : </span>
                        <span>{a.event_date || a.date || "No Date"}</span>
                        <span className="dot">, </span>
                        <span>{a.event_time || a.time || "No Time"}</span>
                      </span>
                    </div>
                    <div className="announcement-message mt-2">
                      {a.message || "No message provided."}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Add Announcement Form Popup */}
      {showAddForm && (
        <div className="announcement-popup shadow-lg" ref={popupRef}>
          <div className="popup-header d-flex align-items-center justify-content-between">
            <h5>Add Announcement</h5>
            <button className="btn-close" onClick={handleCancel}>x</button>
          </div>
          <div className="popup-content">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label>Event Name</label>
                <input
                  className="form-control"
                  value={formData.eventName}
                  onChange={(e) =>
                    setFormData({ ...formData, eventName: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Event Type</label>
                <input
                  className="form-control"
                  value={formData.eventType}
                  onChange={(e) =>
                    setFormData({ ...formData, eventType: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Message</label>
                <textarea
                  className="form-control"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Employee ID</label>
                <input
                  className="form-control"
                  value={formData.employee}
                  onChange={(e) =>
                    setFormData({ ...formData, employee: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Author Name</label>
                <input
                  className="form-control"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Author Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Designation</label>
                <input
                  className="form-control"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Profile Popup */}
      {showProfilePopup && (
        <ProfilePopup
          onClose={() => setShowProfilePopup(false)}
          username={adminusername}
        />
      )}
    </>
  );
};

export default Topbar;