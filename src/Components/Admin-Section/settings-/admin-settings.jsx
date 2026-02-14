import React, { useState, useEffect } from "react";
import "./admin-settings.css";
import AdminSidebar from "../AdminSidebar";
import profileimg from "../../../assets/profileimg.png";
import user from "../../../assets/user.png";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import penicon from "../../../assets/penicon2.png";
import deletebox from "../../../assets/deletebox.png";

const translations = {
<<<<<<< HEAD
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
    userSignup: "user Sign up",
    defaultThemeforUsers: "default Theme for Users",
  },
=======
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
		userSignup: "user Sign up",
		defaultThemeforUsers: "default Theme for Users",
	},
>>>>>>> origin/ajith-frontend

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
	const [activeTab, setActiveTab] = useState("general");
	const [theme, setTheme] = useState("light");
	const [language, setLanguage] = useState("english");
	const [font, setFont] = useState("default");
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

<<<<<<< HEAD


  const [basicForm, setBasicForm] = useState({ /* new for validation*/
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [basicErrors, setBasicErrors] = useState({});

  useEffect(() => {
    // Example: auto-save when language changes
    console.log("Auto-saving general settings", {
      language,
      theme,
      font,
      dateFormat
    });
  }, [language, theme, font, dateFormat]);

  //handle input change

  const handleBasicChange = (e) => {
    const { name, value } = e.target;

    setBasicForm({
      ...basicForm,
      [name]: value
    });

    // clear error on change
    setBasicErrors({
      ...basicErrors,
      [name]: ""
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
=======
	useEffect(() => {
		// Example: auto-save when language changes
		console.log("Auto-saving general settings", {
			language,
			theme,
			font,
			dateFormat,
		});
	}, [language, theme, font, dateFormat]);

	//handle input change

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
>>>>>>> origin/ajith-frontend

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

<<<<<<< HEAD
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
      phone: ""
    });
    setBasicErrors({});
  };

  //team and department checkbox selectsall/de-selectsall
  // state added
  const [selectedRows, setSelectedRows] = useState({
    row1: false,
    row2: false,
    row3: false
  });




  return (                                                      // new
    <div className={`dashboard-wrapper d-flex admin-${theme}`}>
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
          className="rightside-logos" />
      </div>
      {/* Sidebar */}
      <AdminSidebar />
=======
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

	return (
		// new
		<div className={`dashboard-wrapper d-flex admin-${theme}`}>
			<div className="rightside-logo ">
				<img src={group10} alt="logo" className="rightside-logos" />
			</div>
			{/* Sidebar */}
			<div className="sidebar">
				<AdminSidebar />
			</div>
>>>>>>> origin/ajith-frontend

			{/* Main content */}
			<div className="main-content flex-grow-1">
				<Topbar />

				<div className="settings-page p-4">
					{/* Header */}
					<div className="settings-header">
						<h1>{t("title")}</h1>
						<p>{t("subtitle")}</p>
					</div>

<<<<<<< HEAD
          {/* Create New button – only for Department tab */}{/*new modified */}
          {activeTab === "departments" && (
            <div className="department-top-action">
              <button className="btn-create-new">Create new</button>
            </div>
          )}
=======
					{/* Create New button – only for Department tab */}
					{/*new modified */}
					{activeTab === "departments" && (
						<div className="department-top-action">
							<button
								className="btn-create-new"
								onClick={() => setShowCreateDept(true)}
							>
								Create new
							</button>
						</div>
					)}
>>>>>>> origin/ajith-frontend

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

<<<<<<< HEAD
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
                    ? t("general")
                    : tab === "basic"
                      ? t("basic")
                      : tab === "team"
                        ? t("team")
                        : tab === "departments"
                          ? t("department")
                          : t("breaktimes")}
                </button>
              )
            )}
          </div>
=======
								<div className="dept-modal-body">
									<div className="dept-form-group">
										<label>Department</label>
										<input type="text" placeholder="Enter department" />
									</div>
