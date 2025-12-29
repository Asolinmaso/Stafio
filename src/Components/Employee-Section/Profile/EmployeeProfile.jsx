import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Nav, Tab } from 'react-bootstrap';
import EmployeeSidebar from '.././EmployeeSidebar';
import Topbar from '.././Topbar';
import ProfileBanner from './ProfileBanner';
import './EmployeeProfile.css';
import axios from 'axios';

// ====================== INITIAL STATE ======================
const initialProfile = {
  profileImage: '',
  name: '',
  gender: '',
  dob: '',
  maritalStatus: '',
  nationality: '',
  bloodGroup: '',
  email: '',
  phone: '',
  address: '',
  emergencyContactNumber: '',
  relationship: '',
  empType: '',
  department: '',
  location: '',
  supervisor: '',
  hrManager: '',
  empId: '',
  status: ''
};

const initialEducation = {
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  qualification: '',
  specialization: '',
  skills: [],
  portfolio: ''
};

const initialExperience = {
  company: '',
  jobTitle: '',
  startDate: '',
  endDate: '',
  responsibilities: '',
  totalYears: ''
};

const initialBank = {
  bankName: '',
  branch: '',
  accountNumber: '',
  ifsc: '',
  aadhaar: '',
  pan: ''
};

const initialDocs = [];

// ====================== COMPONENT ======================
const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState(initialProfile);
  const [education, setEducation] = useState(initialEducation);
  const [experience, setExperience] = useState(initialExperience);
  // const [bank, setBank] = useState(initialBank);
  const [documents, setDocuments] = useState(initialDocs);
  
  //new
  const [personalErrors, setPersonalErrors] = useState({});
  const [educationErrors, setEducationErrors] = useState({});
  const [experienceBackup, setExperienceBackup] = useState(null);
  const [educationBackup, setEducationBackup] = useState(null);
  const [experienceErrors, setExperienceErrors] = useState({});
  const [bank, setBank] = useState({
  bankName: "",
  branch: "",
  accountNumber: "",
  ifsc: "",
  aadhaar: "",
  pan: ""
});

const [savedBank, setSavedBank] = useState({
  bankName: "",
  branch: "",
  accountNumber: "",
  ifsc: "",
  aadhaar: "",
  pan: ""
});
const [errors, setErrors] = useState({});

