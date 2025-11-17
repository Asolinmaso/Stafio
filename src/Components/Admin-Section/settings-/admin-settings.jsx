import React, { useState } from "react";
import "./admin-settings.css";
import AdminSidebar from "../AdminSidebar";
import profileimg from "../../../assets/profileimg.png"; 
import user from "../../../assets/user.png"; 
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";


export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  const [font, setFont] = useState("default");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Add missing state variables
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('admin');
  const [lunchBreak, setLunchBreak] = useState('1:00 PM - 2:00 PM');
  const [coffeeBreak, setCoffeeBreak] = useState('4:00 PM - 4:15 PM');

  return (
    <div className="dashboard-wrapper d-flex">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
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
            <h1>System Settings</h1>
            <p>Setup and edit system settings and preferences</p>
          </div>

          {/* Tabs */}
          <div className="settings-tabs">
            {["general", "basic", "team", "departments", "breaktimes"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "general"
                    ? "General Settings"
                    : tab === "basic"
                    ? "Basic Info"
                    : tab === "team"
                    ? "Team"
                    : tab === "departments"
                    ? "Department"
                    : "Break Times"}
                </button>
              )
            )}
          </div>

          {/* Tab Content */}
          <div className="settings-card">
            {/* General Settings */}
            {activeTab === "general" && (
              <div>
                <h3>General</h3>
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group">
                      <label>System Language</label>
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
                      <label>Admin Dashboard Theme</label>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={theme === "light"}
                          onChange={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className="theme-label">
                        {theme === "light" ? "Light Theme" : "Dark Theme"}
                      </span>
                    </div>

                    <div className="form-group">
                      <label>System Font</label>
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
                      <label>Allow Manager to edit employee record</label>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                      </label>
                      <span className="theme-label">Disable</span>
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="form-group">
                      <label>User Sign up</label>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                      </label>
                      <span className="theme-label">
                        Allow new users to sign up
                      </span>
                    </div>

                    <div className="form-group">
                      <label>Default Theme for Users</label>
                      <input type="text" placeholder="Light Theme" />
                    </div>

                    <div className="form-group">
                      <label>Date and Time Format</label>
                      <label className="switch">
                        <input type="checkbox" checked={true} readOnly />
                        <span className="slider round"></span>
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
                <h3>Basic Info</h3>
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        placeholder="Please enter name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="Please enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Position</label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="manager">Manager</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                      </select>
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
                      <label>Last Name</label>
                      <input
                        type="text"
                        placeholder="Please enter name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Please enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Team */}
            {activeTab === "team" && (
              <div>
        
                <div className="team-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" />
                        </th>
                        <th>Name</th>
                        <th>Date Joined</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="team-member">
                          <img
                            src={profileimg}
                            alt="Lakshmi"
                            className="member-avatar"
                          />
                          <div>
                            <div className="member-name">Lakshmi</div>
                            <div className="member-email">lakshmi@gmail.com</div>
                          </div>
                        </td>
                        <td>May 24, 2025 - 09:00 AM</td>
                        <td>
                          <span className="role-badge hr">HR</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="team-member">
                          <img
                            src={user}
                            alt="Sakshi"
                            className="member-avatar"
                          />
                          <div>
                            <div className="member-name">Sakshi</div>
                            <div className="member-email">sakshi@gmail.com</div>
                          </div>
                        </td>
                        <td>May 24, 2025 - 09:00 AM</td>
                        <td>
                          <span className="role-badge team-head">
                            Team Head ▼
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td className="team-member">
                          <img
                            src={user}
                            alt="Asolin"
                            className="member-avatar"
                          />
                          <div>
                            <div className="member-name">Asolin</div>
                            <div className="member-email">asolin@gmail.com</div>
                          </div>
                        </td>
                        <td>Apr 24, 2025 - 06:00 PM</td>
                        <td>
                          <span className="role-badge team-head">
                            Team Head ▼
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Department - FIXED: Changed from "department" to "departments" */}
            {activeTab === "departments" && (
              <div>
               
                <div className="create-new-wrapper">
                  <button className="btn-create-new">Create new</button>
                </div>
                <div className="department-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" />
                        </th>
                        <th>Department</th>
                        <th>Number Of Members</th>
                        <th>Department Head</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>HR</td>
                        <td>1</td>
                        <td>Lakshmi</td>
                        <td>
                          <button className="action-btn edit">✏️</button>
                          <button className="action-btn delete">🗑️</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>Design</td>
                        <td>5</td>
                        <td>Sakshi</td>
                        <td>
                          <button className="action-btn edit">✏️</button>
                          <button className="action-btn delete">🗑️</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>Development</td>
                        <td>7</td>
                        <td>Asolin</td>
                        <td>
                          <button className="action-btn edit">✏️</button>
                          <button className="action-btn delete">🗑️</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Break Times - FIXED: Changed from "breaks" to "breaktimes" */}
            {activeTab === "breaktimes" && (
              <div>
                <h3>Break Times</h3>
                <div className="break-times-content">
                  <div className="break-item">
                    <label>Lunch Break</label>
                    <div className="time-input-group">
                      <input
                        type="text"
                        value={lunchBreak}
                        onChange={(e) => setLunchBreak(e.target.value)}
                      />
                      <button className="edit-btn">✏️</button>
                    </div>
                  </div>

                  <div className="break-item">
                    <label>Coffee Break</label>
                    <div className="time-input-group">
                      <input
                        type="text"
                        value={coffeeBreak}
                        onChange={(e) => setCoffeeBreak(e.target.value)}
                    
                      />

                      <button className="edit-btn">✏️</button>
                    </div>
                  </div>

                  <button className="btn-create-new">Create new</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
