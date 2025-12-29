import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaChevronDown, FaPlus, FaTimes , FaFilePdf, FaDownload } from "react-icons/fa";

import profileimg2 from "../../assets/profileimg2.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import { Navigate, useNavigate } from "react-router-dom";
import { searchData } from "./searchData";

import "./Topbar.css";

const Topbar = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [query, setQuery] = useState("");
  const [searchItems, setSearchItems] = useState(searchData);
  const [showPopup, setShowPopup] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const popupRef = useRef(null);
  
 useEffect(() => {
    const storedAdminusername = localStorage.getItem("admin_username");
    if (storedAdminusername) {
      setAdminusername(storedAdminusername);
    }

    // Load saved announcements
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
    // Read values from sessionStorage
    const storedUsername = sessionStorage.getItem("current_username");
    const storedRole = sessionStorage.getItem("current_role");

    setUsername(storedUsername);
    setRole(storedRole);
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

 const filteredResults = searchItems.filter((item) =>
     item.label.toLowerCase().includes(query.toLowerCase()) ||
  item.subLabel?.toLowerCase().includes(query.toLowerCase())
);


  useEffect(() =>{
    try{
    setSearchItems([...searchData]);
          } catch (err) {
            console.error("Search fetch error:", err);
          }
  },[]);


const handleAddNewClick = () => {
    setShowAddForm(true);
  };

const togglePopup = () => {
    setShowPopup(!showPopup);
    setShowAddForm(false);
  };

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target)
    ) {
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




  return (
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
            placeholder="Search modules..."
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
      <div className="profile d-flex align-items-center  position-relative" ref={popupRef}>
        <FaBell size={20} className="text-dark" onClick={togglePopup} style={{ cursor: "pointer" }} />

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
        {showPopup && (
          <div className="announcement-popup1 shadow-lg" ref={popupRef}>
            <div className="popup-header d-flex align-items-center justify-content-between">
              <div className="fw-bold fs-5">Announcement</div>
              <div className="d-flex align-items-center gap-3">
                
              </div>
            </div>

            <hr />

            <div className="popup-content">
              {announcements && announcements.length === 0 ? (
                <div className="text-center text-muted py-5">
                  No announcements yet.
                </div>
              ) : (
                <ul className="announcement-list">
                  {announcements && announcements.map((a, i) => (
                    <li key={i} className="announcement-item">
                      <div className="announcement-header">
                        <div className="announcement-name fw-bold">
                          {a.name || "Unknown"}
                        </div>
                      </div>
                      <div className="announcement-meta text-muted small">
                        <span>{a.designation || "No Designation"}</span>
                        
                      </div>
                      <div className="announcement-eventname">
                        <span className="eventname">
                          {a.eventName || "Untitled Event"}
                          <span className="dot"> : </span>
                          <span>{a.date || "No Date"}</span>
                          <span className="dot">, </span>
                          <span>{a.time || "No Time"}</span>
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
      </div>
    </div>
  );
};

export default Topbar;
