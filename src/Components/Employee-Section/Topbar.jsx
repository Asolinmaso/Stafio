import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaChevronDown, FaFilePdf, FaDownload, FaSearch, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import profileimg2 from "../../assets/profileimg2.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import axios from "axios";
import "./Topbar.css";


const Topbar = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const popupRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE_URL = "http://127.0.0.1:5001"; // Adjusted to match dashboard URL

  useEffect(() => {
    const storedUsername = localStorage.getItem("employee_username");
    if (storedUsername) setUsername(storedUsername);

    const storedUserrole = localStorage.getItem("employee_role");
    if (storedUserrole) setRole(storedUserrole);

    fetchNotifications();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const employeePages = [
    { title: "Dashboard", path: "/employee-dashboard", type: "Module" },
    { title: "Apply Leave", path: "/apply-leave", type: "Module" },
    { title: "Attendance", path: "/employee-attendance", type: "Module" },
    { title: "Profile", path: "/profile", type: "Module" },
    { title: "Performance Tracker", path: "/performance-tracker", type: "Module" },
    { title: "Payroll", path: "/employee-payroll", type: "Module" },
    { title: "Settings", path: "/settings", type: "Module" },
    { title: "Documents", path: "/employeedocs", type: "Module" },
    { title: "My Leave", path: "/my-leave", type: "Module" },
    { title: "My Regularization", path: "/my-regularization", type: "Module" },
    { title: "My Holiday", path: "/my-holidays", type: "Module" },
    { title: "Offer Letter", path: "/employeedocs", type: "Document" },
    { title: "Degree Certificate", path: "/employeedocs", type: "Document" },
    { title: "PAN Card", path: "/employeedocs", type: "Document" },
  ];

  const filteredPages = employeePages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchNotifications = async () => {
    try {
      // Check multiple possible keys used in the codebase
      const userId = localStorage.getItem("employee_user_id") || localStorage.getItem("userId");
      if (!userId) {
        console.warn("No User ID found in localStorage for notifications");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: { "X-User-ID": userId }
      });

      setNotifications(response.data);
      const unread = response.data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notifId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/${notifId}/read`);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar">
      {/* Left Section: Logo + Search */}
      <div className="topbar-left">
        <div className="topbar-logo" onClick={() => navigate("/employee-dashboard")} style={{ cursor: "pointer" }}>
          <img src={stafiologoimg} alt="Logo" className="topbar-img" />
        </div>

        <div className="topbar-searches" ref={searchRef}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-controler"
            placeholder="Quick Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
          />
          {showSearchResults && searchQuery && (
            <div className="search-results-dropdown">
              {filteredPages.length > 0 ? (
                filteredPages.map((page, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => {
                      navigate(page.path);
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                  >
                    <span className="search-result-type">{page.type}</span>
                    <span className="search-result-title">{page.title}</span>
                  </div>
                ))
              ) : (
                <div className="search-result-item no-results">No pages found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side user + bell */}
      <div className="topbar-right">
        <div className="notification-container" ref={notificationRef}>
          <div
            className="notification-icon"
            style={{ cursor: "pointer", position: "relative" }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell size={20} color="#1f2937" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <h6>Notifications</h6>
                {notifications.length > 0 && unreadCount > 0 && (
                  <span className="mark-all-read" onClick={() => {/* Future: Mark all as read */ }}>
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="notif-body">
                {notifications.length === 0 ? (
                  <div className="no-notif">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notif-item ${notif.is_read ? 'read' : 'unread'}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="notif-icon-circle">
                        <FaBell size={14} />
                      </div>
                      <div className="notif-info">
                        <div className="notif-title">{notif.title}</div>
                        <div className="notif-message">{notif.message}</div>
                        <div className="notif-time">
                          {new Date(notif.created_at).toLocaleString()}
                        </div>
                      </div>
                      {!notif.is_read && <FaCircle size={8} color="#007bff" className="unread-dot" />}
                    </div>
                  ))
                )}
              </div>
              <div className="notif-footer" onClick={() => setShowNotifications(false)}>
                Close
              </div>
            </div>
          )}
        </div>

        <div
          className="profile-data"
          onClick={() => setShowProfilePopup((prev) => !prev)}
          ref={popupRef}
        >
          <img src={profileimg2} alt="User" className="topbar-avatar" />
          <div className="profile-info">
            <div className="profile-name">{username || "User"}</div>
            <div className="profile-role">{role || "Employee"}</div>
          </div>
          <FaChevronDown size={14} color="#666" style={{ marginLeft: "5px" }} />
        </div>
      </div>

      {/* Full Profile Popup */}
      {showProfilePopup && (
        <div className="full-profile-popup" ref={popupRef}>
          <div className="popup-header">
            <h5>Profile Details</h5>
            <button
              className="btn-close"
              onClick={() => setShowProfilePopup(false)}
            ></button>
          </div>

          <div className="popup-content">
            {/* Profile section */}
            <div className="profile-section">
              <div className="profile-photo">
                <img src={profileimg2} alt="Profile" />
                <h6>{username || "User"}</h6>
                <p className="text-success">● Active</p>
              </div>

              <div className="details-grid">
                <div>
                  <h6>Personal Details</h6>
                  <strong>Position:</strong><p> UI/UX Designer</p>
                  <strong>Employment Type:</strong><p> Internship</p>
                  <strong>Primary Supervisor:</strong> <p>Sakshi</p>
                  <strong>Department:</strong><p> Design</p>
                  <strong>HR Manager:</strong><p> Santhana Lakshmi</p>
                </div>
                <div>
                  <h6>Personal Details</h6>
                  <strong>Gender:</strong><p> Female</p>
                  <strong>Date of Birth:</strong><p> 22/07/1993</p>
                  <strong>Blood Group:</strong><p> A+</p>
                  <strong>Marital Status:</strong><p> Married</p>
                  <strong>Portfolio:</strong><p> http://www.behance.com</p>
                </div>
                <div>
                  <h6>Educational Qualification</h6>
                  <strong>Institution:</strong><p> CEMP Punnapra</p>
                  <strong>Start & End Date:</strong><p> 22/07/2012 – 22/07/2016</p>
                  <strong>Course:</strong><p> B.Tech</p>
                  <strong>Specialization:</strong><p> CSE</p>
                  <strong>Skills:</strong> <p> Figma, Adobe XD, Photoshop</p>
                </div>
              </div>

              <div className="details-grid">
                <div>
                  <h6>Address</h6>
                  <strong>Address Line:</strong><p>Kattasseri House</p>
                  <strong>City:</strong><p> Alappuzha</p>
                  <strong>State:</strong> <p>Kerala</p>
                  <strong>Country:</strong><p> India</p>
                </div>
                <div>
                  <h6>Contact Details</h6>
                  <strong>Phone:</strong> <p>9895195971</p>
                  <strong>Emergency Contact:</strong><p> 9895195971</p>
                  <strong>Relationship:</strong><p> Husband</p>
                  <strong>Email:</strong> <p>aiswarya@gmail.com</p>
                </div>
                <div>
                  <h6>Previous Experience</h6>
                  <strong>Company:</strong><p> Azym Technology</p>
                  <strong>Start & End:</strong><p> 22/07/2018 – 22/07/2022</p>
                  <strong>Job Title:</strong><p> UI/UX Designer</p>
                  <strong>Description:</strong><p> Conducted user research, interviews, and usability testing.</p>
                </div>
              </div>
              <div className="details-grid">
                <div>
                  <h6>Bank Details</h6>
                  <strong>Bank Name:</strong><p> SBI</p>
                  <strong>Branch:</strong><p> Alappuzha</p>
                  <strong>Account Number:</strong><p> 12345678910</p>
                  <strong>IFSC Code:</strong><p> IFSC12345</p>
                </div>

                <div className="submitted-docs">
                  <h6>Submitted Documents</h6>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
