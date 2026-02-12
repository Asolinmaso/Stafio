import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin-settings.css";
import AdminSidebar from "../AdminSidebar";
import profileimg from "../../../assets/profileimg.png";
import user from "../../../assets/user.png";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import penicon from "../../../assets/penicon2.png";
import deletebox from "../../../assets/deletebox.png";

const API_BASE = "http://127.0.0.1:5001";

const translations = {
  english: {
    title: "System Settings",
    subtitle: "Setup and edit system settings and preferences",
    general: "General Settings",
    basic: "Basic Info",
    team: "Team",
    department: "Department",
    breaktimes: "Break Times",
    systemLanguage: "System Language",
    dashboardTheme: "Admin Dashboard Theme",
    systemFont: "System Font",
    dateFormat: "Date and Time Format",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    position: "Position",
    role: "Role",
    name: "Name",
    datejoined: "Date Joined",
    lunchBreak: "Lunch Break",
    coffeeBreak: "Coffee Break",
    numberOfMembers: "Number Of Members",
    departmentHead: "Department Head",
    action: "Action",
    allowManagertoeditemployeerecord: "Allow Manager to edit employee record",
    userSignup: "user Sign up",
    defaultThemeforUsers: "default Theme for Users",
  },

  tamil: {
    title: "கணினி அமைப்புகள்",
    subtitle: "அமைப்புகளை திருத்தவும், அமைக்கவும்",
    general: "பொது அமைப்புகள்",
    basic: "அடிப்படை தகவல்",
    team: "அணி",
    department: "துறை",
    breaktimes: "இடைவேளை நேரங்கள்",
    systemLanguage: "மொழி",
    dashboardTheme: "டாஷ்போர்டு தீம்",
    systemFont: "எழுத்துரு பாணி",
    dateFormat: "தேதி மற்றும் நேர வடிவம்",
    firstName: "முதல் பெயர்",
    lastName: "கடைசி பெயர்",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி எண்",
    position: "பதவி",
    role: "பங்கு",
    name: "பெயர்",
    datejoined: "இணைந்த தேதி",
    lunchBreak: "மதிய உணவு இடைவேளை",
    coffeeBreak: "காபி இடைவேளை",
    numberOfMembers: "உறுப்பினர்களின் எண்ணிக்கை",
    departmentHead: "துறைத் தலைவர்",
    action: "நடவடிக்கை",
    allowManagertoeditemployeerecord:
      "பணியாளர் பதிவைத் திருத்த மேலாளரை அனுமதிக்கவும்.",
    userSignup: "பயனர் பதிவு செய்யவும்",
    defaultThemeforUsers: "பயனர்களுக்கான இயல்புநிலை தீம்",
  },

  hindi: {
    title: "सिस्टम सेटिंग्स",
    subtitle: "सिस्टम सेटिंग्स और प्राथमिकताएँ संपादित करें",
    general: "सामान्य सेटिंग्स",
    basic: "मूल जानकारी",
    team: "टीम",
    department: "विभाग",
    breaktimes: "मध्य विराम",
    systemLanguage: "भाषा",
    dashboardTheme: "डैशबोर्ड थीम",
    systemFont: "फ़ॉन्ट शैली",
    dateFormat: "तारीख और समय प्रारूप",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    email: "ईमेल",
    phone: "फ़ोन नंबर",
    position: "पद",
    role: "भूमिका",
    name: "नाम",
    datejoined: "शामिल होने का दिनांक",
    lunchBreak: "दोपहर का भोजनावकाश",
    coffeeBreak: "कॉफी ब्रेक",
    numberOfMembers: "सदस्यों की संख्या",
    departmentHead: "विभाग के प्रमुख",
    action: "कार्रवाई",
    allowManagertoeditemployeerecord:
      "मैनेजर को कर्मचारी रिकॉर्ड संपादित करने की अनुमति दें",
    userSignup: "उपयोगकर्ता साइन अप करें",
    defaultThemeforUsers: "उपयोगकर्ताओं के लिए डिफ़ॉल्ट थीम",
  },
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // General Settings State
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  const [font, setFont] = useState("default");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [allowSignup, setAllowSignup] = useState(false);
  const [userTheme, setUserTheme] = useState("light");
  const [allowManagerEdit, setAllowManagerEdit] = useState(false);

  // Basic Info State
  const [basicForm, setBasicForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    role: "admin",
  });
  const [basicErrors, setBasicErrors] = useState({});

  // Team State
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  // Department State
  const [departments, setDepartments] = useState([]);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [editingDeptId, setEditingDeptId] = useState(null); // Track which dept is being edited
  const [editMemberCount, setEditMemberCount] = useState("");

  // Break Times State
  const [lunchBreak, setLunchBreak] = useState("1:00 PM - 2:00 PM");
  const [coffeeBreak, setCoffeeBreak] = useState("4:00 PM - 4:15 PM");
  const [customBreaks, setCustomBreaks] = useState([]);

  const t = (key) => translations[language]?.[key] || key;

  const getHeaders = () => ({
    "X-User-Role": "admin",
    "X-User-ID": localStorage.getItem("userId") || "1",
  });

  // Fetch General Settings on mount
  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/settings/general`, {
          headers: getHeaders(),
        });
        const data = res.data;
        setLanguage(data.system_language || "english");
        setTheme(data.admin_theme || "light");
        setUserTheme(data.user_theme || "light");
        setFont(data.system_font || "default");
        setDateFormat(data.date_format || "DD/MM/YYYY");
        setAllowSignup(data.allow_signup || false);
        setAllowManagerEdit(data.allow_manager_edit || false);
      } catch (err) {
        console.error("Error fetching general settings:", err);
      }
    };

    fetchGeneralSettings();
  }, []);

  // Fetch Basic Info when tab changes
  useEffect(() => {
    if (activeTab === "basic") {
      const fetchBasicInfo = async () => {
        try {
          const res = await axios.get(`${API_BASE}/api/settings/basic_info`, {
            headers: getHeaders(),
          });
          setBasicForm({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            position: res.data.position || "",
            role: res.data.role || "admin",
          });
        } catch (err) {
          console.error("Error fetching basic info:", err);
        }
      };
      fetchBasicInfo();
    }
  }, [activeTab]);

  // Fetch Team when tab changes
  useEffect(() => {
    if (activeTab === "team") {
      const fetchTeam = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${API_BASE}/api/settings/team`, {
            headers: getHeaders(),
          });
          setTeamMembers(res.data);
          // Initialize selected rows
          const rows = {};
          res.data.forEach((_, idx) => {
            rows[`row${idx}`] = false;
          });
          setSelectedRows(rows);
        } catch (err) {
          console.error("Error fetching team:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchTeam();
    }
  }, [activeTab]);

  // Fetch Departments when tab changes (also fetch team for head selection)
  useEffect(() => {
    if (activeTab === "departments") {
      const fetchDepartmentsAndTeam = async () => {
        setLoading(true);
        try {
          // Fetch both departments and team members
          const [deptRes, teamRes] = await Promise.all([
            axios.get(`${API_BASE}/api/settings/departments`, {
              headers: getHeaders(),
            }),
            axios.get(`${API_BASE}/api/settings/team`, {
              headers: getHeaders(),
            }),
          ]);
          setDepartments(deptRes.data);
          setTeamMembers(teamRes.data);
        } catch (err) {
          console.error("Error fetching departments:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDepartmentsAndTeam();
    }
  }, [activeTab]);

  // Fetch Break Times when tab changes
  useEffect(() => {
    if (activeTab === "breaktimes") {
      const fetchBreakTimes = async () => {
        try {
          const res = await axios.get(`${API_BASE}/api/settings/break_times`, {
            headers: getHeaders(),
          });
          setLunchBreak(res.data.lunch_break || "1:00 PM - 2:00 PM");
          setCoffeeBreak(res.data.coffee_break || "4:00 PM - 4:15 PM");
          setCustomBreaks(res.data.custom_breaks || []);
        } catch (err) {
          console.error("Error fetching break times:", err);
        }
      };
      fetchBreakTimes();
    }
  }, [activeTab]);

  // Auto-save General Settings when they change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "general") {
        saveGeneralSettings();
      }
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timer);
  }, [
    language,
    theme,
    font,
    dateFormat,
    allowSignup,
    userTheme,
    allowManagerEdit,
  ]);

  const saveGeneralSettings = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/settings/general`,
        {
          system_language: language,
          admin_theme: theme,
          user_theme: userTheme,
          system_font: font,
          date_format: dateFormat,
          allow_signup: allowSignup,
          allow_manager_edit: allowManagerEdit,
        },
        {
          headers: getHeaders(),
        },
      );
      console.log("General settings saved");
    } catch (err) {
      console.error("Error saving general settings:", err);
    }
  };

  // Basic Info Handlers
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicForm({ ...basicForm, [name]: value });
    setBasicErrors({ ...basicErrors, [name]: "" });
  };

  const validateBasicInfo = () => {
    const errors = {};
    if (!basicForm.firstName.trim())
      errors.firstName = "*First name is required";
    if (!basicForm.lastName.trim()) errors.lastName = "*Last name is required";
    if (!basicForm.email.trim()) {
      errors.email = "*Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(basicForm.email)) {
      errors.email = "*Enter a valid email address";
    }
    if (!basicForm.phone.trim()) {
      errors.phone = "*Phone number is required";
    } else if (!/^[0-9]{10}$/.test(basicForm.phone)) {
      errors.phone = "*Enter a valid 10-digit phone number";
    }
    if (!basicForm.position) errors.position = "Please select a position";
    setBasicErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBasicSave = async () => {
    if (validateBasicInfo()) {
      try {
        await axios.put(`${API_BASE}/api/settings/basic_info`, basicForm, {
          headers: getHeaders(),
        });
        setSaveMessage("Basic info saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } catch (err) {
        console.error("Error saving basic info:", err);
        setSaveMessage("Failed to save basic info");
      }
    }
  };

  const handleBasicCancel = () => {
    setBasicForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      role: "admin",
    });
    setBasicErrors({});
  };

  // Department Handlers
  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) return;
    try {
      await axios.post(
        `${API_BASE}/api/departments`,
        {
          name: newDeptName,
        },
        {
          headers: getHeaders(),
        },
      );
      // Refresh departments
      const res = await axios.get(`${API_BASE}/api/settings/departments`, {
        headers: getHeaders(),
      });
      setDepartments(res.data);
      setNewDeptName("");
      setShowDeptModal(false);
    } catch (err) {
      console.error("Error creating department:", err);
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    try {
      await axios.delete(`${API_BASE}/api/departments/${deptId}`, {
        headers: getHeaders(),
      });
      setDepartments(departments.filter((d) => d.id !== deptId));
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  // Handle Team Head Assignment
  const handleAssignHead = async (deptId, managerId) => {
    try {
      await axios.put(
        `${API_BASE}/api/departments/${deptId}`,
        { manager_id: managerId ? parseInt(managerId) : null },
        { headers: getHeaders() },
      );
      // Refresh departments to get updated head name
      const res = await axios.get(`${API_BASE}/api/settings/departments`, {
        headers: getHeaders(),
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Error assigning department head:", err);
    }
  };

  // Handle Save Department Edit (member count + head)
  const handleSaveDeptEdit = async (deptId) => {
    try {
      await axios.put(
        `${API_BASE}/api/departments/${deptId}`,
        { member_count: parseInt(editMemberCount) || 0 },
        { headers: getHeaders() },
      );
      // Refresh departments
      const res = await axios.get(`${API_BASE}/api/settings/departments`, {
        headers: getHeaders(),
      });
      setDepartments(res.data);
      setEditingDeptId(null);
      setSaveMessage("Department updated!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Error saving department:", err);
    }
  };

  // Break Times Handlers
  const saveBreakTimes = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/settings/break_times`,
        {
          lunch_break: lunchBreak,
          coffee_break: coffeeBreak,
          custom_breaks: customBreaks,
        },
        {
          headers: getHeaders(),
        },
      );
      setSaveMessage("Break times saved!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Error saving break times:", err);
    }
  };

  return (
    <div className={`dashboard-wrapper d-flex admin-${theme}`}>
      <div className="rightside-logo ">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>
      {/* Sidebar */}
      <div className="sidebar">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="main-content flex-grow-1">
        <Topbar />

        <div className="settings-page p-4">
          {/* Header */}
          <div className="settings-header">
            <h1>{t("title")}</h1>
            <p>{t("subtitle")}</p>
          </div>

          {/* Success Message */}
          {saveMessage && (
            <div
              className="alert alert-success"
              style={{ marginBottom: "1rem" }}
            >
              {saveMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="settings-tabs">
            {["general", "basic", "team", "departments", "breaktimes"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "general"
                    ? t("general")
                    : tab === "basic"
                      ? t("basic")
                      : tab === "team"
                        ? t("team")
                        : tab === "departments"
                          ? t("department")
                          : t("breaktimes")}
                </button>
              ),
            )}
          </div>

          {/* Tab Content */}
          <div
            className={`settings-card ${
              activeTab === "breaktimes" ? "breaktimes-no-card" : ""
            }`}
          >
            {/* General Settings */}
            {activeTab === "general" && (
              <div>
                <h3>{t("general")}</h3>
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group2">
                      <label>{t("systemLanguage")}</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="tamil">Tamil</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t("dashboardTheme")}</label>
                      <div className="theme-input-box">
                        <span className="theme-label">
                          {theme === "light" ? "Light Theme" : "Dark Theme"}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={theme === "dark"}
                            onChange={() =>
                              setTheme(theme === "light" ? "dark" : "light")
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group2">
                      <label>{t("systemFont")}</label>
                      <select
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                      >
                        <option value="default">Default - Montserrat</option>
                        <option value="arial">Arial</option>
                        <option value="roboto">Roboto</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{t("allowManagertoeditemployeerecord")}</label>
                      <div className="theme-input-box">
                        <span className="theme-label">
                          {allowManagerEdit ? "Enable" : "Disable"}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={allowManagerEdit}
                            onChange={() =>
                              setAllowManagerEdit(!allowManagerEdit)
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="form-group">
                      <label>{t("userSignup")}</label>
                      <div className="theme-input-box">
                        <span className="theme-label">
                          Allow new users to sign up
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={allowSignup}
                            onChange={() => setAllowSignup(!allowSignup)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group1">
                      <label>{t("defaultThemeforUsers")}</label>
                      <select
                        value={userTheme}
                        onChange={(e) => setUserTheme(e.target.value)}
                      >
                        <option value="light">Light Theme</option>
                        <option value="dark">Dark Theme</option>
                      </select>
                    </div>

                    <div className="form-group2">
                      <label>
                        {t("dateFormat")}
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>
                      </label>

                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Info */}
            {activeTab === "basic" && (
              <div>
                <h3>{t("basic")}</h3>
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group">
                      <label>{t("firstName")}</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Please enter name"
                        value={basicForm.firstName}
                        onChange={handleBasicChange}
                      />
                      {basicErrors.firstName && (
                        <span className="error-text">
                          {basicErrors.firstName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>{t("email")}</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Please enter email"
                        value={basicForm.email}
                        onChange={handleBasicChange}
                      />
                      {basicErrors.email && (
                        <span className="error-text">{basicErrors.email}</span>
                      )}
                    </div>

                    <div className="form-group3">
                      <label>{t("position")}</label>
                      <select
                        name="position"
                        value={basicForm.position}
                        onChange={handleBasicChange}
                      >
                        <option value="">Select</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                      </select>
                      {basicErrors.position && (
                        <span className="error-text">
                          {basicErrors.position}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Profile picture</label>
                      <p className="file-info">
                        We support only JPEGs or PNGs under 5MB
                      </p>
                      <div className="profile-upload">
                        <img
                          src={profileimg}
                          alt="Profile"
                          className="profile-preview"
                        />
                        <button type="button" className="upload-btn">
                          📁 Upload
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="form-group">
                      <label>{t("lastName")}</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Please enter name"
                        value={basicForm.lastName}
                        onChange={handleBasicChange}
                      />
                      {basicErrors.lastName && (
                        <span className="error-text">
                          {basicErrors.lastName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>{t("phone")}</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Please enter phone number"
                        value={basicForm.phone}
                        onChange={handleBasicChange}
                      />
                      {basicErrors.phone && (
                        <span className="error-text">{basicErrors.phone}</span>
                      )}
                    </div>

                    <div className="form-group3">
                      <label>{t("role")}</label>
                      <select
                        name="role"
                        value={basicForm.role}
                        onChange={handleBasicChange}
                      >
                        <option value="admin">Admin</option>
                        <option value="employee">User</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleBasicCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    onClick={handleBasicSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Team */}
            {activeTab === "team" && (
              <div>
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="team-table">
                    <table>
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              className="checkbbig"
                              checked={
                                teamMembers.length > 0 &&
                                Object.values(selectedRows).every(Boolean)
                              }
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const newRows = {};
                                teamMembers.forEach((_, idx) => {
                                  newRows[`row${idx}`] = isChecked;
                                });
                                setSelectedRows(newRows);
                              }}
                            />
                          </th>
                          <th>{t("name")}</th>
                          <th>{t("datejoined")}</th>
                          <th>{t("role")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((member, idx) => (
                          <tr key={member.id}>
                            <td>
                              <input
                                type="checkbox"
                                className="checkbsmall"
                                checked={selectedRows[`row${idx}`] || false}
                                onChange={(e) =>
                                  setSelectedRows({
                                    ...selectedRows,
                                    [`row${idx}`]: e.target.checked,
                                  })
                                }
                              />
                            </td>
                            <td className="team-member">
                              <img
                                src={user}
                                alt={member.name}
                                className="member-avatar"
                              />
                              <div>
                                <div className="member-name">{member.name}</div>
                                <div className="member-email">
                                  {member.email}
                                </div>
                              </div>
                            </td>
                            <td className="member-joined">
                              {member.dateJoined}
                            </td>
                            <td>
                              <span
                                className={`role-badge ${member.role === "admin" ? "hr" : "team-head"}`}
                              >
                                {member.role === "admin"
                                  ? "Admin"
                                  : member.role === "manager"
                                    ? "Team Head ▼"
                                    : "Employee"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Department */}
            {activeTab === "departments" && (
              <div>
                <div
                  className="create-new-wrapper"
                  style={{ marginBottom: "1rem", textAlign: "right" }}
                >
                  <button
                    className="btn-create-new"
                    onClick={() => setShowDeptModal(true)}
                  >
                    Create new
                  </button>
                </div>

                {/* Simple Modal for Create Department */}
                {showDeptModal && (
                  <div
                    className="modal-overlay"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        background: "#fff",
                        padding: "2rem",
                        borderRadius: "8px",
                        minWidth: "300px",
                      }}
                    >
                      <h4>Create New Department</h4>
                      <input
                        type="text"
                        placeholder="Department Name"
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          marginTop: "1rem",
                        }}
                      />
                      <div
                        style={{
                          marginTop: "1rem",
                          display: "flex",
                          gap: "1rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button onClick={() => setShowDeptModal(false)}>
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateDepartment}
                          style={{
                            background: "#0d6efd",
                            color: "#fff",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="department-table">
                    <table>
                      <thead>
                        <tr>
                          <th>
                            <input type="checkbox" className="checkbbig" />
                          </th>
                          <th>{t("department")}</th>
                          <th>{t("numberOfMembers")}</th>
                          <th>{t("departmentHead")}</th>
                          <th>{t("action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((dept) => (
                          <tr key={dept.id}>
                            <td>
                              <input type="checkbox" className="checkbsmall" />
                            </td>
                            <td>{dept.name}</td>
                            <td>
                              {editingDeptId === dept.id ? (
                                <input
                                  type="number"
                                  value={editMemberCount}
                                  onChange={(e) =>
                                    setEditMemberCount(e.target.value)
                                  }
                                  style={{
                                    width: "60px",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                  }}
                                  min="0"
                                />
                              ) : (
                                dept.memberCount
                              )}
                            </td>
                            <td>
                              {editingDeptId === dept.id ? (
                                <select
                                  value={dept.managerId || ""}
                                  onChange={(e) =>
                                    handleAssignHead(dept.id, e.target.value)
                                  }
                                  className="dept-head-select"
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                    minWidth: "150px",
                                  }}
                                >
                                  <option value="">Select Head</option>
                                  {teamMembers.map((member) => (
                                    <option key={member.id} value={member.id}>
                                      {member.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                dept.headName || "Not Assigned"
                              )}
                            </td>
                            <td>
                              {editingDeptId === dept.id ? (
                                <>
                                  <button
                                    className="action-btn edit"
                                    onClick={() => {
                                      handleSaveDeptEdit(dept.id);
                                    }}
                                    title="Save"
                                    style={{ color: "green" }}
                                  >
                                    ✓
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() => setEditingDeptId(null)}
                                    title="Cancel"
                                    style={{ color: "red" }}
                                  >
                                    ✕
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="action-btn edit"
                                    onClick={() => {
                                      setEditingDeptId(dept.id);
                                      setEditMemberCount(
                                        dept.memberCount.toString(),
                                      );
                                    }}
                                  >
                                    <img
                                      className="pen-icon"
                                      src={penicon}
                                      alt="edit"
                                    />
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() =>
                                      handleDeleteDepartment(dept.id)
                                    }
                                  >
                                    <img
                                      className="deletebox-icon"
                                      src={deletebox}
                                      alt="delete"
                                    />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Break Times */}
            {activeTab === "breaktimes" && (
              <div>
                <div className="break-times-content">
                  <div className="break-item">
                    <label>{t("lunchBreak")}</label>
                    <div className="time-input-group">
                      <div className="time-input-wrapper">
                        <input
                          type="text"
                          value={lunchBreak}
                          onChange={(e) => setLunchBreak(e.target.value)}
                          onBlur={saveBreakTimes}
                        />
                        <button className="edit-btn inside">
                          <img className="pen-icon" src={penicon} alt="edit" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="break-item">
                    <label>{t("coffeeBreak")}</label>
                    <div className="time-input-group">
                      <div className="time-input-wrapper">
                        <input
                          type="text"
                          value={coffeeBreak}
                          onChange={(e) => setCoffeeBreak(e.target.value)}
                          onBlur={saveBreakTimes}
                        />
                        <button className="edit-btn inside">
                          <img className="pen-icon" src={penicon} alt="edit" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="btn-create-new1">Create new</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
