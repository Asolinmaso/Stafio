import React, { useState, useEffect, useContext } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./EmployeesMyTeam.css";
import { FaUserFriends, FaFilter, FaSearch, FaEdit } from "react-icons/fa";
import group10 from "../../../assets/Group10.png";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../../utils/apiClient";
import { SettingsContext } from "../../Employee-Section/Settings-/SettingsContext";

const Employee = () => {
	const [showModal, setShowModal] = useState(false);
	const [employees, setEmployees] = useState([]);
	const [errors, setErrors] = useState({});
	const { fmtDate } = useContext(SettingsContext);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({});
	const [previewImage, setPreviewImage] = useState(null);
	const [staffList, setStaffList] = useState([]);
	const [filters, setFilters] = useState({
		department: "all",
		position: "all",
		status: "all",
	});

	const [showProfileModal, setShowProfileModal] = useState(false);
	const location = useLocation();
	const highlightName = location.state?.highlightName || "";
	const navigate = useNavigate();

	//handleChange
	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	//handleImageChange
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPreviewImage(URL.createObjectURL(file));
		}
	};

	//handleEditClick
	const handleEditClick = () => {
		if (!selectedEmployee) return;

		const profile = selectedEmployee.profile || {};
		const education = selectedEmployee.education || {};
		const id = Number(profile.empId);
		console.log("FINAL EDIT ID:", id);

		const formatDate = (dateStr) => {
			if (!dateStr || dateStr === "Not Set" || dateStr === "N/A") return "";
			const parts = dateStr.split("/");
			if (parts.length === 3) {
				return `${parts[2]}-${parts[1]}-${parts[0]}`;
			}
			return "";
		};

		setFormData({
			// ✅ USE profile + education instead of direct access
			firstName: profile.first_name || "",
			lastName: profile.last_name || "",
			employeeId: profile.empId || "",
			joiningDate: formatDate(profile.joiningDate),
			email: profile.email || "",
			phone: profile.phone || "",
			employmentType: profile.empType || "",
			supervisor: profile.supervisor || "",
			hrManager: profile.hrManager || "",
			department: profile.department || "",
			designation: profile.position || "",
			gender: profile.gender || "",
			dob: formatDate(profile.dob),
			bloodGroup: profile.bloodGroup || "",
			maritalStatus: profile.maritalStatus || "",

			portfolioLink: education.portfolio || "",
			institution: education.institution || "",
			eduStartDate: formatDate(education.eduStartDate),
			eduEndDate: formatDate(education.eduEndDate),
			course: education.qualification || "",
			specialization: education.specialization || "",
			skills: Array.isArray(education.skills)
				? education.skills.join(", ")
				: education.skills || "",

			status: profile.status || "Active",
		});

		setEditingId(id);
		setPreviewImage(profile.profile_image || null);

		setIsEditing(true);
		setShowProfileModal(false);
		setShowModal(true);
	};

	//handleSubmit for both add and edit
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (isEditing) {
				// ✅ EDIT API
				await apiClient.put(`/admin_profile/${editingId}`, formData, {
					headers: {
						"X-User-Role": localStorage.getItem("current_role"),
						"X-User-ID": localStorage.getItem("current_user_id"),
					},
				});

				alert("Employee updated successfully ✅");
			} else {
				// ✅ ADD API
				await apiClient.post("/api/add_employee", formData);

				alert("Employee added successfully ✅");
			}

			setShowModal(false);
			setIsEditing(false);
		} catch (error) {
			console.error("Error saving employee:", error);
			alert("Something went wrong ❌");
		}

		if (isEditing && !editingId) {
			alert("Edit ID missing ❌");
			return;
		}
	};

	//handleViewDetails
	const handleViewDetails = async (emp) => {
		try {
			const response = await apiClient.get(`/admin_profile/${emp.id}`, {
				headers: {
					"X-User-Role": localStorage.getItem("current_role"),
					"X-User-ID": localStorage.getItem("current_user_id"),
				},
			});
			console.log("FULL API DATA:", response.data);

			setSelectedEmployee(response.data); // ✅ FULL PROFILE
			setShowProfileModal(true);
		} catch (error) {
			console.error("Error fetching full profile:", error);
			alert("Could not load employee details.");
		}
	};

	const closeProfileModal = () => {
		setShowProfileModal(false);
		setSelectedEmployee(null);
	};

	// Fetch team members from API
	useEffect(() => {
		const fetchTeam = async () => {
			try {
				setLoading(true);
				const response = await apiClient.get(`/api/my_team`, {
					headers: {
						"X-User-Role": localStorage.getItem("current_role"),
						"X-User-ID": localStorage.getItem("current_user_id"),
					},
				});

				// Map API response to component format
				console.log(response.data);
				const teamData = response.data.map((member, index) => ({
					...member, // ✅ keep everything
					empId: String(member.id).padStart(6, "0"),
					DateOfJoining: member.joining_date
						? fmtDate(member.joining_date)
						: "-",
					image: `https://i.pravatar.cc/40?img=${(index % 70) + 1}`,
				}));

				setEmployees(teamData);
			} catch (error) {
				console.error("Error fetching team:", error);
				setEmployees([]);
			} finally {
				setLoading(false);
			}
		};

		fetchTeam();
	}, []);

	const filteredEmployees = highlightName
		? employees.filter((emp) =>
				emp.name.toLowerCase().includes(highlightName.toLowerCase()),
			)
		: employees;

	// for searching employees
	const baseEmployees = highlightName
		? employees.filter((emp) =>
				emp.name.toLowerCase().includes(highlightName.toLowerCase()),
			)
		: employees;

	const searchedEmployees = baseEmployees.filter((emp) =>
		`${emp.name} ${emp.email} ${emp.empId}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase()),
	);

	// for filtering the employees
	const filteredEmployee = searchedEmployees.filter((emp) => {
		return (
			(filters.department === "all" || emp.department === filters.department) &&
			(filters.position === "all" || emp.position === filters.position) &&
			(filters.status === "all" || emp.status === filters.status)
		);
	});

	// for filtering the employees
	const sortedEmployees = [...filteredEmployee].sort((a, b) => {
		switch (sortBy) {
			case "name":
				return a.name.localeCompare(b.name);

			case "department":
				return a.department.localeCompare(b.department);

			case "status":
				return a.status.localeCompare(b.status);

			case "newest":
				return (b.id ?? 0) - (a.id ?? 0); // fallback

			case "oldest":
				return (a.id ?? 0) - (b.id ?? 0);

			default:
				return 0;
		}
	});

	return (
		<div className="employee-page">
			<div className="rightside-logo ">
				<img src={group10} alt="logo" className="rightside-logos" />
			</div>
			<AdminSidebar />
			<div className="employee-main">
				<Topbar />
				<div className="employee-content">
					<div className="employee-header">
						{/* LEFT SIDE */}
						<div className="header-left">
							<h2>My Team</h2>

							<div className="emplt-top-buttons">
								<button
									className="emplt-btn-apply"
									onClick={() => navigate("/employees-list")}
								>
									All Employee
								</button>
								<button className="emplt-btn-regularization active">
									My Team
								</button>
							</div>

							<div className="search-containerr1">
								<FaSearch className="search-iconn1" size={16} />
								<input
									type="text"
									placeholder="Search..."
									className="search-inputt1"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
						</div>

						{/* RIGHT SIDE */}
						<div className="header-right1">
							<div className="filter-sort">
								{/* FILTER BUTTON */}
								<div className="filter-wrapper">
									<button
										className="right-butn-filterr"
										onClick={() => setShowFilters((prev) => !prev)}
									>
										<FaFilter /> Filter
									</button>

									{/* DROPDOWN PANEL */}
									{showFilters && (
										<div className="filter-dropdown">
											<h4>Filter</h4>

											{/* NAME */}
											<div className="filter-field">
												<label>Name</label>
												<input
													type="text"
													placeholder="Please enter name"
													// value={filters.name}
													value={searchTerm}
													onChange={(e) => setSearchTerm(e.target.value)}
												/>
											</div>

											{/* DEPARTMENT + POSITION */}
											<div className="filter-row">
												<div className="filter-field">
													<label>Department</label>
													<select
														value={filters.department}
														onChange={(e) =>
															setFilters({
																...filters,
																department: e.target.value,
															})
														}
													>
														<option value="all">Select</option>
														<option value="Human Resource">
															Human Resource
														</option>
														<option value="Development">Development</option>
														<option value="Design">Design</option>
														<option value="Sales">Sales</option>
													</select>
												</div>

												<div className="filter-field">
													<label>Position</label>
													<select
														value={filters.position}
														onChange={(e) =>
															setFilters({
																...filters,
																position: e.target.value,
															})
														}
													>
														<option value="all">Select</option>
														<option value="Project Head">Project Head</option>
														<option value="Designer">Designer</option>
														<option value="Developer">Developer</option>
														<option value="UIUX">UIUX</option>
													</select>
												</div>
											</div>

											{/* ACTIONS */}
											<div className="filter-actions">
												<button
													className="reset-btn"
													onClick={() => {
														setFilters({
															name: "",
															department: "all",
															position: "all",
															status: "all",
														});
														setSearchTerm("");
														setShowFilters(false);
													}}
												>
													Reset
												</button>

												<button
													className="apply-btn"
													onClick={() => setShowFilters(false)}
												>
													Apply
												</button>
											</div>
										</div>
									)}
								</div>

								<select
									className="sort-select1"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
								>
									<option value="newest">Sort By : Newest</option>
									<option value="oldest">Sort By : Oldest</option>
									<option value="name">Sort By : Name</option>
									<option value="department">Sort By : Department</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="text-center py-4">
						<p>Loading team members...</p>
					</div>
				) : (
					<table className="employee-table">
						<thead>
							<tr>
								<th>Name/Email ID</th>
								<th>Employee ID</th>
								<th>Date Of Joining</th>
								<th>Department</th>
								<th>Position</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{sortedEmployees.map((emp) => (
								<tr key={emp.id}>
									<td>
										<div className="emp-info">
											<img src={emp.image} alt={emp.name} className="emp-img" />
											<div>
												<p className="emp-name">{emp.name}</p>
												<p className="emp-email">{emp.email}</p>
											</div>
										</div>
									</td>
									<td>{emp.empId}</td>
									<td>{emp.DateOfJoining}</td>
									<td>{emp.department}</td>
									<td>{emp.position}</td>
									<td>
										<button
											className="view-btn"
											onClick={() => handleViewDetails(emp)}
										>
											View Details
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				<div className="pagination">
					<div className="showing">
						Showing{" "}
						<select>
							<option>07</option>
							<option>10</option>
							<option>15</option>
						</select>
					</div>
					<div className="page-nav">
						<button>Prev</button>
						<span className="page-num">01</span>
						<button>Next</button>
					</div>
				</div>
			</div>

			{/* --------- High-Fidelity Profile Detail Modal ---------- (View details) */}
			{showProfileModal && selectedEmployee && (
				<div className="profile-overlay-fixed" onClick={closeProfileModal}>
					<div
						className="profile-modal-container"
						onClick={(e) => e.stopPropagation()}
					>
						{/* HEADER PART */}
						<div className="profile-modal-header">
							<button className="modal-close-times" onClick={closeProfileModal}>
								×
							</button>
						</div>
						<div className="profile-modal-scrollable">
							{/* TOP GRID: Image + Details */}
							<div className="profile-top-grid">
								<div className="profile-image-col">
									<div className="profile-title-row">
										<h2 className="profile-title-text">Profile</h2>
										<div className="header-icon-box">
											<button
												className="edit-icon-btn"
												onClick={handleEditClick}
											>
												<FaEdit />
											</button>
										</div>
										<div className="active-tag-box">
											<span className="active-dot"></span>
											<span className="active-text">Active</span>
										</div>
									</div>
									<div className="profile-image-card-box">
										<div className="profile-circular-mask">
											<img
												src={
													selectedEmployee.image ||
													"https://randomuser.me/api/portraits/women/44.jpg"
												}
												alt={selectedEmployee.name}
												className="profile-large-img-circle"
											/>
										</div>
										<div className="profile-name-id-pill">
											{selectedEmployee.name}(ID {selectedEmployee.empId})
										</div>
									</div>
								</div>
								<div className="details-col">
									<h5 className="section-title">Personal Details</h5>
									<div className="info-item">
										<label>Position</label>
										<p>{selectedEmployee.position || "Not Set"}</p>
									</div>
									<div className="info-item">
										<label>Employment Type</label>
										<p>{selectedEmployee.empType || "Not Set"}</p>
									</div>
									<div className="info-item">
										<label>Department</label>
										<p>{selectedEmployee.department || "Not Set"}</p>
									</div>
									<div className="info-item">
										<label>Joining Date</label>
										<p>{selectedEmployee.DateOfJoining || "Not Set"}</p>
									</div>
								</div>
							</div>
							<div className="profile-details-full-grid">
								<div className="details-section-box">
									<h5 className="section-title">Contact & Other Info</h5>
									<div className="full-grid-2col">
										<div className="info-item">
											<label>Email</label>
											<p>{selectedEmployee.email || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>Phone</label>
											<p>{selectedEmployee.phone || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>Reports To</label>
											<p>{selectedEmployee.supervisor || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>HR Manager</label>
											<p>{selectedEmployee.hrManager || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>Gender</label>
											<p>{selectedEmployee.gender || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>Marital Status</label>
											<p>{selectedEmployee.maritalStatus || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>Date of Birth</label>
											<p>{selectedEmployee.dob || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>Blood Group</label>
											<p>{selectedEmployee.bloodGroup || "N/A"}</p>
										</div>
									</div>
								</div>
								<div className="details-section-box">
									<h5 className="section-title">Educational & Professional</h5>
									<div className="full-grid-2col">
										<div className="info-item">
											<label>Institution</label>
											<p>{selectedEmployee.education?.institution || "N/A"}</p>
										</div>
										<div className="info-item">
											<label>Qualification</label>
											<p>
												{selectedEmployee.education?.qualification || "N/A"}
											</p>
										</div>
										<div className="info-item">
											<label>Specialization</label>
											<p>
												{selectedEmployee.education?.specialization || "N/A"}
											</p>
										</div>
										<div className="info-item">
											<label>Skills</label>
											<p>
												{Array.isArray(selectedEmployee.education?.skills)
													? selectedEmployee.education?.skills.join(", ")
													: selectedEmployee.education?.skills || "N/A"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{showModal && (
				<div className="modal-overlay1">
					<div className="add-employee-modal1">
						{/* HEADER */}
						<div className="empl-modal-header-blue">
							<h3>{isEditing ? "Edit Employee" : "Add Employee"}</h3>
							<button
								className="empl-close-btn"
								onClick={() => setShowModal(false)}
							>
								×
							</button>
						</div>

						{/* BODY */}
						<div className="empl-modal-body">
							<form className="add-employee-form" onSubmit={handleSubmit}>
								<div className="empl-form-left">
									{/* Profile Upload Section */}
									<div className="profile-upload-section">
										<div className="profile-placeholder">
											{previewImage ? (
												<img
													src={previewImage}
													alt="Preview"
													style={{
														width: "100%",
														height: "100%",
														borderRadius: "50%",
														objectFit: "cover",
													}}
												/>
											) : (
												<i className="profile-icon">
													<FaUserFriends size="2em" />{" "}
												</i>
											)}
										</div>
										<div className="upload-info">
											<h4>Upload Profile Image</h4>
											<p>Image should be below 4 MB</p>
											<input
												type="file"
												accept="image/*"
												style={{ display: "none" }}
												id="profileImageInput"
												onChange={handleImageChange}
											/>
											<button
												type="button"
												className="new-empl-upload-btn1"
												onClick={() =>
													document.getElementById("profileImageInput").click()
												}
											>
												Upload
											</button>
										</div>
									</div>

									{/* Form Rows */}
									<div className="form-row1">
										<div className="empl-form-group">
											<label>First Name</label>
											<input
												type="text"
												name="firstName"
												placeholder="Please enter name"
												value={formData.firstName}
												onChange={handleChange}
											/>
											{errors.firstName && (
												<p className="error-text">{errors.firstName}</p>
											)}
										</div>
										<div className="empl-form-group">
											<label>Last Name</label>
											<input
												type="text"
												name="lastName"
												placeholder="Please enter name"
												value={formData.lastName}
												onChange={handleChange}
											/>
											{errors.lastName && (
												<p className="error-text">{errors.lastName}</p>
											)}
										</div>
									</div>

									<div className="form-row1">
										<div className="empl-form-group">
											<label>Employee ID</label>
											<input
												type="text"
												name="employeeId"
												placeholder="Please enter employee ID"
												value={formData.employeeId}
												onChange={handleChange}
											/>
											{errors.employeeId && (
												<p className="error-text">{errors.employeeId}</p>
											)}
										</div>
										<div className="empl-form-group">
											<label>Joining Date</label>
											<input
												type="date"
												name="joiningDate"
												placeholder="dd/mm/yyyy"
												value={formData.joiningDate}
												onChange={handleChange}
											/>
											{errors.joiningDate && (
												<p className="error-text">{errors.joiningDate}</p>
											)}
										</div>
									</div>

									<div className="form-row1">
										<div className="empl-form-group">
											<label>Email</label>
											<input
												type="email"
												name="email"
												placeholder="Please enter email"
												value={formData.email}
												onChange={handleChange}
											/>
											{errors.email && (
												<p className="error-text">{errors.email}</p>
											)}
										</div>
										<div className="empl-form-group">
											<label>Phone Number</label>
											<input
												type="tel"
												name="phone"
												placeholder="Please enter phone number"
												value={formData.phone}
												onChange={handleChange}
											/>
											{errors.phone && (
												<p className="error-text">{errors.phone}</p>
											)}
										</div>
									</div>

									<div className="form-row1">
										<div className="empl-form-group">
											<label>Employment Type</label>
											<select
												name="employmentType"
												value={formData.employmentType}
												onChange={handleChange}
											>
												<option value="">Select</option>
												<option value="Full Time">Full Time</option>
												<option value="Part Time">Part Time</option>
												<option value="Contract">Contract</option>
												<option value="Intern">Intern</option>
											</select>
											{errors.employmentType && (
												<p className="error-text">{errors.employmentType}</p>
											)}
										</div>
										<div className="empl-form-group">
											<label>Primary Supervisor</label>
											<select
												name="supervisor"
												value={formData.supervisor}
												onChange={handleChange}
											>
												<option value="">Select</option>
												{staffList.map((staff) => (
													<option key={staff.id} value={staff.name}>
														{staff.name}
													</option>
												))}
											</select>
											{errors.supervisor && (
												<p className="error-text">{errors.supervisor}</p>
											)}
										</div>
									</div>

									<div className="form-row1">
										<div className="empl-form-group">
											<label>HR Manager</label>
											<select
												name="hrManager"
												value={formData.hrManager}
												onChange={handleChange}
											>
												<option value="">Select</option>
												{staffList
													.filter((staff) => staff.role === "admin")
													.map((staff) => (
														<option key={staff.id} value={staff.name}>
															{staff.name}
														</option>
													))}
											</select>
											{errors.hrManager && (
												<p className="error-text">{errors.hrManager}</p>
											)}
										</div>
										<div className="empl-form-group">
											<label>Department</label>
											<select
												name="department"
												value={formData.department}
												onChange={handleChange}
											>
												<option value="">Select</option>
												<option value="Engineering">Engineering</option>
												<option value="Marketing">Marketing</option>
												<option value="Sales">Sales</option>
												<option value="HR">HR</option>
												<option value="Finance">Finance</option>
											</select>
											{errors.department && (
												<p className="error-text">{errors.department}</p>
											)}
										</div>
									</div>

									<div className="form-row1">
										<div className="empl-form-group">
											<label>Designation</label>
											<select
												name="designation"
												value={formData.designation}
												onChange={handleChange}
											>
												<option value="">Select</option>
												<option value="Software Engineer">
													Software Engineer
												</option>
												<option value="Senior Engineer">Senior Engineer</option>
												<option value="Team Lead">Team Lead</option>
												<option value="Manager">Manager</option>
											</select>
											{errors.designation && (
												<p className="error-text">{errors.designation}</p>
											)}
										</div>
										<div className="empl-form-group">
											<label>Status</label>
											<select>
												<option>Active</option>
												<option>Inactive</option>
												<option>Pending</option>
											</select>
										</div>
									</div>

									{/* ---------- Modal Actions ---------- */}
									<div className="modal-actions01">
										<button type="submit" className="save-btn">
											{isEditing ? "Update" : "Save"}
										</button>
										<button
											type="button"
											className="action-cancel-btn"
											onClick={() => {
												setShowModal(false);
											}}
										>
											Cancel
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Employee;
