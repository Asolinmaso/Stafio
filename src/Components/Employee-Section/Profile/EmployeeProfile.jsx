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
  name: 'Aiswarya Shyamkumar',
  gender: 'Female',
  dob: '1993-07-22',
  maritalStatus: 'Married',
  nationality: 'India',
  bloodGroup: 'A+',
  email: 'aiswarya@gmail.com',
  phone: '9895195971',
  address: 'Kattasseri House, Kalarikal, Alappuzha, Kerala',
  emergencyContactNumber: '9895195971',
  relationship: 'Husband',
  empType: 'Internship',
  department: 'Design',
  location: 'Kerala',
  supervisor: 'Sakshi Chadchankar',
  hrManager: 'S. Santhana Lakshmi',
  empId: '1234567',
  status: 'Active'
};

const initialEducation = {
  institution: 'CEMP Punnapra',
  location: 'Kerala',
  startDate: '2012-07-22',
  endDate: '2016-07-22',
  qualification: 'B.Tech',
  specialization: 'Computer Science',
  skills: ['Illustrator', 'Photoshop', 'Figma', 'Adobe XD'],
  portfolio: 'https://www.behance.net/gallery/229448069/Training-Provider-Web-UI-Design'
};

const initialExperience = {
  company: 'Azym Technology',
  jobTitle: 'UIUX Designer',
  startDate: '2017-07-22',
  endDate: '2022-07-22',
  responsibilities: 'Conduct user research, interviews, and usability testing to gather insights.',
  totalYears: 4
};

const initialBank = {
  bankName: 'SBI',
  branch: 'Alappuzha',
  accountNumber: '123456789101',
  ifsc: 'IFC12345',
  aadhaar: '123456789101',
  pan: 'IFC12345'
};

const initialDocs = [
  { fileName: 'Signed OfferLetter.pdf', status: 'Completed' },
  { fileName: 'DegreeCertificate.pdf', status: 'Completed' },
  { fileName: 'Pan Card.pdf', status: 'Completed' }
];

