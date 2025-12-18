import React, { useEffect, useState } from "react";
import { FaBell, FaChevronDown, FaPlus, FaTimes } from "react-icons/fa";
import profileimg from "../../assets/profileimg.png";
import stafiologoimg from "../../assets/stafiologoimg.png";
import "./Topbar.css";
import topbarsettings from "../../assets/topbarsettings.png";
import { Navigate,useNavigate } from "react-router-dom";

const Topbar = () => {
  const [adminusername, setAdminusername] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [role,setAdminrole] = useState("");
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  

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
   const storedAdminRole = localStorage.getItem("admin_role"); // or "employeeUserrole"
   if (storedAdminRole) {
     setAdminrole(storedAdminRole);

   }
 }, []);

useEffect(() => {
  if (announcements.length > 0) {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }
}, [announcements]);


  const togglePopup = () => {
    setShowPopup(!showPopup);
    setShowAddForm(false);
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
  };

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

    setAnnouncements([...announcements, { ...formData }]);
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

  return (
    <>
      <div className="topbar shadow-sm d-flex align-items-center justify-content-between px-3">
        {/* Left logo */}
        <div className="topbar-logo d-flex align-items-center">
          <img src={stafiologoimg} alt="Logo" className="topbar-img" />
        </div>
 
        {/* Search box */}
        <div className="topbar-searches flex-grow-1 mx-3">
          <input
            type="text"
            className="form-controler"
            placeholder="Quick Search..."
          />
        </div>

        {/* Right side user + bell */}
       <div className="profile0 d-flex align-items-center gap-3" >
          
        <FaBell size={20} className="text-dark" style={{cursor:"pointer"}} onClick={togglePopup} />
       </div>
           <div style={{cursor: "pointer"}}>
              <img  src={topbarsettings}
                alt="Profile Logo" 
                className="topbar-settings"
                onClick={() => navigate("/admin-settings")}
              />
            </div>
          <div                 //new
              className="profile-data1 d-flex align-items-center "
              onClick={() => setShowAdminMenu((prev) => !prev)}
              style={{ cursor: "pointer" }}
             >
             <img src={profileimg} alt="Admin-User" className="topbar-avatar rounded-circle me-2" />
            <div>
             <div className="fw-bold">{adminusername || "User"}</div>
             <div className="text-muted small">{role}</div>
           </div>                     
           <FaChevronDown className="ms-2" />  
          </div>
      </div>
      
     {/* Admin profile popup  */}
     
     {showAdminMenu && (
     <div className="full-profile-popup1">
       <div className="popup-header" >
       <h5> Profile Details</h5>
       <button className="btn-close"
       onClick={() => setShowAdminMenu(false)}
       >
       </button>
       </div>
          <div className="popup-content">
                        {/* Profile section */}
                        <div className="popup-section">
                          <div className="profile-photo">
                           <img src={profileimg} alt="Profile" />
                           <h6>{adminusername || "User"}</h6>  
                           <p className="text-success">● Active</p>
                          </div>
                          <div className="details-grid">
                            <div>
                              <h6>Personal Details</h6>
                              <strong>Position:</strong><p> HR Manager Head</p>
                              <strong>Employment Type:</strong><p> Fulltime</p>
                              <strong>Primary Supervisor:</strong> <p>Catherine</p>
                              <strong>Department:</strong><p> All</p>
                              <strong>HR Manager:</strong><p>S.Santhana Lakshmi</p>
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
                             <strong>Specialization:</strong><p> Computer Science</p>
                             <strong>Skills:</strong> <p> Figma, Adobe XD, Photoshop</p>
                           </div>
                          </div> 

                        <div className="details-grid">
                          <div>
                            <h6>Address</h6>
                             <strong>Address Line:</strong><p>Kattasseri House,Kalarikal</p>
                             <strong>City:</strong><p> Alappuzha</p>
                             <strong>State:</strong> <p>Kerala</p>
                             <strong>Country:</strong><p> India</p>
                          </div>
                          <div>
                           <h6>Contact Details</h6>
                             <strong>Phone:</strong> <p>9895195971</p>
                             <strong>Emergency Contact:</strong><p> 9895195971</p>
                             <strong>Relationship:</strong><p> Husband</p>
                             <strong>Email:</strong> <p>lakshmi@gmail.com</p>
                          </div>
                          <div>
                            <h6>Previous Experience</h6>
                             <strong>Company:</strong><p> Azym Technology</p>
                             <strong>Start & End:</strong><p> 22/07/2017 – 22/07/2022</p>
                             <strong>Job Title:</strong><p> HR Manager Head</p>
                             <strong>Description:</strong><p> Conducted user research, interviews, and usability testing.</p>
                          </div>
                        </div>

                        <div className="details-grid">
                          <div>
                            <h6>Bank Details</h6>
                             <strong>Bank Name:</strong><p> SBI</p>
                             <strong>Branch:</strong><p> Alappuzha</p>
                             <strong>Account Number:</strong><p> 12345678911</p>
                             <strong>IFSC Code:</strong><p> IFSC12345</p>
                             <strong>PAN Number:</strong><p> IFSC12345</p>
                         </div>
                    
                                      
                </div>
              </div>
           </div>
         </div>
     )}





      {/* Announcement Popup */}
      {showPopup && (
        <div className="announcement-popup shadow-lg">
          <div className="popup-header d-flex align-items-center justify-content-between">
            <div className="fw-bold fs-5">Announcement</div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-outline-secondary btn-sm">All</button>
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                onClick={handleAddNewClick}
              >
                <FaPlus /> Add New
              </button>
            </div>
          </div>

          <hr />

          {/* Add Announcement Form */}
          {showAddForm ? (
            <div className="add-form-container">
              <div className="form-header d-flex justify-content-between align-items-center">
                <h5 className="fw-bold">Add New Announcement</h5>
                <FaTimes className="close-icon" onClick={handleCancel} />
              </div>

              <form onSubmit={handleSubmit} className="announcement-form">
                <div className="form-grid">
                  <div>
                    <label>Event Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Event Name</label>
                    <input
                      type="text"
                      name="eventName"
                      placeholder="Enter name of event"
                      value={formData.eventName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Time Of The Event</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Event Type</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Holiday">Holiday</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="full-width">
                    <label>Message</label>
                    <textarea
                      name="message"
                      placeholder="Type message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div>
                    <label>Mention Any Employee</label>
                    <input
                      type="text"
                      name="employee"
                      placeholder="Enter employee name"
                      value={formData.employee}
                      onChange={handleChange}
                    />
                  </div>


                   <hr />
                    <h6 className="fw-bold">Your Details</h6>

                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      placeholder="Enter your designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </div>
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
          ) : (
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
                          {a.name || "Unknown"}
                        </div>
                      </div>
                      <div className="announcement-meta text-muted small">
                        <span>{a.designation || "No Designation"}</span>
                        <span className="dot">;</span>
                        <span>{a.date || "No Date"}</span>
                        <span className="dot">,</span>
                        <span>{a.time || "No Time"}</span>
                      </div>
                      <div className="announcement-eventname">
                      <span className="eventname">{a.eventName || "Untitled Event"}</span>
                      </div>
                      <div className="announcement-message mt-2">
                        {a.message || "No message provided."}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Topbar;
