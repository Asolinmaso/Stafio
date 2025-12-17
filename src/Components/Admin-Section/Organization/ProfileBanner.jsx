import React from "react";
import profileimg from "../../../assets/profileimg.png"; // Profile image
import arrow3 from "../../../assets/arrow3.png"; // Paper plane arrow
import Rectangle6 from "../../../assets/Rectangle6.png"; // Human illustration
import "./ProfileBanner.css";

const ProfileBanner = ({ profileData }) => {
  // Use profileData if provided, otherwise use empty values
  const {
    name = '',
    empId = '',
    empType = '',
    location = '',
    department = '',
    supervisor = '',
    hrManager = '',
    email = '',
    phone = ''
  } = profileData || {};

  return (
    <div className="profile-banner-wrapper">
      <div className="my-profile-title"><h1>My Profile</h1>{/* added new my profile title */}</div>
      <div className="profile-banner-container">
        {/* Top Gradient Banner */}
        <div className="profile-banner-top">
          {/* Profile Image */}
          <div className="profile-image-wrapper">
            <img src={profileimg} alt="Profile" className="profile-image" />
          </div>

          {/* Arrow Illustration */}
          <img
            src={arrow3}
            alt="Arrow illustration"
            className="profile-banner-arrow"
          />

          {/* Right Illustration */}
          <img
            src={Rectangle6}
            alt="Team Illustration"
            className="profile-banner-illustration"
          />
        </div>

        {/* White Card with Details */}
        <div className="profile-info-card">
          <div className="profile-info-grid">
            {/* Left Section */}
            <div className="profile-left">
              <div className="profile-name-line">
                <span className="profile-name">S.Santhana Lakshmi</span>
                <span className="profile-id">(ID 1234567)</span>
              </div>
              <div className="profile-role">HR Manager Head</div>
              <div className="profile-location">Chennai</div>
            </div>

            {/* Center Section */}
            <div className="profile-center">
              <div>Employment Type : Full Time</div>
              <div>Primary Supervisor : Catherine</div>
              <div>HR Manager : S.Santhana Lakshmi</div>
            </div>

            {/* Right Section */}
            <div className="profile-right">
              <div>Department : All</div>
              <div>Email Id : lakshmi@gmail.com</div>
              <div>Contact : 9895195971</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;