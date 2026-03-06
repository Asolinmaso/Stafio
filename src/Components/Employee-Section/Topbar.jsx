import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaChevronDown, FaFilePdf, FaDownload, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import profileimg2 from "../../assets/profileimg2.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import "./Topbar.css";


const Topbar = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("employee_username");
    if (storedUsername) setUsername(storedUsername);

    const storedUserrole = localStorage.getItem("employee_role");
    if (storedUserrole) setRole(storedUserrole);
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

  return (
    <div className="topbar">
      {/* Left Section: Logo + Search */}
      <div className="topbar-left">
        <div className="topbar-logo" onClick={() => navigate("/employee-dashboard")} style={{ cursor: "pointer" }}>
          <img src={stafiologoimg} alt="Logo" className="topbar-img" />
        </div>

        <div className="topbar-searches">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-controler"
            placeholder="Quick Search..."
          />
        </div>
      </div>

      {/* Right side user + bell */}
      <div className="topbar-right" ref={popupRef}>
        <div className="notification-icon" style={{ cursor: "pointer" }}>
          <FaBell size={20} color="#1f2937" />
        </div>

        <div
          className="profile-data"
          onClick={() => setShowProfilePopup((prev) => !prev)}
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
