import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaChevronDown, FaFilePdf, FaDownload } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import profileimg2 from "../../assets/profileimg2.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import "./Topbar.css";
import axios from "axios";
import profileimg from "../../assets/profileimg.png";

const API_BASE = "http://127.0.0.1:5001";


const Topbar = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("employee_username") || sessionStorage.getItem("current_username");
    if (storedUsername) setUsername(storedUsername);

    const storedUserrole = localStorage.getItem("employee_role") || sessionStorage.getItem("current_role");
    if (storedUserrole) setRole(storedUserrole);
  }, []);

  const fetchProfileData = async () => {
    try {
      const userId = sessionStorage.getItem("current_user_id") || localStorage.getItem("employee_user_id");
      if (!userId) return;

      const res = await axios.get(`${API_BASE}/admin_profile/${userId}`, {
        headers: {
          "X-User-Role": sessionStorage.getItem("current_role") || localStorage.getItem("employee_role"),
          "X-User-ID": userId,
        },
      });
      setProfileData(res.data);
    } catch (err) {
      console.error("Error fetching profile in Topbar:", err);
    }
  };

  useEffect(() => {
    fetchProfileData();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchProfileData();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profile = profileData?.profile || {};
  const education = profileData?.education || {};
  const experience = profileData?.experience || {};
  const bankDetails = profileData?.bank || {};

  return (
    <div className="topbar shadow-sm d-flex align-items-center justify-content-between px-3">
      {/* Left logo */}
      <div className="topbar-logo d-flex align-items-center">
        <img src={stafiologoimg} alt="Logo" className="topbar-img" />
      </div>

      {/* Search box */}
      <div className="topbar-searches flex-grow-1 mx-3">
        <input type="text" className="form-controler" placeholder="Quick Search..." />
      </div>

      {/* Right side user + bell */}
      <div className="profile d-flex align-items-center  position-relative" ref={popupRef}>
        <FaBell size={20} className="text-dark" style={{ cursor: "pointer" }} />

        <div
          className="profile-data d-flex align-items-center "
          onClick={() => setShowProfilePopup((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          <img src={profile.profileImage || profileimg2} alt="User" className="topbar-avatar rounded-circle me-2" />
          <div>
            <div className="fw-bold">{profile.name || username || "User"}</div>
            <div className="text-muted small">{role}</div>
          </div>
          <FaChevronDown className="ms-2" />
        </div>

        {/* Full Profile Popup */}
        {showProfilePopup && (
          <div className="full-profile-popup">
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
                  <img src={profile.profileImage || profileimg2} alt="Profile" />
                  <h6>{profile.name || username || "User"}</h6>
                  <p className="text-success">● {profile.status || "Active"}</p>
                </div>

                <div className="details-grid">
                  <div>
                    <h6>Personal Details</h6>
                    <strong>Position:</strong><p> {profile.position || "-"}</p>
                    <strong>Employment Type:</strong><p> {profile.empType || "-"}</p>
                    <strong>Primary Supervisor:</strong> <p>{profile.supervisor || "-"}</p>
                    <strong>Department:</strong><p> {profile.department || "-"}</p>
                    <strong>HR Manager:</strong><p> {profile.hrManager || "-"}</p>
                  </div>
                  <div>
                    <h6>Personal Details</h6>
                    <strong>Gender:</strong><p> {profile.gender || "-"}</p>
                    <strong>Date of Birth:</strong><p> {profile.dob || "-"}</p>
                    <strong>Blood Group:</strong><p> {profile.bloodGroup || "-"}</p>
                    <strong>Marital Status:</strong><p> {profile.maritalStatus || "-"}</p>
                    <strong>Portfolio:</strong><p> {education.portfolio || "-"}</p>
                  </div>
                  <div>
                    <h6>Educational Qualification</h6>
                    <strong>Institution:</strong><p> {education.institution || "-"}</p>
                    <strong>Start & End Date:</strong><p> {education.eduStartDate || "-"} – {education.eduEndDate || "-"}</p>
                    <strong>Course:</strong><p> {education.qualification || "-"}</p>
                    <strong>Specialization:</strong><p> {education.specialization || "-"}</p>
                    <strong>Skills:</strong> <p> {Array.isArray(education.skills) ? education.skills.join(", ") : (education.skills || "-")}</p>
                  </div>
                </div>

                <div className="details-grid">
                  <div>
                    <h6>Address</h6>
                    <strong>Address Line:</strong><p>{profile.address || "-"}</p>
                    <strong>Location:</strong><p> {profile.location || "-"}</p>
                  </div>
                  <div>
                    <h6>Contact Details</h6>
                    <strong>Phone:</strong> <p>{profile.phone || "-"}</p>
                    <strong>Emergency Contact:</strong><p> {profile.emergencyContactNumber || "-"}</p>
                    <strong>Relationship:</strong><p> {profile.relationship || "-"}</p>
                    <strong>Email:</strong> <p>{profile.email || "-"}</p>
                  </div>
                  <div>
                    <h6>Previous Experience</h6>
                    <strong>Company:</strong><p> {experience.company || "-"}</p>
                    <strong>Start & End:</strong><p> {experience.expStartDate || "-"} – {experience.expEndDate || "-"}</p>
                    <strong>Job Title:</strong><p> {experience.jobTitle || "-"}</p>
                    <strong>Description:</strong><p> {experience.responsibilities || "-"}</p>
                  </div>
                </div>
                <div className="details-grid">
                  <div>
                    <h6>Bank Details</h6>
                    <strong>Bank Name:</strong><p> {bankDetails.bankName || "-"}</p>
                    <strong>Branch:</strong><p> {bankDetails.branch || "-"}</p>
                    <strong>Account Number:</strong><p> {bankDetails.accountNumber || "-"}</p>
                    <strong>IFSC Code:</strong><p> {bankDetails.ifsc || "-"}</p>
                  </div>

                  <div className="submitted-docs">
                    <h6>Submitted Documents</h6>
                    {profileData?.documents?.length > 0 ? (
                      profileData.documents.map((doc, idx) => (
                        <div className="doc-item" key={idx}>
                          <FaFilePdf className="text-danger me-2" /> {doc.name}
                          <FaDownload className="float-end" />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted small">No documents uploaded</p>
                    )}
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

export default Topbar;
