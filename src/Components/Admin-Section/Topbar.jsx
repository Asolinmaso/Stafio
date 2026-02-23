import React, { useEffect, useState, useRef } from "react";
import {
	FaBell,
	FaChevronDown,
	FaPlus,
	FaTimes,
	FaFilePdf,
	FaDownload,
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

	// new
	const [filterOpen, setFilterOpen] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState("All");
	const [showReactions, setShowReactions] = useState(null);
	const [selectedDate, setSelectedDate] = useState("");
	const dateInputRef = useRef(null);
	const eventDateRef = useRef(null);

	useEffect(() => {
		// const storedAdminusername = localStorage.getItem("admin_username");
		// if (storedAdminusername) {
		//   setAdminusername(storedAdminusername);
		// }

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
		const session = getCurrentSession();

		if (session) {
			setAdminusername(session.username);
			setUsername(session.username);
			setRole(session.role);
		}
	}, []);

	// useEffect(() => {
	//   // Read values from sessionStorage
	//   const storedUsername = localStorage.getItem("admin_username");
	//   const storedRole = localStorage.getItem("admin_role");

	//   if (storedUsername) setUsername(storedUsername);
	//   if (storedRole) setRole(storedRole);
	// }, []);

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

		// Update state
		setAnnouncements(updatedAnnouncements);

		// Save to localStorage
		localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));

		// 🔥 Notify other components immediately
		window.dispatchEvent(new Event("announcementUpdated"));

		// Reset form
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
			{/* 🔔 Announcement List Popup */}
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
											dateInputRef.current.showPicker(); // opens calendar
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
										<div className="announcement-name">
											{a.name || "Unknown"}
										</div>

										<div className="announcement-meta">
											{a.designation || "No Designation"}
										</div>

										<div className="announcement-eventname">{a.eventName}</div>

										<div
											className="announcement-message"
											style={{ marginBottom: "20px" }}
										>
											{a.message}
										</div>
										<hr />

										<div className="announcement-actions">
											{/* React */}
											<div
												className="react-btn"
												onMouseEnter={() => setShowReactions(i)}
												onMouseLeave={() => setShowReactions(null)}
											>
												<AiOutlineLike /> React
												{showReactions === i && (
													<div className="reaction-popup">
														<span>👍</span>
														<span>❤️</span>
														<span>😂</span>
														<span>🎉</span>
														<span>👏</span>
													</div>
												)}
											</div>

											{/* Share */}
											<div className="action-btn">
												<FaShareAlt /> Share
											</div>

											{/* Event */}
											<div className="action-btn">
												<MdEvent /> Event
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}

			{/* 🟦 Add New Announcement Modal */}
			{showAddForm && (
				<div className="add-announcement-overlay">
					<div className="add-form-container">
						<div className="form-header">
							<h5 className="text-white">Add New Announcement</h5>
							<FaTimes
								className="close-icon text-white"
								onClick={() => setShowAddForm(false)}
							/>
						</div>

						<form onSubmit={handleSubmit} className="announcement-form">
							{/* Upload Image Section */}
							<div className="upload-section d-flex align-items-center gap-3">
								<div className="upload-avatar-placeholder">
									<img src={profileimg} alt="Upload Placeholder" />
								</div>
								<div className="upload-info">
									<div className="upload-title">Upload Image</div>
									<div className="upload-subtitle">Image should be below 4 mb</div>
									<button type="button" className="btn-upload">Upload</button>
								</div>
							</div>

							<div className="form-grid">
								<div>
									<label>Event Date</label>
									<div className="input-with-icon">
										<input
											type="text"
											name="date"
											value={formData.date}
											onChange={handleChange}
											placeholder="dd/mm/yyyy"
											onFocus={(e) => (e.target.type = "date")}
											onBlur={(e) => (e.target.type = "text")}
										/>
										<div className="icon-right"><MdEvent /></div>
									</div>
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
									<label>Time Of the Event</label>
									<input
										type="text"
										name="time"
										placeholder="Enter name of event"
										value={formData.time}
										onChange={handleChange}
										onFocus={(e) => (e.target.type = "time")}
										onBlur={(e) => (e.target.type = "text")}
									/>
								</div>

								<div>
									<label>Event Type</label>
									<div className="select-wrapper">
										<select
											name="eventType"
											value={formData.eventType}
											onChange={handleChange}
										>
											<option value="" disabled selected>Select</option>
											<option value="Meeting">Meeting</option>
											<option value="Holiday">Holiday</option>
											<option value="General">General</option>
										</select>
										<FaChevronDown className="select-chevron" />
									</div>
								</div>

								<div>
									<label>Message</label>
									<input
										type="text"
										name="message"
										placeholder="Type message"
										value={formData.message}
										onChange={handleChange}
									/>
								</div>

								<div>
									<label>Mention Any Employee</label>
									<div className="select-wrapper">
										<select
											name="employee"
											value={formData.employee}
											onChange={handleChange}
										>
											<option value="" disabled selected>Select</option>
											{/* Map employees here if available */}
										</select>
										<FaChevronDown className="select-chevron" />
									</div>
								</div>

								<div className="full-width">
									<hr className="form-divider" />
									<h6 className="form-section-title">Your Details</h6>
								</div>

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
									<div className="select-wrapper">
										<select
											name="designation"
											value={formData.designation}
											onChange={handleChange}
										>
											<option value="" disabled selected>Select</option>
											<option value="Designer">Designer</option>
											<option value="Developer">Developer</option>
											<option value="HR">HR</option>
										</select>
										<FaChevronDown className="select-chevron" />
									</div>
								</div>
							</div>

							<div className="form-footer">
								<button type="submit" className="btn-submit">
									Submit
								</button>
								<button
									type="button"
									className="btn-cancel"
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
				<div className="full-profile-popups">
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
								<h6>{adminusername || "User"}</h6>
								<p className="text-success">● Active</p>
							</div>

							<div className="details-grid">
								<div>
									<h6>Personal Details</h6>
									<strong>Position:</strong>
									<p> UI/UX Designer</p>
									<strong>Employment Type:</strong>
									<p> Internship</p>
									<strong>Primary Supervisor:</strong> <p>Sakshi</p>
									<strong>Department:</strong>
									<p> Design</p>
									<strong>HR Manager:</strong>
									<p> Santhana Lakshmi</p>
								</div>
								<div>
									<h6>Personal Details</h6>
									<strong>Gender:</strong>
									<p> Female</p>
									<strong>Date of Birth:</strong>
									<p> 22/07/1993</p>
									<strong>Blood Group:</strong>
									<p> A+</p>
									<strong>Marital Status:</strong>
									<p> Married</p>
									<strong>Portfolio:</strong>
									<p> http://www.behance.com</p>
								</div>
								<div>
									<h6>Educational Qualification</h6>
									<strong>Institution:</strong>
									<p> CEMP Punnapra</p>
									<strong>Start & End Date:</strong>
									<p> 22/07/2012 – 22/07/2016</p>
									<strong>Course:</strong>
									<p> B.Tech</p>
									<strong>Specialization:</strong>
									<p> CSE</p>
									<strong>Skills:</strong> <p> Figma, Adobe XD, Photoshop</p>
								</div>
							</div>

							<div className="details-grid">
								<div>
									<h6>Address</h6>
									<strong>Address Line:</strong>
									<p>Kattasseri House</p>
									<strong>City:</strong>
									<p> Alappuzha</p>
									<strong>State:</strong> <p>Kerala</p>
									<strong>Country:</strong>
									<p> India</p>
								</div>
								<div>
									<h6>Contact Details</h6>
									<strong>Phone:</strong> <p>9895195971</p>
									<strong>Emergency Contact:</strong>
									<p> 9895195971</p>
									<strong>Relationship:</strong>
									<p> Husband</p>
									<strong>Email:</strong> <p>aiswarya@gmail.com</p>
								</div>
								<div>
									<h6>Previous Experience</h6>
									<strong>Company:</strong>
									<p> Azym Technology</p>
									<strong>Start & End:</strong>
									<p> 22/07/2018 – 22/07/2022</p>
									<strong>Job Title:</strong>
									<p> UI/UX Designer</p>
									<strong>Description:</strong>
									<p>
										{" "}
										Conducted user research, interviews, and usability testing.
									</p>
								</div>
							</div>
							<div className="details-grid">
								<div>
									<h6>Bank Details</h6>
									<strong>Bank Name:</strong>
									<p> SBI</p>
									<strong>Branch:</strong>
									<p> Alappuzha</p>
									<strong>Account Number:</strong>
									<p> 12345678910</p>
									<strong>IFSC Code:</strong>
									<p> IFSC12345</p>
								</div>

								<div className="submitted-docs">
									<h6>Submitted Documents</h6>
									<div className="doc-item">
										<FaFilePdf className="text-danger me-2" /> Signed
										OfferLetter.pdf
										<FaDownload className="float-end" />
									</div>
									<div className="doc-item">
										<FaFilePdf className="text-danger me-2" />{" "}
										DegreeCertificate.pdf
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
		</>
	);
};

export default Topbar;