// ====================== COMPONENT ======================
const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState(initialProfile);
  const [education, setEducation] = useState(initialEducation);
  const [experience, setExperience] = useState(initialExperience);
  const [bank, setBank] = useState(initialBank);
  const [documents, setDocuments] = useState(initialDocs);

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
          `http://127.0.0.1:5000/employee_profile/${userId}`,
          {
            headers: {
              'X-User-Role': 'employee',
              'X-User-ID': '1'
            }
          }
        );
        
        // Update all states with fetched data
        setProfile(response.data.profile);
        setEducation(response.data.education);
        setExperience(response.data.experience);
        setBank(response.data.bank);
        setDocuments(response.data.documents);
        
        console.log("Employee profile data loaded successfully");
      } catch (error) {
        console.error("Error fetching employee profile data:", error);
      }
    };

    fetchEmployeeProfileData();
  }, []);

  // =========== HANDLERS ===========
  const handleProfileChange = e => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEducationChange = e => setEducation(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleExperienceChange = e => setExperience(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBankChange = e => setBank(prev => ({ ...prev, [e.target.name]: e.target.value }));

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

  const handleSavePersonal = () => { setIsEditingPersonal(false); alert('Profile updated successfully!'); };
  const handleSaveEducation = () => { setIsEditingEducation(false); alert('Educational details updated!'); };
  const handleSaveExperience = () => { setIsEditingExperience(false); alert('Experience updated!'); };
  const handleSaveBank = () => { setIsEditingBank(false); alert('Bank details updated!'); };
  const handleSaveDocs = () => { setIsEditingDocs(false); alert('Documents updated!'); };

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
                      <Button className="btn-cancel" onClick={() => setIsEditingPersonal(false)}>Cancel</Button>
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
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Date Of Birth</Form.Label>
                    <div className="input-icon-wrap">
                      <Form.Control
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleProfileChange}
                        className="form-input"
                        disabled={!isEditingPersonal}
                      />
                      <span className="input-calendar-icon">
                        <i className="bi bi-calendar3"/>
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Nationality</Form.Label>
                    <Form.Control
                      type="text"
                      name="nationality"
                      value={profile.nationality}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditingPersonal}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Blood Group</Form.Label>
                    <Form.Control
                      type="text"
                      name="bloodGroup"
                      value={profile.bloodGroup}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditingPersonal}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Emergency Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContactNumber"
                      value={profile.emergencyContactNumber}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditingPersonal}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditingPersonal}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="form-label">Relationship with Emergency Contact</Form.Label>
                    <Form.Control
                      type="text"
                      name="relationship"
                      value={profile.relationship}
                      onChange={handleProfileChange}
                      className="form-input"
                      disabled={!isEditingPersonal}
                    />
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
                    <Button className="btn-edit" onClick={() => setIsEditingEducation(true)}>Edit</Button>
                  ) : (
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Button className="btn-cancel" onClick={() => setIsEditingEducation(false)}>Cancel</Button>
                      <Button className="btn-save" onClick={handleSaveEducation}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-tab-section education">
                <Form>
                  <Row className="gy-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Name Of the Institution</Form.Label>
                        <Form.Control
                          type="text"
                          name="institution"
                          value={education.institution}
                          onChange={handleEducationChange}
                          placeholder="Institution Name"
                          disabled={!isEditingEducation}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Start Date</Form.Label>
                        <div className="calendar-input-wrap">
                          <Form.Control
                            type="date"
                            name="startDate"
                            value={education.startDate}
                            onChange={handleEducationChange}
                            disabled={!isEditingEducation}
                          />
                          <span className="calendar-icon">
                            <i className="bi bi-calendar3"></i>
                          </span>
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Qualification</Form.Label>
                        <Form.Control
                          type="text"
                          name="qualification"
                          value={education.qualification}
                          onChange={handleEducationChange}
                          placeholder="Qualification"
                          disabled={!isEditingEducation}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Skills</Form.Label>
                        <div className="skills-pill-wrap">
                          {education.skills.map((skill, i) => (
                            <span className="skill-pill" key={i}>{skill}</span>
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={education.location}
                          onChange={handleEducationChange}
                          placeholder="Location"
                          disabled={!isEditingEducation}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>End Date</Form.Label>
                        <div className="calendar-input-wrap">
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={education.endDate}
                            onChange={handleEducationChange}
                            disabled={!isEditingEducation}
                          />
                          <span className="calendar-icon">
                            <i className="bi bi-calendar3"></i>
                          </span>
                        </div>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Specialization</Form.Label>
                        <Form.Control
                          type="text"
                          name="specialization"
                          value={education.specialization}
                          onChange={handleEducationChange}
                          placeholder="Specialization"
                          disabled={!isEditingEducation}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Portfolio Link</Form.Label>
                        <Form.Control
                          type="text"
                          name="portfolio"
                          value={education.portfolio}
                          onChange={handleEducationChange}
                          placeholder="Portfolio Link"
                          disabled={!isEditingEducation}
                        />
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
                    <Button className="btn-edit" onClick={() => setIsEditingExperience(true)}>Edit</Button>
                  ) : (
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <Button className="btn-cancel" onClick={() => setIsEditingExperience(false)}>Cancel</Button>
                      <Button className="btn-save" onClick={handleSaveExperience}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-tab-section experience">
                <Form>
                  <Row className="gy-4">
                    <Col md={6}><Form.Label>Name Of the Company</Form.Label>
                      <Form.Control type="text" name="company" value={experience.company} onChange={handleExperienceChange} disabled={!isEditingExperience} /></Col>
                    <Col md={6}><Form.Label>Job Title / Designation</Form.Label>
                      <Form.Control type="text" name="jobTitle" value={experience.jobTitle} onChange={handleExperienceChange} disabled={!isEditingExperience} /></Col>
                    <Col md={6}><Form.Label>Start Date</Form.Label>
                      <Form.Control type="date" name="startDate" value={experience.startDate} onChange={handleExperienceChange} disabled={!isEditingExperience} /></Col>
                    <Col md={6}><Form.Label>End Date</Form.Label>
                      <Form.Control type="date" name="endDate" value={experience.endDate} onChange={handleExperienceChange} disabled={!isEditingExperience} /></Col>
                    <Col md={8}><Form.Label>Job Responsibilities</Form.Label>
                      <Form.Control as="textarea" rows={2} name="responsibilities" value={experience.responsibilities} onChange={handleExperienceChange} disabled={!isEditingExperience} />
                    </Col>
                    <Col md={4}><Form.Label>Total Years Of Experience</Form.Label>
                      <Form.Control type="number" name="totalYears" value={experience.totalYears} onChange={handleExperienceChange} disabled={!isEditingExperience} />
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
                      <Button className="btn-cancel" onClick={() => setIsEditingBank(false)}>Cancel</Button>
                      <Button className="btn-save" onClick={handleSaveBank}>Save</Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-tab-section bank-details">
                <Form>
                  <Row className="gy-4">
                    <Col md={6}><Form.Label>Bank Name</Form.Label>
                      <Form.Control type="text" name="bankName" value={bank.bankName} onChange={handleBankChange} disabled={!isEditingBank} /></Col>
                    <Col md={6}><Form.Label>Branch</Form.Label>
                      <Form.Control type="text" name="branch" value={bank.branch} onChange={handleBankChange} disabled={!isEditingBank} /></Col>
                    <Col md={6}><Form.Label>Account Number</Form.Label>
                      <Form.Control type="text" name="accountNumber" value={bank.accountNumber} onChange={handleBankChange} disabled={!isEditingBank} /></Col>
                    <Col md={6}><Form.Label>IFSC Code</Form.Label>
                      <Form.Control type="text" name="ifsc" value={bank.ifsc} onChange={handleBankChange} disabled={!isEditingBank} /></Col>
                    <Col md={6}><Form.Label>Aadhaar Number</Form.Label>
                      <Form.Control type="text" name="aadhaar" value={bank.aadhaar} onChange={handleBankChange} disabled={!isEditingBank} /></Col>
                    <Col md={6}><Form.Label>PAN Number</Form.Label>
                      <Form.Control type="text" name="pan" value={bank.pan} onChange={handleBankChange} disabled={!isEditingBank} /></Col>
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
