import React, { useEffect, useState, useRef } from "react";
import {
  FaBell,
  FaChevronDown,
  FaPlus,
  FaTimes,
  FaFilePdf,
  FaDownload,
} from "react-icons/fa";
import profileimg from "../../assets/profileimg.png";
import profileimg2 from "../../assets/profileimg2.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import "./Topbar.css";
import topbarsettings from "../../assets/topbarsettings.png";
import { Navigate, useNavigate } from "react-router-dom";
import { searchData } from "./searchData";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { getCurrentSession } from "../../utils/sessionManager";


const BASE_URL = "http://127.0.0.1:5001";

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
  const popupRef = useRef(null);

  // ── Profile popup state ──────────────────────────────────────────────
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [adminUserId, setAdminUserId] = useState(null);
  // ────────────────────────────────────────────────────────────────────

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

  useEffect(() => {
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
      setAdminUserId(session.user_id);
    }
  }, []);

  useEffect(() => {
    if (announcements.length > 0) {
      localStorage.setItem("announcements", JSON.stringify(announcements));
    }
  }, [announcements]);

  // ── Fetch profile from backend ───────────────────────────────────────
  useEffect(() => {
    if (showProfilePopup && adminUserId) {
      fetchProfile();
    }
  }, [showProfilePopup, adminUserId]);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin_profile/${adminUserId}`, {
        headers: {
          "X-User-Role": "admin",
          "X-User-ID": String(adminUserId),
        },
      });
      setProfileData(res.data);
      setEditData(JSON.parse(JSON.stringify(res.data)));
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Handle field change in edit mode ────────────────────────────────
  const handleProfileFieldChange = (section, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // ── Save changes to backend ──────────────────────────────────────────
  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      // Helper: send null instead of empty string for date fields
      const dateVal = (val) => (val && val.trim() !== "" ? val : null);

      // PUT /api/employee_profile/<user_id>
      const empPayload = {
        gender: editData.profile.gender || "",
        dob: dateVal(editData.profile.dob),
        marital_status: editData.profile.maritalStatus || "",
        nationality: editData.profile.nationality || "",
        blood_group: editData.profile.bloodGroup || "",
        // address: combine 4 fields into one string
        address: [
          editData.profile.addressLine,
          editData.profile.city,
          editData.profile.state,
          editData.profile.country,
        ].filter(Boolean).join(", "),
        emergency_contact: editData.profile.emergencyContactNumber || "",
        emergency_relationship: editData.profile.relationship || "",
        emp_type: editData.profile.empType || "",
        department: editData.profile.department || "",
        position: editData.profile.position || "",
        location: editData.profile.location || "",
        status: editData.profile.status || "",
        institution: editData.education.institution || "",
        edu_start_date: dateVal(editData.education.eduStartDate),
        edu_end_date: dateVal(editData.education.eduEndDate),
        qualification: editData.education.qualification || "",
        specialization: editData.education.specialization || "",
        skills: editData.education.skills || "",   // plain string
        portfolio: editData.education.portfolio || "",
        prev_company: editData.experience.company || "",
        prev_job_title: editData.experience.jobTitle || "",
        exp_start_date: dateVal(editData.experience.expStartDate),
        exp_end_date: dateVal(editData.experience.expEndDate),
        responsibilities: editData.experience.responsibilities || "",
        bank_name: editData.bank.bankName || "",
        bank_branch: editData.bank.branch || "",
        account_number: editData.bank.accountNumber || "",
        ifsc_code: editData.bank.ifsc || "",
        aadhaar_number: editData.bank.aadhaar || "",
        pan_number: editData.bank.pan || "",
      };

      await axios.put(`${BASE_URL}/api/employee_profile/${adminUserId}`, empPayload, {
        headers: { "X-User-ID": String(adminUserId), "X-User-Role": "admin" },
      });

      // PUT /api/user/<user_id>
      const nameParts = (editData.profile.name || "").trim().split(" ");
      await axios.put(
        `${BASE_URL}/api/user/${adminUserId}`,
        {
          first_name: nameParts[0] || "",
          last_name: nameParts.slice(1).join(" ") || "",
          email: editData.profile.email,
          phone: editData.profile.phone,
        },
        { headers: { "X-User-ID": String(adminUserId), "X-User-Role": "admin" } }
      );

      // Refresh from backend and exit edit mode
      await fetchProfile();
      setIsEditMode(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileCancel = () => {
    setEditData(JSON.parse(JSON.stringify(profileData)));
    setIsEditMode(false);
  };
  // ────────────────────────────────────────────────────────────────────

  const togglePopup = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      alert("Please enter a message.");
      return;
    }
    const updatedAnnouncements = [...announcements, { ...formData }];
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
    window.dispatchEvent(new Event("announcementUpdated"));
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
  };

  const navigate = useNavigate();

  const handleSelect = (item) => {
    setQuery("");
    if (item.type === "employee") {
      navigate("/employees-list", {
        state: { highlightName: item.label, empId: item.subLabel },
      });
    } else {
      navigate(item.path);
    }
  };

  const filteredResults = searchItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.subLabel?.toLowerCase().includes(query.toLowerCase())
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

  // ── Helper: parse stored address string into 4 parts ────────────────
  const parseAddress = (addressStr) => {
    if (!addressStr) return { addressLine: "", city: "", state: "", country: "" };
    const parts = addressStr.split(",").map((s) => s.trim());
    return {
      addressLine: parts[0] || "",
      city: parts[1] || "",
      state: parts[2] || "",
      country: parts[3] || "",
    };
  };

  // Inject parsed address fields into editData when entering edit mode
  const handleEnterEditMode = () => {
    if (profileData) {
      const parsed = parseAddress(profileData.profile?.address);
      setEditData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          addressLine: parsed.addressLine,
          city: parsed.city,
          state: parsed.state,
          country: parsed.country,
        },
      }));
    }
    setIsEditMode(true);
  };

  // ── Helper: one field in view/edit mode ─────────────────────────────
  const d = isEditMode ? editData : profileData;

  // Safely convert any value (array/object/string) to a displayable string
  const toDisplayString = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  // Safely convert any value to a string for input field value
  const toInputString = (val) => {
    if (val === null || val === undefined) return "";
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object") return "";
    return String(val);
  };

  const renderField = (label, section, field, type = "text") => (
    <div key={field}>
      <strong>{label}:</strong>
      {isEditMode ? (
        type === "textarea" ? (
          <textarea
            className="profile-edit-input"
            value={toInputString(editData?.[section]?.[field])}
            onChange={(e) => handleProfileFieldChange(section, field, e.target.value)}
          />
        ) : (
          <input
            className="profile-edit-input"
            type={type}
            value={toInputString(editData?.[section]?.[field])}
            onChange={(e) => handleProfileFieldChange(section, field, e.target.value)}
          />
        )
      ) : (
        <p>{toDisplayString(profileData?.[section]?.[field])}</p>
      )}
    </div>
  );
  // ────────────────────────────────────────────────────────────────────

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
            <div className="fw-bold fs-5">Announcement</div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => {
                setShowPopup(false);
                setShowAddForm(true);
              }}
            >
              <FaPlus /> Add New
            </button>
          </div>
          <hr />
          <div className="popup-content">
            {announcements.length === 0 ? (
              <div className="text-center text-muted py-5">No announcements yet.</div>
            ) : (
              <ul className="announcement-list">
                {announcements.map((a, i) => (
                  <li key={i} className="announcement-item">
                    <div className="announcement-name">{a.name || "Unknown"}</div>
                    <div className="announcement-meta">{a.designation || "No Designation"}</div>
                    <div className="announcement-eventname">{a.eventName}</div>
                    <div className="announcement-message">{a.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Add New Announcement Modal */}
      {showAddForm && (
        <div className="add-announcement-overlay">
          <div className="add-form-container">
            <div className="form-header">
              <h5>Add New Announcement</h5>
              <FaTimes className="close-icon" onClick={() => setShowAddForm(false)} />
            </div>
            <form onSubmit={handleSubmit} className="announcement-form">
              <div className="form-grid">
                <div>
                  <label>Event Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} />
                </div>
                <div>
                  <label>Event Name</label>
                  <input type="text" name="eventName" placeholder="Enter name of event" value={formData.eventName} onChange={handleChange} />
                </div>
                <div>
                  <label>Time Of The Event</label>
                  <input type="time" name="time" value={formData.time} onChange={handleChange} />
                </div>
                <div>
                  <label>Event Type</label>
                  <select name="eventType" value={formData.eventType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Holiday">Holiday</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="full-width">
                  <label>Message</label>
                  <textarea name="message" placeholder="Type message" value={formData.message} onChange={handleChange}></textarea>
                </div>
                <div>
                  <label>Mention Any Employee</label>
                  <input type="text" name="employee" placeholder="Enter employee name" value={formData.employee} onChange={handleChange} />
                </div>
                <hr />
                <h6 className="fw-bold">Your Details</h6>
                <div>
                  <label>Name</label>
                  <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <label>Designation</label>
                  <input type="designation" name="designation" placeholder="Enter your designation" value={formData.designation} onChange={handleChange} />
                </div>
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Full Profile Popup ─────────────────────────────────────────── */}
      {showProfilePopup && (
        <div className="full-profile-popups">

          {/* Header */}
          <div className="popup-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h5 style={{ margin: 0 }}>Profile</h5>
              {/* Cyan edit icon — only shown in view mode */}
              {!isEditMode && (
              <button
                onClick={handleEnterEditMode}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  color: "#00bcd4"
                }}
                title="Edit Profile"
              >
                <FiEdit size={18} />
              </button>
            )}
            </div>

            {/* Right side of header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {isEditMode ? (
                <>
                  <button
                    onClick={handleProfileCancel}
                    disabled={profileSaving}
                    style={{ background: "#f1f4f8", border: "none", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    style={{ background: "#00bcd4", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
                  >
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  className="btn-close"
                  onClick={() => setShowProfilePopup(false)}
                ></button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="popup-content">
            <div className="profile-section">

              {/* Loading state */}
              {profileLoading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                  Loading profile...
                </div>
              ) : (
                <>
                  {/* Profile photo */}
                  <div className="profile-photo">
                    <img src={profileimg2} alt="Profile" />
                    <h6>{d?.profile?.name || adminusername || "User"}</h6>
                    <p className="text-success">● Active</p>
                  </div>

                  {/* Row 1 */}
                  <div className="details-grid">
                    <div>
                      <h6>Personal Details</h6>
                      {renderField("Position", "profile", "position")}
                      {renderField("Employment Type", "profile", "empType")}
                      <div><strong>Primary Supervisor:</strong><p>{profileData?.profile?.supervisor || "—"}</p></div>
                      {renderField("Department", "profile", "department")}
                      <div><strong>HR Manager:</strong><p>{profileData?.profile?.hrManager || "—"}</p></div>
                    </div>
                    <div>
                      <h6>Personal Details</h6>
                      {renderField("Gender", "profile", "gender")}
                      {renderField("Date of Birth", "profile", "dob", "date")}
                      {renderField("Blood Group", "profile", "bloodGroup")}
                      {renderField("Marital Status", "profile", "maritalStatus")}
                      {renderField("Portfolio", "education", "portfolio")}
                    </div>
                    <div>
                      <h6>Educational Qualification</h6>
                      {renderField("Institution", "education", "institution")}
                      {/* Start & End Date: view combined, edit split */}
                      {!isEditMode ? (
                        <>
                          <strong>Start & End Date:</strong>
                          <p>
                            {profileData?.education?.eduStartDate || "—"}{" "}
                            {profileData?.education?.eduEndDate ? `– ${profileData.education.eduEndDate}` : ""}
                          </p>
                        </>
                      ) : (
                        <>
                          <strong>Start Date:</strong>
                          <input className="profile-edit-input" type="date" value={editData?.education?.eduStartDate || ""} onChange={(e) => handleProfileFieldChange("education", "eduStartDate", e.target.value)} />
                          <strong>End Date:</strong>
                          <input className="profile-edit-input" type="date" value={editData?.education?.eduEndDate || ""} onChange={(e) => handleProfileFieldChange("education", "eduEndDate", e.target.value)} />
                        </>
                      )}
                      {renderField("Course", "education", "qualification")}
                      {renderField("Specialization", "education", "specialization")}
                      {renderField("Skills", "education", "skills")}
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="details-grid">
                    <div>
                      <h6>Address</h6>
                      {/* View mode: show combined address. Edit mode: show 4 separate fields */}
                      {!isEditMode ? (
                        <>
                          <div>
                          <strong>Address Line:</strong>
                          <p>{profileData?.profile?.address?.split(",")[0]?.trim() || "—"}</p>
                          </div>
                          <div>
                          <strong>City:</strong>
                          <p>{profileData?.profile?.address?.split(",")[1]?.trim() || "—"}</p>
                          </div>
                          <div>
                          <strong>State:</strong>
                          <p>{profileData?.profile?.address?.split(",")[2]?.trim() || "—"}</p>
                          </div>
                          <div>
                          <strong>Country:</strong>
                          <p>{profileData?.profile?.address?.split(",")[3]?.trim() || "—"}</p>
                          </div>
                        </>
                      ) : (
                        <>
                        <div>
                          <strong>Address Line:</strong>
                          <input className="profile-edit-input" type="text" value={editData?.profile?.addressLine || ""} onChange={(e) => handleProfileFieldChange("profile", "addressLine", e.target.value)} />
                        </div>
                        <div>
                          <strong>City:</strong>
                          <input className="profile-edit-input" type="text" value={editData?.profile?.city || ""} onChange={(e) => handleProfileFieldChange("profile", "city", e.target.value)} />
                        </div>
                        <div>
                          <strong>State:</strong>
                          <input className="profile-edit-input" type="text" value={editData?.profile?.state || ""} onChange={(e) => handleProfileFieldChange("profile", "state", e.target.value)} />
                        </div>
                        <div>
                          <strong>Country:</strong>
                          <input className="profile-edit-input" type="text" value={editData?.profile?.country || ""} onChange={(e) => handleProfileFieldChange("profile", "country", e.target.value)} />
                        </div>
                        </>
                      )}
                    </div>
                    <div>
                      <h6>Contact Details</h6>
                      {renderField("Phone", "profile", "phone")}
                      {renderField("Emergency Contact", "profile", "emergencyContactNumber")}
                      {renderField("Relationship", "profile", "relationship")}
                      {renderField("Email", "profile", "email", "email")}
                    </div>
                    <div>
                      <h6>Previous Experience</h6>
                      {renderField("Company", "experience", "company")}
                      {/* Start & End: view combined, edit split */}
                      {!isEditMode ? (
                        <>
                          <strong>Start & End:</strong>
                          <p>
                            {profileData?.experience?.expStartDate || "—"}{" "}
                            {profileData?.experience?.expEndDate ? `– ${profileData.experience.expEndDate}` : ""}
                          </p>
                        </>
                      ) : (
                        <>
                          <strong>Start Date:</strong>
                          <input className="profile-edit-input" type="date" value={editData?.experience?.expStartDate || ""} onChange={(e) => handleProfileFieldChange("experience", "expStartDate", e.target.value)} />
                          <strong>End Date:</strong>
                          <input className="profile-edit-input" type="date" value={editData?.experience?.expEndDate || ""} onChange={(e) => handleProfileFieldChange("experience", "expEndDate", e.target.value)} />
                        </>
                      )}
                      {renderField("Job Title", "experience", "jobTitle")}
                      {renderField("Description", "experience", "responsibilities", "textarea")}
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="details-grid">
                    <div>
                      <h6>Bank Details</h6>
                      {renderField("Bank Name", "bank", "bankName")}
                      {renderField("Branch", "bank", "branch")}
                      {renderField("Account Number", "bank", "accountNumber")}
                      {renderField("IFSC Code", "bank", "ifsc")}
                    </div>

                    <div className="submitted-docs">
                      <h6>Submitted Documents</h6>
                      {d?.documents && d.documents.length > 0 ? (
                        d.documents.map((doc, i) => (
                          <div className="doc-item" key={i}>
                            <FaFilePdf className="text-danger me-2" />
                            {doc.file_name}
                            <FaDownload className="float-end" />
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="doc-item">
                            <FaFilePdf className="text-danger me-2" /> Signed OfferLetter.pdf
                            <FaDownload className="float-end" />
                          </div>
                          <div className="doc-item">
                            <FaFilePdf className="text-danger me-2" /> DegreeCertificate.pdf
                            <FaDownload className="float-end" />
                          </div>
                          <div className="doc-item">
                            <FaFilePdf className="text-danger me-2" /> PAN CARD.pdf
                            <FaDownload className="float-end" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── End Profile Popup ──────────────────────────────────────────── */}

    </>
  );
};

export default Topbar;