>>>>>>> origin/ajith-frontend

									<div className="dept-form-group">
										<label>Number of Employees</label>
										<input type="number" placeholder="Enter number" />
									</div>

<<<<<<< HEAD
          {/* Tab Content */}
          <div className={`settings-card ${activeTab === "breaktimes" ? "breaktimes-no-card" : ""
            }`}>
            {/* General Settings */}
            {activeTab === "general" && (
              <div>
                <h3>{t("general")}</h3>
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group2">       {/* modified   */}
                      <label>{t("systemLanguage")}</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="tamil">Tamil</option>

                      </select>
                    </div>

                    <div className="form-groupz">           {/* modified   */}
                      <label>{t("dashboardTheme")}</label>
                      <div className="theme-input-box">    {/*new check box inside the input*/}
                        <span className="theme-label">
                          {theme === "light" ? "Light Theme" : "Dark Theme"}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={theme === "dark"}
                            onChange={() =>
                              setTheme(theme === "light" ? "dark" : "light")
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>

                    </div>
=======
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
>>>>>>> origin/ajith-frontend

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
										? t("general")
										: tab === "basic"
											? t("basic")
											: tab === "team"
												? t("team")
												: tab === "departments"
													? t("department")
													: t("breaktimes")}
								</button>
							),
						)}
					</div>

