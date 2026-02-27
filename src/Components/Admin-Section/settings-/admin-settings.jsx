import React, { useState, useEffect, useContext } from "react";
import "./admin-settings.css";
import AdminSidebar from "../AdminSidebar";
import profileimg from "../../../assets/profileimg.png";
import user from "../../../assets/user.png";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import { FaUserFriends, FaSearch, FaFilter, FaEdit, FaPlusCircle, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import { SettingsContext } from "../../Employee-Section/Settings-/SettingsContext";

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
		userSignup: "User Sign up",
		defaultThemeforUsers: "Default Theme for Users",
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
	const { theme, setTheme, language, setLanguage, font, setFont } = useContext(SettingsContext);
	const [activeTab, setActiveTab] = useState("department");

	const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
	//new for validation
	const [errors, setErrors] = useState({});
	const [submitted, setSubmitted] = useState(false);
	const t = (key) => translations[language]?.[key] || key;
	//new for switch check box
	const [allowManagerEdit, setAllowManagerEdit] = useState(false);

	// Add missing state variables
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [position, setPosition] = useState("");
	const [role, setRole] = useState("admin");
	const [lunchBreak, setLunchBreak] = useState("1:00 PM - 2:00 PM");
	const [coffeeBreak, setCoffeeBreak] = useState("4:00 PM - 4:15 PM");

	const [basicForm, setBasicForm] = useState({
		/* new for validation*/ firstName: "",
		lastName: "",
		email: "",
		phone: "",
	});

	const [basicErrors, setBasicErrors] = useState({});

	//team and department checkbox selectsall/de-selectsall
	// state added
	const [selectedTeamRows, setSelectedTeamRows] = useState({
		row1: false,
		row2: false,
		row3: false,
	});

	const [selectedDepartmentRows, setSelectedDepartmentRows] = useState({
		row1: false,
		row2: false,
		row3: false,
	});

	//create new department modal state
	const [showCreateDept, setShowCreateDept] = useState(false);

	//create new break time modal state
	const [showBreakModal, setShowBreakModal] = useState(false);

	const [breakName, setBreakName] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	const handleBasicChange = (e) => {
		const { name, value } = e.target;

		setBasicForm({
			...basicForm,
			[name]: value,
		});

		// clear error on change
		setBasicErrors({
			...basicErrors,
			[name]: "",
		});
	};

	//validation logic   new

	const validateBasicInfo = () => {
		const errors = {};

		if (!basicForm.firstName.trim()) {
			errors.firstName = "*First name is required";
		}

		if (!basicForm.lastName.trim()) {
			errors.lastName = "*Last name is required";
		}

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

		if (!basicForm.position) {
			errors.position = "Please select a position";
		}

		setBasicErrors(errors);
		return Object.keys(errors).length === 0;
	};

	//save Button logic

	const handleBasicSave = () => {
		if (validateBasicInfo()) {
			console.log("Basic info saved:", basicForm);
			// API call later
		}
	};

	//cancel button logic (reset)

	const handleBasicCancel = () => {
		setBasicForm({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
		});
		setBasicErrors({});
	};

	return (
		// new
		<div className={`dashboard-wrapper d-flex admin-theme-${theme}`}>
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
					{/* Create New button – for Department and Break Times */}
					<div className="settings-top-row">
						<div className="settings-header">
							<h1>{t("title")}</h1>
							<p>{t("subtitle")}</p>
						</div>
						{(activeTab === "department" || activeTab === "breaktimes") && (
							<button
								className="btn-create-new-pill"
								onClick={() => activeTab === "department" ? setShowCreateDept(true) : setShowBreakModal(true)}
							>
								Create new
							</button>
						)}
					</div>

					{/* Create New department Modal */}

					{showCreateDept && (
						<div className="dept-modal-overlay">
							<div className="dept-modal-box">
								<div className="dept-modal-header">
									<h3>Create New Department</h3>
									<button
										className="dept-close-btn"
										onClick={() => setShowCreateDept(false)}
									>
										✕
									</button>
								</div>

								<div className="dept-modal-body">
									<div className="dept-form-group">
										<label>Department</label>
										<input type="text" placeholder="Enter department" />
									</div>

									<div className="dept-form-group">
										<label>Number of Employees</label>
										<input type="number" placeholder="Enter number" />
									</div>

									<div className="dept-form-group">
										<label>Department Head</label>
										<select>
											<option value="">Select</option>
											<option>Lakshmi</option>
											<option>Sakshi</option>
											<option>Asolin</option>
										</select>
									</div>
								</div>

								<div className="dept-modal-footer">
									<button
										className="dept-btn-cancel"
										onClick={() => setShowCreateDept(false)}
									>
										Cancel
									</button>
									<button className="dept-btn-save">Save</button>
								</div>
							</div>
						</div>
					)}

					{/* Tabs */}
					<div className="settings-tabs">
						{["general", "basic", "team", "department", "breaktimes"].map(
							(tab) => (
								<button
									key={tab}
									className={`tab-link ${activeTab === tab ? "active" : ""}`}
									onClick={() => setActiveTab(tab)}
								>
									{tab === "general"
										? t("general")
										: tab === "basic"
											? t("basic")
											: tab === "team"
												? t("team")
												: tab === "department"
													? t("department")
													: t("breaktimes")}
								</button>
							),
						)}
					</div>

					{/* Tab Content */}
					<div
						className={`settings-card ${activeTab === "breaktimes" ? "breaktimes-no-card" : ""
							}`}
					>
						{/* General Settings */}
						{activeTab === "general" && (
							<div>
								<h3>General</h3>
								<div className="form-row-grid">
									{/* Row 1 */}
									<div className="form-group-custom">
										<label className="section-label-top">{t("systemLanguage")}</label>
										<div className="custom-select-wrapper">
											<select
												value={language}
												onChange={(e) => setLanguage(e.target.value)}
											>
												<option value="english">English</option>
												<option value="hindi">Hindi</option>
												<option value="tamil">Tamil</option>
											</select>
										</div>
									</div>

									<div className="form-group-custom">
										<label className="section-label-top">{t("userSignup")}</label>
										<div className="setting-item-underline">
											<span className="setting-muted-text">
												Allow new users to sign up
											</span>
											<label className="switch">
												<input type="checkbox" defaultChecked />
												<span className="slider round"></span>
											</label>
										</div>
									</div>

									{/* Row 2 */}
									<div className="form-group-custom">
										<label className="section-label-top">{t("dashboardTheme")}</label>
										<div className="theme-input-box0">
											<span className="setting-muted-text">
												{theme === "light" ? "Light Theme" : "Dark Theme"}
											</span>
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
										</div>
									</div>

									<div className="form-group-custom">
										<label className="section-label-top">{t("defaultThemeforUsers")}</label>
										<div className="theme-input-box0">
											<span className="setting-muted-text">
												Light Theme
											</span>
										</div>
									</div>

									{/* Row 3 */}
									<div className="form-group-custom">
										<label className="section-label-top">{t("systemFont")}</label>
										<div className="custom-select-wrapper">
											<select
												value={font}
												onChange={(e) => setFont(e.target.value)}
											>
												<option value="default">Default- Montserrat</option>
												<option value="arial">Arial</option>
												<option value="roboto">Roboto</option>
											</select>
										</div>
									</div>

									<div className="form-group-custom">
										<div className="setting-row-label-toggle">
											<label className="section-label-top" style={{ marginBottom: 0 }}>{t("dateFormat")}</label>
											<label className="switch">
												<input type="checkbox" defaultChecked />
												<span className="slider round"></span>
											</label>
										</div>
										<div className="custom-select-wrapper">
											<select
												value={dateFormat}
												onChange={(e) => setDateFormat(e.target.value)}
											>
												<option value="DD/MM/YYYY">DD/MM/YYYY</option>
												<option value="MM/DD/YYYY">MM/DD/YYYY</option>
											</select>
										</div>
									</div>

									{/* Row 4 */}
									<div className="form-group-custom">
										<label className="section-label-top">{t("allowManagertoeditemployeerecord")}</label>
										<div className="theme-input-box0">
											<span className="setting-muted-text">
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
									<div className="form-group-custom"></div> {/* Spacer for grid alignment */}
								</div>
							</div>
						)}

						{/* Basic Info */}
						{activeTab === "basic" && (
							<div className="basic-info-tab">
								<div className="form-row-grid">
									{/* Row 1 */}
									<div className="form-group-custom">
										<label className="section-label-top">{t("firstName")}</label>
										<input
											type="text"
											name="firstName"
											value={basicForm.firstName}
											placeholder="Please enter name"
											className="form-groupp"
											onChange={handleBasicChange}
										/>
										{basicErrors.firstName && (
											<span className="error-text">
												{basicErrors.firstName}
											</span>
										)}
									</div>

									<div className="form-group-custom">
										<label className="section-label-top">{t("lastName")}</label>
										<input
											type="text"
											name="lastName"
											placeholder="Please enter name"
											className="form-groupp"
											value={basicForm.lastName}
											onChange={handleBasicChange}
										/>
										{basicErrors.lastName && (
											<span className="error-text">
												{basicErrors.lastName}
											</span>
										)}
									</div>

									{/* Row 2 */}
									<div className="form-group-custom">
										<label className="section-label-top">{t("email")}</label>
										<input
											type="email"
											name="email"
											placeholder="Please enter email"
											className="form-groupp"
											value={basicForm.email}
											onChange={handleBasicChange}
										/>
										{basicErrors.email && (
											<span className="error-text">{basicErrors.email}</span>
										)}
									</div>

									<div className="form-group-custom">
										<label className="section-label-top">{t("phone")}</label>
										<input
											type="tel"
											name="phone"
											placeholder="Please enter phone number"
											className="form-groupp"
											value={basicForm.phone}
											onChange={handleBasicChange}
										/>
										{basicErrors.phone && (
											<span className="error-text">{basicErrors.phone}</span>
										)}
									</div>

									{/* Row 3 */}
									<div className="form-group-custom">
										<label className="section-label-top">{t("position")}</label>
										<div className="custom-select-wrapper">
											<select
												name="position"
												value={basicForm.position}
												onChange={handleBasicChange}
											>
												<option value="">Select</option>
												<option value="manager">Manager</option>
												<option value="developer">Developer</option>
												<option value="designer">Designer</option>
											</select>
										</div>
										{basicErrors.position && (
											<span className="error-text">
												{basicErrors.position}
											</span>
										)}
									</div>

									<div className="form-group-custom">
										<label className="section-label-top">{t("role")}</label>
										<div className="custom-select-wrapper">
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

								{/* Profile Picture Section */}
								<div className="profile-section-custom">
									<label className="section-label-top">Profile picture</label>
									<p className="file-info-muted">
										We support only JPEGs or PNGs under 5MB
									</p>
									<div className="profile-upload-container">
										<img
											src={profileimg}
											alt="Profile"
											className="profile-preview-circle"
										/>
										<button type="button" className="btn-upload-outline">
											<BsUpload className="upload-icon" /> Upload
										</button>
									</div>
								</div>

								<div className="form-actions-bottom">
									<button
										type="button"
										className="btn-cyan-action"
										onClick={handleBasicCancel}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="btn-cyan-action"
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
								<div className="team-table">
									<table>
										<thead>
											<tr>
												<th>
													<input
														type="checkbox"
														className="checkbbig"
														checked={Object.values(selectedTeamRows).every(
															Boolean,
														)}
														onChange={(e) => {
															const isChecked = e.target.checked;

															setSelectedTeamRows({
																row1: isChecked,
																row2: isChecked,
																row3: isChecked,
															});
														}}
													/>
												</th>
												<th>{t("name")}</th>
												<th>{t("datejoined")}</th>
												<th>{t("role")}</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													<input
														type="checkbox"
														className="checkbsmall"
														checked={selectedTeamRows.row1}
														onChange={(e) =>
															setSelectedTeamRows({
																...selectedTeamRows,
																row1: e.target.checked,
															})
														}
													/>
												</td>
												<td className="team-member">
													<img
														src={profileimg}
														alt="Lakshmi"
														className="member-avatar"
													/>
													<div>
														<div className="member-name">Lakshmi</div>
														<div className="member-email">
															lakshmi@gmail.com
														</div>
													</div>
												</td>
												<td className="member-joined">
													May 24, 2025 - 09:00 AM
												</td>
												<td>
													<span className="role-badge hr">HR</span>
												</td>
											</tr>
											<tr>
												<td>
													<input
														type="checkbox"
														className="checkbsmall"
														checked={selectedTeamRows.row2}
														onChange={(e) =>
															setSelectedTeamRows({
																...selectedTeamRows,
																row2: e.target.checked,
															})
														}
													/>
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
												<td className="member-joined">
													May 24, 2025 - 09:00 AM
												</td>
												<td>
													<span className="role-badge team-head">
														Team Head ▼
													</span>
												</td>
											</tr>
											<tr>
												<td>
													<input
														type="checkbox"
														className="checkbsmall"
														checked={selectedTeamRows.row3}
														onChange={(e) =>
															setSelectedTeamRows({
																...selectedTeamRows,
																row3: e.target.checked,
															})
														}
													/>
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
												<td className="member-joined">
													Apr 24, 2025 - 06:00 PM
												</td>
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

						{/* Department tab */}
						{activeTab === "department" && (
							<div className="department-table-container">
								<table className="department-table-new">
									<thead>
										<tr>
											<th width="40">
												<div className="checkbox-custom">
													<input
														type="checkbox"
														checked={Object.values(selectedDepartmentRows).every(Boolean)}
														onChange={(e) => {
															const isChecked = e.target.checked;
															setSelectedDepartmentRows({
																row1: isChecked,
																row2: isChecked,
																row3: isChecked,
															});
														}}
													/>
												</div>
											</th>
											<th>{t("department")}</th>
											<th>{t("numberOfMembers")}</th>
											<th>{t("departmentHead")}</th>
											<th className="text-right">{t("action")}</th>
										</tr>
									</thead>
									<tbody>
										{[
											{ row: "row1", name: "HR", count: 1, head: "Lakshmi" },
											{ row: "row2", name: "Design", count: 5, head: "Sakshi" },
											{ row: "row3", name: "Department", count: 7, head: "Asolin" }
										].map((item) => (
											<tr key={item.row}>
												<td>
													<div className="checkbox-custom">
														<input
															type="checkbox"
															checked={selectedDepartmentRows[item.row]}
															onChange={(e) =>
																setSelectedDepartmentRows({
																	...selectedDepartmentRows,
																	[item.row]: e.target.checked,
																})
															}
														/>
													</div>
												</td>
												<td>{item.name}</td>
												<td>{item.count}</td>
												<td>{item.head}</td>
												<td className="text-right">
													<div className="action-icons-group">
														<button className="icon-btn-edit"><FaPencilAlt /></button>
														<button className="icon-btn-delete"><FaTrashAlt /></button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}

						{/* Break Times - FIXED: Changed from "breaks" to "breaktimes" */}
						{activeTab === "breaktimes" && (
							<div>
								{/* <h3>Break Times</h3> */}
								<div className="break-times-content">
									<div className="break-item">
										<label>{t("lunchBreak")}</label>
										<div className="time-input-group">
											<div className="time-input-wrapper">
												<input
													type="text"
													value={lunchBreak}
													onChange={(e) => setLunchBreak(e.target.value)}
												/>
												<button className="edit-btn inside">
													<FaPencilAlt className="pen-icon-new" />
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
												/>
												<button className="edit-btn inside">
													<FaPencilAlt className="pen-icon-new" />
												</button>
											</div>
										</div>
									</div>

									{/* Create New Break Time Modal */}
									{showBreakModal && (
										<div className="break-modal-overlay">
											<div className="break-modal-box">
												{/* Header */}
												<div className="break-modal-header">
													<h3>Create Break Time</h3>
													<button
														className="break-close-btn"
														onClick={() => setShowBreakModal(false)}
													>
														✕
													</button>
												</div>

												{/* Body */}
												<div className="break-modal-body">
													<div className="break-form-group">
														<label>Break Name</label>
														<input
															type="text"
															placeholder="Enter break name"
															value={breakName}
															onChange={(e) => setBreakName(e.target.value)}
														/>
													</div>

													<div className="break-form-group">
														<label>Start Time</label>
														<input
															type="time"
															value={startTime}
															onChange={(e) => setStartTime(e.target.value)}
														/>
													</div>

													<div className="break-form-group">
														<label>End Time</label>
														<input
															type="time"
															value={endTime}
															onChange={(e) => setEndTime(e.target.value)}
														/>
													</div>
												</div>

												{/* Footer */}
												<div className="break-modal-footer">
													<button
														className="break-btn-cancel"
														onClick={() => {
															setShowBreakModal(false);
															setBreakName("");
															setStartTime("");
															setEndTime("");
														}}
													>
														Cancel
													</button>

													<button
														className="break-btn-save"
														onClick={() => {
															console.log({
																breakName,
																startTime,
																endTime,
															});
															setShowBreakModal(false);
														}}
													>
														Save
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
