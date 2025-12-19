import React, { useContext, useState } from "react";
import "./Settings.css";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import { SettingsContext } from "./SettingsContext";
import { Border } from "react-bootstrap-icons";
import { BiFontSize } from "react-icons/bi";

export default function Settings() {
  const { theme, setTheme, language, setLanguage, font, setFont } =
    useContext(SettingsContext);
  const [activeTab, setActiveTab] = useState("general");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Simple language translation object
  const translations = {
    english: {
      title: "System Settings",
      subtitle: "Setup and edit system settings and preferences",
      general: "General Settings",
      general1: "General",           // new
      basic: "Basic Info",
      systemLanguage: "System Language",
      dashboardTheme: "Dashboard Theme",
      systemFont: "System Font",
      dateFormat: "Date and Time Format",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      position: "Position",
      role: "Role",
      profilepicture:"Profile Picture",  // new
      subp3:"We support only JPEGs or PNGs under 5MB",  // new
    },
    tamil: {
      title: "கணினி அமைப்புகள்",
      subtitle: "அமைப்புகளை திருத்தவும், அமைக்கவும்",
      general: "பொது அமைப்புகள்",
      basic: "அடிப்படை தகவல்",
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
    },
    hindi: {
      title: "सिस्टम सेटिंग्स",
      subtitle: "सिस्टम सेटिंग्स और प्राथमिकताएँ संपादित करें",
      general: "सामान्य सेटिंग्स",
      basic: "मूल जानकारी",
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
    },
  };

  const t = translations[language];

  return (
    <div className="dashboard-wrapper d-flex">
      <div className="sidebar">
        <EmployeeSidebar />
      </div>

      <div className="main-content flex-grow-1">
        <Topbar />

        <div className="settings-page p-4">
          {/* Header */}
          <div className="settings-header">
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="settings-tabs">
            <button
              className={`tab-link ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              {t.general}
            </button>

            <button
              className={`tab-link ${activeTab === "basic" ? "active" : ""}`}
              onClick={() => setActiveTab("basic")}
            >
              {t.basic}
            </button>
          </div>

          {/* Tab Content */}
          <div className="settings-card">
            {/* General Settings */}
            {activeTab === "general" && (
              <div>
                <h3>{t.general1}</h3>

                <div className="form-group">
                  <label>{t.systemLanguage}</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="tamil">Tamil</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t.dashboardTheme}</label>
                   <div className="theme-input-box">     {/*new check box inside the input*/}
                    <span className="theme-text">
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
                  {/* <span className="theme-label">
                    {theme === "light" ? "Light Theme" : "Dark Theme"}
                  </span> */}
                </div>

                <div className="form-group">
                  <label>{t.systemFont}</label>
                  <select
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                  >
                    <option value="default">Default - Montserrat</option>
                    <option value="arial">Arial</option>
                    <option value="roboto">Roboto</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t.dateFormat}</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>
              </div>
            )}

            {/* Basic Info */}
            {activeTab === "basic" && (
              <div>
                {/* <h3>{t.basic}</h3> */}  {/*modified */}
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group">
                      <label>{t.firstName}</label>
                      <input type="text" placeholder={t.firstName} />
                    </div>

                    <div className="form-group">
                      <label>{t.lastName}</label>
                      <input type="text" placeholder={t.lastName} />
                    </div>

                    <div className="form-group">
                      <label>{t.email}</label>
                      <input type="email" placeholder={t.email} />
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="form-group">
                      <label>{t.phone}</label>
                      <input type="text" placeholder={t.phone} />
                    </div>

                    <div className="form-group">
                      <label>{t.position}</label>
                      <input type="text" placeholder={t.position} />
                    </div>

                    <div className="form-group">
                      <label>{t.role}</label>
                      <input type="text" placeholder={t.role} />
                    </div>
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                     <h3>{t.profilepicture}</h3>
                     <p>{t.subp3}</p>
                  
                  
                  </div>    
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