<<<<<<< HEAD
                    <div className="form-groupz">        {/* modified   */}
                      <label>{t("allowManagertoeditemployeerecord")}</label>
                      <div className="theme-input-box">     {/*new check box inside the input*/}
                        <span className="theme-label">
                          {theme === "Enable" ? "Enable" : "Disable"}
                        </span>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={allowManagerEdit}
                            onChange={() =>
                              setAllowManagerEdit(!allowManagerEdit)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-column">  {/* modified   */}
                    <div className="form-groupz">
                      <label>{t("userSignup")}</label>
                      <div className="theme-input-box">
                        <span className="theme-label">
                          Allow new users to sign up
                        </span>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>

                    <div className="form-group1">
                      <label>{t("defaultThemeforUsers")}</label>
                      <input
                        type="text"
                        placeholder="Light Theme" />
                    </div>

                    <div className="form-group2">     {/* modified   */}
                      <label>{t("dateFormat")}
                        <label className="switch">
                          <input type="checkbox" /> {/*checked={true} readOnly*/}
                          <span className="slider round"></span>
                        </label></label>
=======
					{/* Tab Content */}
					<div
						className={`settings-card ${
							activeTab === "breaktimes" ? "breaktimes-no-card" : ""
						}`}
					>
						{/* General Settings */}
						{activeTab === "general" && (
							<div>
								<h3>{t("general")}</h3>
								<div className="form-row">
									<div className="form-column">
										<div className="form-group2">
											{" "}
											{/* modified   */}
											<label>{t("systemLanguage")}</label>
											<select
												value={language}
												onChange={(e) => setLanguage(e.target.value)}
											>
												<option value="english">English</option>
												<option value="hindi">Hindi</option>
												<option value="tamil">Tamil</option>
											</select>
										</div>

										<div className="form-groupz">
											{" "}
											{/* modified   */}
											<label>{t("dashboardTheme")}</label>
											<div className="theme-input-box0">
												{" "}
												{/*new check box inside the input*/}
												<span className="theme-label">
													{theme === "light" ? "Light Theme" : "Dark Theme"}
												</span>
												<label className="switch">
													<input
														type="checkbox"
														checked={theme === "dark"}
														onChange={() =>
															setTheme(theme === "light" ? "dark" : "light")
														}
													/>
													<span className="slider round"></span>
												</label>
											</div>
										</div>

										<div className="form-group2">
											<label>{t("systemFont")}</label>
											<select
												value={font}
												onChange={(e) => setFont(e.target.value)}
											>
												<option value="default">Default - Montserrat</option>
												<option value="arial">Arial</option>
												<option value="roboto">Roboto</option>
											</select>
										</div>

										<div className="form-groupz">
											{" "}
											{/* modified   */}
											<label>{t("allowManagertoeditemployeerecord")}</label>
											<div className="theme-input-box0">
												{" "}
												{/*new check box inside the input*/}
												<span className="theme-label">
													{theme === "Enable" ? "Enable" : "Disable"}
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
									</div>
>>>>>>> origin/ajith-frontend

									<div className="form-column">
										{" "}
										{/* modified   */}
										<div className="form-groupz">
											<label>{t("userSignup")}</label>
											<div className="theme-input-box0">
												<span className="theme-label">
													Allow new users to sign up
												</span>
												<label className="switch">
													<input type="checkbox" />
													<span className="slider round"></span>
												</label>
											</div>
										</div>
										<div className="form-group1">
											<label>{t("defaultThemeforUsers")}</label>
											<input
												type="text"
												placeholder="Light Theme"
												className="dtucname"
											/>
										</div>
										<div className="form-group2">
											{" "}
											{/* modified   */}
											<label>
												{t("dateFormat")}
												<label className="switch">
													<input type="checkbox" />{" "}
													{/*checked={true} readOnly*/}
													<span className="slider round"></span>
												</label>
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

<<<<<<< HEAD
            {/* Basic Info */}
            {activeTab === "basic" && (
              <div>
                {/* <h3>Basic Info</h3> */}
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group">
                      <label>{t("firstName")}</label>
                      <input
                        type="text"
                        name="firstName"
                        value={basicForm.firstName}
                        placeholder="Please enter name"
                        // value={firstName}
                        // onChange={(e) => setFirstName(e.target.value)}
                        onChange={handleBasicChange}
                      />
                      {basicErrors.firstName && (
                        <span className="error-text">{basicErrors.firstName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>{t("email")}</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Please enter email"
                        value={basicForm.email}
                        onChange={handleBasicChange}
                      />
                      {basicErrors.email && (
                        <span className="error-text">{basicErrors.email}</span>
                      )}
                    </div>

                    <div className="form-group3">
                      <label>{t("position")}</label>
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
                      {basicErrors.position && (
                        <span className="error-text">{basicErrors.position}</span>
                      )}
=======
						{/* Basic Info */}
						{activeTab === "basic" && (
							<div>
								{/* <h3>Basic Info</h3> */}
								<div className="form-row">
									<div className="form-column">
										<div className="form-group0">
											<label>{t("firstName")}</label>
											<input
												type="text"
												name="firstName"
												value={basicForm.firstName}
												placeholder="Please enter name"
												className="form-groupp"
												// value={firstName}
												// onChange={(e) => setFirstName(e.target.value)}
												onChange={handleBasicChange}
											/>
											{basicErrors.firstName && (
												<span className="error-text">
													{basicErrors.firstName}
												</span>
											)}
										</div>

										<div className="form-group0">
											<label>{t("email")}</label>
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

										<div className="form-group3">
											<label>{t("position")}</label>
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
											{basicErrors.position && (
												<span className="error-text">
													{basicErrors.position}
												</span>
											)}
>>>>>>> origin/ajith-frontend

											{/* {submitted && basicErrors.position && (
                         <span className="error-text">{basicErrors.position}</span>
                        )} */}
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

<<<<<<< HEAD
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
                      <label>{t("lastName")}</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Please enter name"
                        value={basicForm.lastName}
                        onChange={handleBasicChange}
                      />
                      {basicErrors.lastName && (
                        <span className="error-text">{basicErrors.lastName}</span>
                      )}
                    </div>
=======
									<div className="form-column">
										<div className="form-group01">
											<label style={{ marginLeft: "17px" }}>
												{t("lastName")}
											</label>
											<input
												type="text"
												name="lastName"
												placeholder="Please enter name"
												className="form-groupp1"
												value={basicForm.lastName}
												onChange={handleBasicChange}
											/>
											{basicErrors.lastName && (
												<span className="error-text">
													{basicErrors.lastName}
												</span>
											)}
										</div>

										<div className="form-group01">
											<label style={{ marginLeft: "17px" }}>{t("phone")}</label>
											<input
												type="tel"
												name="phone"
												placeholder="Please enter phone number"
												className="form-groupp1"
												value={basicForm.phone}
												onChange={handleBasicChange}
											/>
											{basicErrors.phone && (
												<span className="error-text">{basicErrors.phone}</span>
											)}
										</div>
>>>>>>> origin/ajith-frontend

										<div className="form-group4">
											<label style={{ marginLeft: "17px" }}>{t("role")}</label>
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
									<button
										type="button"
										className="btn-cancel"
										onClick={handleBasicCancel}
									>
										Cancel
									</button>
									<button
										type="submit"
										className="btn-save"
										onClick={handleBasicSave}
									>
										Save
									</button>
								</div>
							</div>
						)}

<<<<<<< HEAD
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleBasicCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    onClick={handleBasicSave}

                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Team */}
            {activeTab === "team" && (
              <div >

                <div className="team-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox"
                            className="checkbbig"
                            checked={Object.values(selectedRows).every(Boolean)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;

                              setSelectedRows({
                                row1: isChecked,
                                row2: isChecked,
                                row3: isChecked
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
                            checked={selectedRows.row1}
                            onChange={(e) =>
                              setSelectedRows({ ...selectedRows, row1: e.target.checked })
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
                            <div className="member-email">lakshmi@gmail.com</div>
                          </div>
                        </td>
                        <td className="member-joined">May 24, 2025 - 09:00 AM</td>
                        <td>
                          <span className="role-badge hr">HR</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbsmall"
                            checked={selectedRows.row2}
                            onChange={(e) =>
                              setSelectedRows({ ...selectedRows, row2: e.target.checked })
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
                        <td className="member-joined">May 24, 2025 - 09:00 AM</td>
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
                            checked={selectedRows.row3}
                            onChange={(e) =>
                              setSelectedRows({ ...selectedRows, row3: e.target.checked })
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
                        <td className="member-joined">Apr 24, 2025 - 06:00 PM</td>
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
                {/* <div className="create-new-wrapper">
                  <button className="btn-create-new">Create new</button>
                </div> */}
                <div className="department-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            className="checkbbig"
                            checked={Object.values(selectedRows).every(Boolean)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setSelectedRows({
                                row1: isChecked,
                                row2: isChecked,
                                row3: isChecked
                              });
                            }}
                          />
                        </th>
                        <th>{t("department")}</th>
                        <th>{t("numberOfMembers")}</th>
                        <th>{t("departmentHead")}</th>
                        <th>{t("action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbsmall"
                            checked={selectedRows.row1}
                            onChange={(e) =>
                              setSelectedRows({ ...selectedRows, row1: e.target.checked })
                            }
                          />
                        </td>
                        <td>HR</td>
                        <td>1</td>
                        <td>Lakshmi</td>
                        <td>
                          <button className="action-btn edit">
                            <img className="pen-icon" src={penicon} alt="tick-icon" />
                          </button>
                          <button className="action-btn delete">
                            <img className="deletebox-icon" src={deletebox} alt="tick-icon" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbsmall"
                            checked={selectedRows.row2}
                            onChange={(e) =>
                              setSelectedRows({ ...selectedRows, row2: e.target.checked })
                            }
                          />
                        </td>
                        <td>Design</td>
                        <td>5</td>
                        <td>Sakshi</td>
                        <td>
                          <button className="action-btn edit">
                            <img className="pen-icon" src={penicon} alt="tick-icon" />
                          </button>
                          <button className="action-btn delete">
                            <img className="deletebox-icon" src={deletebox} alt="tick-icon" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbsmall"
                            checked={selectedRows.row3}
                            onChange={(e) =>
                              setSelectedRows({ ...selectedRows, row3: e.target.checked })
                            }
                          />
                        </td>
                        <td>Development</td>
                        <td>7</td>
                        <td>Asolin</td>
                        <td>
                          <button className="action-btn edit">
                            <img className="pen-icon" src={penicon} alt="tick-icon" />
                          </button>
                          <button className="action-btn delete">
                            <img className="deletebox-icon" src={deletebox} alt="tick-icon" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Break Times - FIXED: Changed from "breaks" to "breaktimes" */}
            {activeTab === "breaktimes" && (
              <div >
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
                          <img className="pen-icon" src={penicon} alt="tick-icon" />
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
                          <img className="pen-icon" src={penicon} alt="tick-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
=======
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

						{/* Department - FIXED: Changed from "department" to "departments" */}
						{activeTab === "departments" && (
							<div>
								{/* <div className="create-new-wrapper">
                  <button className="btn-create-new">Create new</button>
                </div> */}
								<div className="department-table">
									<table>
										<thead>
											<tr>
												<th>
													<input
														type="checkbox"
														className="checkbbig"
														checked={Object.values(
															selectedDepartmentRows,
														).every(Boolean)}
														onChange={(e) => {
															const isChecked = e.target.checked;
															setSelectedDepartmentRows({
																row1: isChecked,
																row2: isChecked,
																row3: isChecked,
															});
														}}
													/>
												</th>
												<th>{t("department")}</th>
												<th>{t("numberOfMembers")}</th>
												<th>{t("departmentHead")}</th>
												<th>{t("action")}</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													<input
														type="checkbox"
														className="checkbsmall"
														checked={selectedDepartmentRows.row1}
														onChange={(e) =>
															setSelectedDepartmentRows({
																...selectedDepartmentRows,
																row1: e.target.checked,
															})
														}
													/>
												</td>
												<td>HR</td>
												<td>1</td>
												<td>Lakshmi</td>
												<td>
													<button className="action-btn edit">
														<img
															className="pen-icon"
															src={penicon}
															alt="tick-icon"
														/>
													</button>
													<button className="action-btn delete">
														<img
															className="deletebox-icon"
															src={deletebox}
															alt="tick-icon"
														/>
													</button>
												</td>
											</tr>
											<tr>
												<td>
													<input
														type="checkbox"
														className="checkbsmall"
														checked={selectedDepartmentRows.row2}
														onChange={(e) =>
															setSelectedDepartmentRows({
																...selectedDepartmentRows,
																row2: e.target.checked,
															})
														}
													/>
												</td>
												<td>Design</td>
												<td>5</td>
												<td>Sakshi</td>
												<td>
													<button className="action-btn edit">
														<img
															className="pen-icon"
															src={penicon}
															alt="tick-icon"
														/>
													</button>
													<button className="action-btn delete">
														<img
															className="deletebox-icon"
															src={deletebox}
															alt="tick-icon"
														/>
													</button>
												</td>
											</tr>
											<tr>
												<td>
													<input
														type="checkbox"
														className="checkbsmall"
														checked={selectedDepartmentRows.row3}
														onChange={(e) =>
															setSelectedDepartmentRows({
																...selectedDepartmentRows,
																row3: e.target.checked,
															})
														}
													/>
												</td>
												<td>Development</td>
												<td>7</td>
												<td>Asolin</td>
												<td>
													<button className="action-btn edit">
														<img
															className="pen-icon"
															src={penicon}
															alt="tick-icon"
														/>
													</button>
													<button className="action-btn delete">
														<img
															className="deletebox-icon"
															src={deletebox}
															alt="tick-icon"
														/>
													</button>
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
													<img
														className="pen-icon"
														src={penicon}
														alt="tick-icon"
													/>
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
													<img
														className="pen-icon"
														src={penicon}
														alt="tick-icon"
													/>
												</button>
											</div>
										</div>
									</div>
>>>>>>> origin/ajith-frontend

									<button
										className="btn-create-new1"
										onClick={() => setShowBreakModal(true)}
									>
										Create new
									</button>

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
