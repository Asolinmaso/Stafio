import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaChevronDown, FaFilePdf, FaDownload } from "react-icons/fa";

import profileimg2 from "../../assets/profileimg2.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import "./Topbar.css";

const Topbar = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);

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
          <img src={profileimg2} alt="User" className="topbar-avatar rounded-circle me-2" />
          <div>
            <div className="fw-bold">{username || "User"}</div>
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
    </div>
  );
};

export default Topbar;