const [savedEducation, setSavedEducation] = useState({
  bankName: "",
  branch: "",
  accountNumber: "",
  ifsc: "",
  aadhaar: "",
  pan: ""
});


  // Per-tab edit states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingDocs, setIsEditingDocs] = useState(false);


  // =========== FETCH DATA FROM BACKEND ===========
  useEffect(() => {
    const fetchEmployeeProfileData = async () => {
      try {
        const userId = 1; // Replace with actual logged-in employee ID
        const response = await axios.get(
          `http://127.0.0.1:5001/employee_profile/${userId}`,
          {
            headers: {
              'X-User-Role': 'employee',
              'X-User-ID': '1'
            }
          }
        );
        
        // Only update with data from backend, use empty defaults if not provided
        if (response.data) {
          setProfile(response.data.profile || initialProfile);
          setEducation(response.data.education || initialEducation);
          setExperience(response.data.experience || initialExperience);
          setBank(response.data.bank || initialBank);
          setDocuments(response.data.documents || initialDocs);
        }
        
        console.log("Employee profile data loaded successfully");
      } catch (error) {
        console.error("Error fetching employee profile data:", error);
        // Keep empty initial state on error
      }
    };

    fetchEmployeeProfileData();
  }, []);

  // =========== HANDLERS ===========
  const handleProfileChange = (e) => {            //new
  const { name, value } = e.target;

             setProfile(prev => ({...prev,[name]: value}));

             // Clear error for that field
             setPersonalErrors(prev => ({...prev,[name]: ""}));
             };

  const handleEducationChange = (e) => {             //new
  const { name, value } = e.target;

             setEducation(prev => ({...prev,[name]: value}));

             setEducationErrors(prev => ({...prev,[name]: "",form: ""}));
             };

  const handleExperienceChange = (e) => {           //new
  const { name, value } = e.target;

                setExperience(prev => {
            const updated = { ...prev, [name]: value };

              // Auto-calc years when dates change
          if (name === "startDate" || name === "endDate") {
              const calculatedYears = calculateExperienceYears(
              updated.startDate,
             updated.endDate
             );

          if (calculatedYears !== "") {
               updated.totalYears = calculatedYears;
             }
             }

          return updated;
          });

            setExperienceErrors(prev => ({...prev,[name]: ""}));
           };

           //handle bank change
  const handleBankChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  // Allow only digits for numeric fields
  if (["accountNumber", "aadhaar"].includes(name)) {
    newValue = value.replace(/\D/g, "");
  }

  // PAN & IFSC should be uppercase
  if (["pan", "ifsc"].includes(name)) {
    newValue = value.toUpperCase();
  }

  setBank((prev) => ({...prev,[name]: newValue}));

  // Validation check
  if (validations[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: validations[name].test(newValue)
        ? ""
        : `Invalid ${name.replace(/([A-Z])/g, " $1")}`
    }));
  }
};


  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setProfile(prev => ({ ...prev, profileImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSkillChange = (e, idx) => {
    const newSkills = [...education.skills];
    newSkills[idx] = e.target.value;
    setEducation(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => setEducation(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  const removeSkill = idx =>
    setEducation(prev => ({
      ...prev,
      skills: prev.skills.filter((_, sidx) => sidx !== idx)
    }));

  const handleDocDelete = idx =>
    setDocuments(prev => prev.filter((_, didx) => didx !== idx));




            //save button for personal info
  const handleSavePersonal = () => { const isValid = validatePersonalInfo();

           if (!isValid) {
           console.log("Validation failed", personalErrors);
           return;
           }

           setIsEditingPersonal(false);
           setPersonalErrors({});
           alert("Profile updated successfully!");
           };

              //save button for education tab 
              
               const handleEditEducation = () => {
                  setEducationBackup(education);
                 setIsEditingEducation(true);
                 };

  const handleSaveEducation = () => {
             
            if (!validateEducation()) return;
            setIsEditingEducation(false);
            setEducationErrors({});
            // setSavedEducation(education);
            setEducationBackup(null)
            alert("Education Qualification updated successfully.");
            };
  
const handleCancelEducation = () => {
  setEducation(educationBackup);
  setEducationErrors({});
  setIsEditingEducation(false);
};



               //handleEditExperience for buttons
  const handleEditExperience = () => {
  setExperienceBackup(experience);
  setIsEditingExperience(true);
};
  
  //handleCancelExperience
const handleCancelExperience = () => {
  setExperience(experienceBackup);
  setExperienceErrors({});
  setIsEditingExperience(false);
};

    //handleSaveExperience
  const handleSaveExperience = () => {
           if (!validateExperience()) return;
           setIsEditingExperience(false);
           setExperienceErrors({});
           setExperienceBackup(null);
           alert("Experience updated!");
           };


     // handleSaveBank Save button logic

  const handleSaveBank = () => {
  const isValid = validateBankForm();
  if (!isValid) return;

  setSavedBank(bank);
  setIsEditingBank(false);
  alert("Bank details updated!");
};

const handleCancelBank = () => {
  setBank({
    bankName: "",
    branch: "",
    accountNumber: "",
    ifsc: "",
    aadhaar: "",
    pan: ""
  });

  setErrors({});
  setIsEditingBank(false);
};


  const handleSaveDocs = () => { setIsEditingDocs(false); alert('Documents updated!'); };
 
// const handleCancelBank = () => {
//   setBank(savedBank);      // restore last saved data
//   setErrors({});           // clear validation errors
//   setIsEditingBank(false);
// };



 // validation personal information
  const validatePersonalInfo = () => {
  const errors = {};

  // Gender
  if (!profile.gender) {
    errors.gender = "*Kindly select the gender.";
  }

  // Marital Status
  if (!profile.maritalStatus) {
    errors.maritalStatus = "*Kindly update your marital status.";
  }

  // DOB
  if (!profile.dob) {
    errors.dob = "*This field is required";
  }

  // Nationality
  if (!profile.nationality) {
    errors.nationality = "*This field is required";
  }

  // Blood Group
  if (!profile.bloodGroup) {
    errors.bloodGroup = "*This field is required";
  }

  // Emergency Contact Number
  if (!profile.emergencyContactNumber) {
    errors.emergencyContactNumber = "*This field is required";
  } else if (!/^[0-9]\d{9}$/.test(profile.emergencyContactNumber)) {
    errors.emergencyContactNumber =
      "*Please enter a valid phone number.";
  }

  // Address
  if (!profile.address) {
    errors.address = "*This field is required";
  }

  // Relationship
  if (!profile.relationship) {
    errors.relationship = "*This field is required";
  }

  setPersonalErrors(errors);
  return Object.keys(errors).length === 0;

};

// validation for education tab                 new

  const validateEducation = () => {
  const errors = {};

  //mandatory feilds
  if (!education.institution ||
      !education.startDate ||
      !education.endDate ||
      !education.qualification ||
      !education.specialization ||
      !education.portfolio) {
    errors.form = "Please fill all required fields.";
  }

  // institution
  if (!education.institution) {
    errors.institution = "*This field is required";
  }

   // location
  if (!education.location) {
    errors.location = "*This field is required";
  }

  // Date validation

  // Required: Start Date
  if (!education.startDate) {
    errors.startDate = "Start Date is required.";
  }

  // Required: End Date
  if (!education.endDate) {
    errors.endDate = "End Date is required.";
  }

  if (education.startDate && education.endDate) {
    const start = new Date(education.startDate);
    const end = new Date(education.endDate);

    if (start > end) {
      errors.endDate = "End Date must be after Start Date.";
    }
  }

  // qualification
  if (!education.qualification) {
    errors.qualification = "*This field is required";
  }

  // specialization
  if (!education.specialization) {
    errors.specialization = "*This field is required";
  }

   // portfolio
  if (!education.portfolio) {
    errors.portfolio = "*This field is required";
  } else {
    const urlRegex =
      /^(https?:\/\/)?(www\.)?(behance\.net|dribbble\.com|github\.com|linkedin\.com)\/.+$/i;

    if (!urlRegex.test(education.portfolio)) {
      errors.portfolio =
        "*Please enter a valid portfolio URL (Behance, Dribbble, GitHub, or LinkedIn)";
    }
  }

  setEducationErrors(errors);
  return Object.keys(errors).length === 0;
};

// validation for previous experience tab                 new

  const calculateExperienceYears = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return "";

  const diffTime = end - start;
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);

  return Number(diffYears.toFixed(1)); // 1 decimal (e.g., 2.5)
};

//validate Experience tab

const validateExperience = () => {
  const errors = {};

  // Date validation
  if (experience.startDate && experience.endDate) {
    const start = new Date(experience.startDate);
    const end = new Date(experience.endDate);

    if (start > end) {
      errors.endDate = "End Date must be after Start Date.";
    } else {
      // Experience mismatch validation
      const calculated = calculateExperienceYears(
        experience.startDate,
        experience.endDate
      );

      if (
        experience.totalYears &&
        Number(experience.totalYears) !== calculated
      ) {
        errors.totalYears =
          "Mismatch between entered years of experience and provided dates.";
      }
    }
  }

  // company
  if (!experience.company) {
    errors.company = "*This field is required";
  }

    // jobtitle
  if (!experience.jobTitle) {
    errors.jobTitle = "*This field is required";
  }

    // job responsibilities
  if (!experience.responsibilities) {
    errors.responsibilities = "*This field is required";
  }

      // total experience
  if (!experience.totalYears) {
    errors.totalYears = "*This field is required";
  }

    // Date validation

  // Required: Start Date
  if (!experience.startDate) {
    errors.startDate = "Start Date is required.";
  }

  // Required: End Date
  if (!experience.endDate) {
    errors.endDate = "End Date is required.";
  }

  if (experience.startDate && experience.endDate) {
    const start = new Date(experience.startDate);
    const end = new Date(experience.endDate);

    if (start > end) {
      errors.endDate = "End Date must be after Start Date.";
    }
  }

  setExperienceErrors(errors);
  return Object.keys(errors).length === 0;
};


//validation for bank details 

const validations = {
  bankName: /^[a-zA-Z\s]{3,}$/,                  // Text only
  branch: /^[a-zA-Z0-9\s]{3,}$/,                 // Text + numbers
  accountNumber: /^\d{9,18}$/,                   // 9–18 digits
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,                // IFSC format
  aadhaar: /^\d{12}$/,                           // 12 digits
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/            // PAN format


};

  const validateBankForm = () => {
  const newErrors = {};

  // Required checks
  if (!bank.bankName.trim()) {
    newErrors.bankName = "*This field is required";
  } else if (!validations.bankName.test(bank.bankName)) {
    newErrors.bankName = "Enter a valid bank name";
  }

  if (!bank.branch.trim()) {
    newErrors.branch = "*This field is required";
  } else if (!validations.branch.test(bank.branch)) {
    newErrors.branch = "Enter a valid branch name";
  }

  if (!bank.accountNumber) {
    newErrors.accountNumber = "*This field is required";
  } else if (!validations.accountNumber.test(bank.accountNumber)) {
    newErrors.accountNumber = "Account Number must be 9–18 digits";
  }

  if (!bank.ifsc) {
    newErrors.ifsc = "*This field is required";
  } else if (!validations.ifsc.test(bank.ifsc)) {
    newErrors.ifsc = "IFSC format: SBIN0001234";
  }

  if (!bank.aadhaar) {
    newErrors.aadhaar = "*This field is required";
  } else if (!validations.aadhaar.test(bank.aadhaar)) {
    newErrors.aadhaar = "Aadhaar must be 12 digits";
  }

  if (!bank.pan) {
    newErrors.pan = "*This field is required";
  } else if (!validations.pan.test(bank.pan)) {
    newErrors.pan = "PAN format: ABCDE1234F";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // =========== RENDER ===========
  return (
    <div className="d-flex">
      <div className="sidebar">
        <EmployeeSidebar />
      </div>
      <div className="main-content py-4">
        <Topbar />
        <ProfileBanner />

        {/* ------ Outer Card REMOVED! Tabs sit on main-content directly ---- */}
        <Tab.Container
          activeKey={activeTab}
          onSelect={k => setActiveTab(k)}
          defaultActiveKey="personal"
         >
          <Nav variant="tabs" className="profile-tabs">
            <Nav.Item><Nav.Link eventKey="personal">Personal Information</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="education">Education Qualification</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="experience">Previous Experience (if any)</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="bank">Bank Details</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="documents">Documents</Nav.Link></Nav.Item>
          </Nav>
          <Tab.Content>

            {/* PERSONAL INFORMATION */}
            <Tab.Pane eventKey="personal">
              <div className="update-info-header-box">
                <div className="tab-section-title personal-info d-flex align-items-center justify-content-between">
                  <span>Update Personal Information</span>
                  {!isEditingPersonal ? (
                    <Button className="btn-edit" onClick={() => setIsEditingPersonal(true)}>Edit</Button>
                  ) : (
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Button className="btn-cancel"
                              onClick={() => {
                              setIsEditingPersonal(false);
                              setPersonalErrors({});
                              }}>Cancel</Button>
                      <Button className="btn-save" onClick={handleSavePersonal}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <Form className="personal-info-form">
                <Row className="gy-4">
                  <Col md={6}>
                    <Form.Label className="form-label">Gender</Form.Label>
                    <div className="option-box">
                      <div className="d-flex gap-4 align-items-center">
                        {["Male", "Female"].map((g) => (
                          <Form.Check
                            key={g}
                            type="radio"
                            disabled={!isEditingPersonal}
                            label={g}
                            name="gender"
                            value={g}
                            checked={profile.gender === g}
                            onChange={handleProfileChange}
                            className="form-radio"
                          />
                        ))}
                      </div>
                    </div>
                              {/* new */}
                       {personalErrors.gender && (
                            <div className="error-text mt-1">{personalErrors.gender}</div>
                         )}
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Marital Status</Form.Label>
                    <div className="option-box">
                      <div className="d-flex gap-4 align-items-center">
                        {["Single", "Married"].map((m) => (
                          <Form.Check
                            key={m}
                            type="radio"
                            disabled={!isEditingPersonal}
                            label={m}
                            name="maritalStatus"
                            value={m}
                            checked={profile.maritalStatus === m}
                            onChange={handleProfileChange}
                            className="form-radio"
                          />
                        ))}
                      </div>
                    </div>
                    {/* new */}
                        {personalErrors.maritalStatus && (
                            <div className="error-text mt-1">{personalErrors.maritalStatus}</div>
                        )}
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Date Of Birth</Form.Label>
                    <div className="input-icon-wrap">
                      <Form.Control
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleProfileChange}
                        className={`form-input ${
                         personalErrors.dob ? "input-error" : ""
                          }`} 
                        disabled={!isEditingPersonal}
                      />                   
                      <span className="input-calendar-icon">
                        <i className="bi bi-calendar3"/>
                      </span>
                    </div>
                    {/* new */}
                    {personalErrors.dob && (
                        <div className="error-text">{personalErrors.dob}</div>
                      )}
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Nationality</Form.Label>
                    <Form.Select
                      
                      name="nationality"
                      value={profile.nationality}
                      onChange={handleProfileChange}
                      className={`form-select ${
                        personalErrors.nationality ? "input-error" : ""
                       }`}
                      disabled={!isEditingPersonal}
                    >
                      <option value="" disabled>Select Your Nationality</option>
                        <option value="India">India</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Germany">Germany</option>
                           
                    </Form.Select>
                    {/* new */}
                        {personalErrors.nationality && (
                         <div className="error-text">{personalErrors.nationality}</div>
                        )}
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Blood Group</Form.Label>
                    <Form.Select
                      
                      name="bloodGroup"
                      value={profile.bloodGroup}
                      onChange={handleProfileChange}
                      className={`form-input ${
                        personalErrors.bloodGroup ? "input-error" : ""
                      }`}
                      disabled={!isEditingPersonal}
                    >
                        <option value="" disabled>Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        
                    </Form.Select>
                    {/* new */}
                        {personalErrors.bloodGroup && (
                           <div className="error-text">{personalErrors.bloodGroup}</div>
                         )}
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Emergency Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContactNumber"
                      value={profile.emergencyContactNumber}
                      onChange={handleProfileChange}
                      placeholder="Contact Number"
                      className={`form-input ${
                        personalErrors.emergencyContactNumber ? "input-error" : ""
                      }`}
                      disabled={!isEditingPersonal}
                    />
                    {personalErrors.emergencyContactNumber && (
                      <div className="error-text">
                       {personalErrors.emergencyContactNumber}
                      </div>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      placeholder="Home Address"
                      className={`form-input ${personalErrors.address ? "input-error" : ""}`}
                      disabled={!isEditingPersonal}
                    />
                    {personalErrors.address && (
                       <div className="error-text">{personalErrors.address}</div>
                     )}

                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Relationship with Emergency Contact</Form.Label>
                    <Form.Select
                      // type="text"
                      name="relationship"
                      value={profile.relationship}
                      onChange={handleProfileChange}
                      placeholder="Emergency Contact Person"
                      className={`form-input ${personalErrors.relationship ? "input-error" : ""}`}
                      disabled={!isEditingPersonal}
                    >
                      <option value="" disabled>Select Relation contact</option>
                        <option value="Husband">Husband</option>
                        <option value="Wife">Wife</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                    </Form.Select>
                        {/* new */}
                        {personalErrors.relationship && (
                           <div className="error-text">{personalErrors.relationship}</div>
                         )}

                  </Col>
                </Row>
              </Form>
            </Tab.Pane>

            {/* EDUCATION TAB */}
            <Tab.Pane eventKey="education">
              <div className="update-info-header-box">
                <div className="tab-section-title personal-info d-flex align-items-center justify-content-between">
                  <span>Update Educational Qualification</span>
                  {!isEditingEducation ? (
                    <Button className="btn-edit" onClick={handleEditEducation}>Edit</Button>
                  ) : (
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Button className="btn-cancel" onClick={handleCancelEducation}>Cancel</Button>
                      <Button className="btn-save" onClick={handleSaveEducation}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-tab-section education">
                <Form>
                  <Row className="gy-4">
                    <Col md={6}>
                        {educationErrors.form && (
                             <div className="error-text mb-3">
                               {educationErrors.form}
                             </div>
                               )}

                      <Form.Group>
                        <Form.Label className="form-label">Name Of the Institution</Form.Label>
                        <Form.Control
                          type="text"
                          name="institution"
                          value={education.institution}
                          onChange={handleEducationChange}
                          placeholder="Institution Name"
                          className={`edform-input ${educationErrors.institution ? "input-error" : ""}`}
                          disabled={!isEditingEducation}
                        />
                           {/* new */}
                         {educationErrors.institution && (
                             <div className="error-text">{educationErrors.institution}</div>
                        )}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="form-label">Start Date</Form.Label>
                        <div className="calendar-input-wrap">
                          <Form.Control
                            type="date"
                            name="startDate"
                            value={education.startDate}
                            onChange={handleEducationChange}
                            className={`edform-input ${educationErrors.startDate ? "input-error" : ""}`}
                            disabled={!isEditingEducation}
                          />
                          {/* new */}
                          {educationErrors.startDate && (
                            <div className="error-text">{educationErrors.startDate}</div>
                          )}
                          <span className="calendar-icon">
                            <i className="bi bi-calendar3"></i>
                          </span>
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="form-label">Qualification</Form.Label>
                        <Form.Select
                          
                          name="qualification"
                          value={education.qualification}
                          onChange={handleEducationChange}
                          placeholder="Qualification"
                          className={`edform-input ${educationErrors.qualification ? "input-error" : ""}`}
                          disabled={!isEditingEducation}
                        >
                          <option value="" disabled>Education Qualification</option>
                          <option value="BE">BE</option>
                          <option value="BSC">B.SC(computer science)</option>
                          <option value="BCOM">B.COM(computer science)</option>
                        </Form.Select>
                         {/* new */}
                        {educationErrors.qualification && (
                             <div className="error-text">{educationErrors.qualification}</div>
                        )}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="form-label">Skills</Form.Label>
                        <div className="skills-pill-wrap">
                          {education.skills.map((skill, i) => (
                            <span className="skill-pill" key={i}>{skill}</span>
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label">Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={education.location}
                          onChange={handleEducationChange}
                          placeholder="Location"
                          className={`edform-input ${educationErrors.location ? "input-error" : ""}`}
                          disabled={!isEditingEducation}
                        />
                        {/* new */}
                         {educationErrors.location && (
                             <div className="error-text">{educationErrors.location}</div>
                        )}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label className="form-label">End Date</Form.Label>
                        <div className="calendar-input-wrap">
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={education.endDate}
                            onChange={handleEducationChange}
                            className={`edform-input ${educationErrors.endDate ? "input-error" : ""}`}
                            disabled={!isEditingEducation}
                          />
                          {educationErrors.endDate && (
                            <div className="error-text">{educationErrors.endDate}</div>
                           )}
                          <span className="calendar-icon">
                            <i className="bi bi-calendar3"></i>
                          </span>
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="form-label">Specialization</Form.Label>
                        <Form.Select
                          
                          name="specialization"
                          value={education.specialization}
                          onChange={handleEducationChange}
                          placeholder="Specialization"
                          className={`edform-input ${educationErrors.specialization ? "input-error" : ""}`}
                          disabled={!isEditingEducation}
                        >
                          <option value="" disabled>Specialization</option>
                           <option value="Cloud-computing">Cloud computing</option>
                           <option value="Data-Science">Data Science</option>
                           <option value="Cyber-Security">Cyber Security</option>
                        </Form.Select>
                         {/* new */}
                        {educationErrors.specialization && (
                             <div className="error-text">{educationErrors.specialization}</div>
                        )}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="form-label">Portfolio Link</Form.Label>
                        <Form.Control
                          type="text"
                          name="portfolio"
                          value={education.portfolio}
                          onChange={handleEducationChange}
                          placeholder="Portfolio Link"
                          className={`edform-input ${educationErrors.portfolio ? "input-error" : ""}`}
                          disabled={!isEditingEducation}
                        />
                        {educationErrors.portfolio && (
                             <div className="error-text">{educationErrors.portfolio}</div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Tab.Pane>

            {/* EXPERIENCE TAB */}
            <Tab.Pane eventKey="experience">
              <div className="update-info-header-box">
                <div className="tab-section-title personal-info d-flex align-items-center justify-content-between">
                  <span>Update Previous Experience (if any)</span>
                  {!isEditingExperience ? (
                    <Button className="btn-edit" onClick={handleEditExperience}>Edit</Button>
                  ) : (
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Button className="btn-cancel" onClick={handleCancelExperience}>Cancel</Button>
                      <Button className="btn-save" onClick={handleSaveExperience}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-tab-section experience">
                <Form>
                  <Row className="gy-4">
                    <Col md={6}><Form.Label>Name Of the Company</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="company" 
                        value={experience.company} 
                        onChange={handleExperienceChange}
                        placeholder="Company Name"
                        className={`pexform-input ${experienceErrors.company ? "input-error" : ""}`}
                        disabled={!isEditingExperience} 
                      />
                      {experienceErrors.company && (
                           <div className="error-text">{experienceErrors.company}</div>
                          )}
                      <Form.Label className="form-label">Start Date</Form.Label>
                        <div className="calendar-input-wrap">
                        <Form.Control 
                          type="date" 
                          name="startDate" 
                          value={experience.startDate} 
                          onChange={handleExperienceChange}
                          className={`pexform-input ${experienceErrors.startDate ? "input-error" : ""}`} 
                          disabled={!isEditingExperience} 
                          />
                          {experienceErrors.startDate && (
                           <div className="error-text">{experienceErrors.startDate}</div>
                          )}
                        <span className="calendar-icon">
                         <i className="bi bi-calendar3"></i>
                        </span>
                      </div>
                      <Form.Label>Job Responsibilities</Form.Label>
                      <Form.Control as="textarea" 
                       name="responsibilities" 
                       value={experience.responsibilities} 
                       onChange={handleExperienceChange}
                       placeholder="Describe your job responsibilities"
                       className={`pexform-input2 ${experienceErrors.responsibilities ? "input-error" : ""}`} 
                       disabled={!isEditingExperience} 
                     />
                     {experienceErrors.responsibilities && (
                           <div className="error-text">{experienceErrors.responsibilities}</div>
                          )}
                    </Col> 
                    <Col md={6}> 
                      <Form.Label>Job Title / Designation</Form.Label>
                      <Form.Control 
                       type="text" 
                       name="jobTitle" 
                       value={experience.jobTitle} 
                       onChange={handleExperienceChange}
                       placeholder="Job Title"
                       className={`pexform-input1 ${experienceErrors.jobTitle ? "input-error" : ""}`} 
                       disabled={!isEditingExperience} 
                      />
                      {experienceErrors.jobTitle && (
                           <div className="error-text">{experienceErrors.jobTitle}</div>
                          )}
                      <Form.Label className="form-label">End Date</Form.Label>
                      <div className="calendar-input-wrap">
                      <Form.Control 
                        type="date"
                         name="endDate" 
                         value={experience.endDate} 
                         onChange={handleExperienceChange}
                         className={`pexform-input ${experienceErrors.endDate ? "input-error" : ""}`} 
                         disabled={!isEditingExperience} 
                         />
                         {experienceErrors.endDate && (
                             <div className="error-text">{experienceErrors.endDate}</div>
                           )}
                        <span className="calendar-icon">
                         <i className="bi bi-calendar3"></i>
                        </span> </div>
                      <Form.Label>Total Years Of Experience</Form.Label>
                      <Form.Control 
                       type="number"
                       step="0.1" 
                       name="totalYears" 
                       value={experience.totalYears} 
                       onChange={handleExperienceChange}
                       placeholder="Experience in Years"
                       className={`pexform-input ${experienceErrors.totalYears ? "input-error" : ""}`}
                       disabled={!isEditingExperience} 
                     />
                     {experienceErrors.totalYears && (
                           <div className="error-text">{experienceErrors.totalYears}</div>
                          )}
                    </Col>
                  </Row>
                </Form>
              </div>
            </Tab.Pane>

            {/* BANK DETAILS TAB */}
            <Tab.Pane eventKey="bank">
              <div className="update-info-header-box">
                <div className="tab-section-title personal-info d-flex align-items-center justify-content-between">
                  <span>Update Bank Details</span>
                  {!isEditingBank ? (
                    <Button className="btn-edit" onClick={() => setIsEditingBank(true)}>Edit</Button>
                  ) : (
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Button className="btn-cancel" onClick={handleCancelBank} >Cancel</Button>
                      <Button className="btn-save" onClick={handleSaveBank}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-tab-section bank-details">
                <Form>
                  <Row className="gy-4">
                    <Col md={6}><Form.Label>Bank Name</Form.Label>
                      <Form.Control 
                       type="text" 
                       name="bankName" 
                       value={bank.bankName} 
                       onChange={handleBankChange}
                       placeholder="Name of the Bank" 
                       disabled={!isEditingBank} 
                       className={`form-input ${errors.bankName ? "input-error" : ""}`}
                       />
                       {errors.bankName && (
                           <div className="error-text">{errors.bankName}</div>
                         )}
                      </Col>
                    <Col md={6}>
                    <Form.Label>Branch</Form.Label>
                      <Form.Control 
                       type="text" 
                       name="branch" 
                       value={bank.branch} 
                       onChange={handleBankChange}
                       placeholder="Name of the Branch" 
                       disabled={!isEditingBank} 
                       className={`form-input ${errors.branch ? "input-error" : ""}`}
                      />
                      {errors.branch && (
                          <div className="error-text">{errors.branch}</div>
                       )}
                    </Col>
                    <Col md={6}><Form.Label>Account Number</Form.Label>
                      <Form.Control 
                       type="text" 
                       name="accountNumber" 
                       value={bank.accountNumber} 
                       onChange={handleBankChange}
                        placeholder="Bank AC Number" 
                       disabled={!isEditingBank} 
                       className={`form-input ${errors.accountNumber ? "input-error" : ""}`}
                      />
                      {errors.accountNumber && (
                            <div className="error-text">{errors.accountNumber}</div>
                        )}
                    </Col>
                    <Col md={6}><Form.Label>IFSC Code</Form.Label>
                      <Form.Control 
                       type="text" 
                       name="ifsc" 
                       value={bank.ifsc} 
                       onChange={handleBankChange}
                       placeholder="IFSC Code" 
                       disabled={!isEditingBank}
                       className={`form-input ${errors.ifsc ? "input-error" : ""}`}
                      />
                      {errors.ifsc && (
                            <div className="error-text">{errors.ifsc}</div>
                        )}
                    </Col>
                    <Col md={6}><Form.Label>Aadhaar Number</Form.Label>
                      <Form.Control 
                       type="text" 
                       name="aadhaar" 
                       value={bank.aadhaar} 
                       onChange={handleBankChange} 
                       placeholder="XXXX-XXXX-XXXX"
                       disabled={!isEditingBank} 
                       className={`form-input ${errors.aadhaar ? "input-error" : ""}`}
                     />
                     {errors.aadhaar && (
                            <div className="error-text">{errors.aadhaar}</div>
                        )}
                     </Col>
                    <Col md={6}><Form.Label>PAN Number</Form.Label>
                      <Form.Control 
                       type="text" 
                       name="pan" 
                       value={bank.pan} 
                       onChange={handleBankChange} 
                       placeholder="ABCDE1234F"
                       disabled={!isEditingBank} 
                       className={`form-input ${errors.pan ? "input-error" : ""}`}
                     />
                     {errors.pan && (
                            <div className="error-text">{errors.pan}</div>
                        )}
                    </Col>
                  </Row>
                </Form>
              </div>
            </Tab.Pane>

            {/* DOCUMENTS TAB */}
            <Tab.Pane eventKey="documents">
              <div className="update-info-header-box">
                <div className="tab-section-title personal-info d-flex align-items-center justify-content-between">
                  <span>Update Documents</span>
                  {!isEditingDocs ? (
                    <Button className="btn-edit" onClick={() => setIsEditingDocs(true)}>Edit</Button>
                  ) : (
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Button className="btn-cancel" onClick={() => setIsEditingDocs(false)}>Cancel</Button>
                      <Button className="btn-save" onClick={handleSaveDocs}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-tab-section documents">
                <Row>
                  <Col md={8}>
                    {documents.map((doc, idx) => (
                      <div className="doc-item mb-2 d-flex flex-row align-items-center p-2" key={idx}>
                        <span className="pdf-icon me-2">PDF</span>
                        <span className="me-3">{doc.fileName}</span>
                        <span className="status-completed me-3">{doc.status}</span>
                        <span className="doc-size me-3">94 KB</span>
                        <span className="doc-done me-3 text-success">✓</span>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDocDelete(idx)}
                          disabled={!isEditingDocs}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    ))}
                  </Col>
                  <Col md={4}>
                    <div className="upload-box">
                      <div className="upload-cloud-icon mb-2">⇪</div>
                      <div>Choose a file or drag & drop it here</div>
                      <div className="upload-hint">JPEG, PNG, PDG, and MP4 formats, up to 50MB</div>
                      <Button className="mt-3" variant="outline-primary" as="label" disabled={!isEditingDocs}>
                        Browse File
                        <Form.Control type="file" hidden />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Tab.Pane>

          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default EmployeeProfile;
