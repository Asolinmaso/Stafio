import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./EmployeeSidebar.css";
import stafioimg from "../../assets/stafioimg.png";
import booking from "../../assets/booking.png";
import Group from "../../assets/Group.png";
import Group1 from "../../assets/Group1.png";
import Group2 from "../../assets/Group2.png";
import Vector from "../../assets/Vector.png";
import Vector1 from "../../assets/Vector1.svg";
import Vector2 from "../../assets/Vector2.svg";
import { useLocation } from "react-router-dom";

// LeaveMenu code here

export const LeaveMenu = () => {
  const location = useLocation();
  const isLeavePageActive =
    location.pathname.startsWith("/my-leave") ||
    location.pathname.startsWith("/my-regularization") ||
    location.pathname.startsWith("/my-holidays");
  const [open, setOpen] = useState(false);

  const leavePaths = ["/my-leave", "/my-regularization", "/my-holidays"];
  const isLeaveActive = leavePaths.includes(location.pathname);
  useEffect(() => {
    if (isLeaveActive) setOpen(true);
  }, [isLeaveActive]);

  const handleLeaveClick = () => {
    setOpen(!open);
  };

  return (
    <div className="leave-menu">
      {/* Main Leave Nav */}
      <div
        className={`sidebar-link d-flex align-items-center justify-content-between ${
          isLeaveActive ? "active" : ""
        }`}
        onClick={handleLeaveClick}
      >
        <div className="d-flex align-items-center">
          <img
            src={Group1}
            alt="Leave Icon"
            className={`me-2 sidebar-icon ${isLeavePageActive ? "active" : ""}`}
          />
          <div className="leave">Leave</div>
        </div>
        <div className="chev-container">
          {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </div>

      {/* Submenu Links */}
      {open && (
        <div className="submenu ms-4 mt-2">
          <NavLink
            to="/my-leave"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            My Leaves
          </NavLink>
          <NavLink
            to="/my-regularization"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            My Regularization
          </NavLink>
          <NavLink
            to="/my-holidays"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            My Holidays
          </NavLink>
        </div>
      )}
    </div>
  );
};

const EmployeeSidebar = () => {
  const isEmployeeDashboardActive = location.pathname === "/employee-dashboard";
  const isAttendancesActive = location.pathname === "/employee-attendance";
  const isSettingsPageActive = location.pathname === "/settings";

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowSidebar(true), 100);
  }, []);

  const handleLogout = () => {
    // Remove Remember Me data
    localStorage.removeItem("remember_employee");
    localStorage.removeItem("employee_email");
    localStorage.removeItem("employee_password");
    window.location.href = "/employee-login";
  };
  return (
    <div
      className={`employee-sidebar d-flex flex-column ${
        showSidebar ? "show" : ""
      }`}
    >
      {/* Sidebar Header */}
      <div className="employee-sidebar-header text-center">
        <img src={stafioimg} alt="StafiO Logo" className="sidebar-logo" />
      </div>

      {/* Sidebar Links */}
      <Nav className="flex-column">
        <Nav.Link
          as={NavLink}
          to="/employee-dashboard"
          className="sidebar-link"
        >
          <img
            src={Group}
            alt="Dashboard Logo"
            className={`me-2 sidebar-icon ${
              isEmployeeDashboardActive ? "active" : ""
            }`}
          />
          Dashboard
        </Nav.Link>

        {/* Leave Menu */}
        <NavLink to="/my-leave" className="sidebar-leave-link">
          <LeaveMenu />
        </NavLink>
        <Nav.Link
          as={NavLink}
          to="/employee-attendance"
          className="sidebar-link"
        >
          <img
            src={Group2}
            alt="Attendance Logo"
            className={`me-2 sidebar-icon ${
              isAttendancesActive ? "active" : ""
            }`}
          />
          Attendance
        </Nav.Link>

        <Nav.Link as={NavLink} to="/profile" className="sidebar-link">
          <img
            src={Vector}
            alt="Profile Logo"
            className="me-2"
            style={{ width: "20px", height: "20px" }}
          />
          Profile
        </Nav.Link>

        <Nav.Link as={NavLink} to="/settings" className="sidebar-link">
          <img
            src={Vector2}
            alt="Settings Logo"
            className={`me-2 sidebar-icon ${
              isSettingsPageActive ? "active" : ""
            }`}
          />
          Settings
        </Nav.Link>
      </Nav>

      {/* Logout Button */}
      <div className="sidebar-logout" onClick={handleLogout}>
        <img
          src={Vector1}
          alt="Logout Icon"
          className="me-2"
          style={{ width: "20px", height: "20px" }}
        />
        Logout
      </div>

      <div className="employee-sidebar-footer text-center">
        <img src={booking} alt="Booking Logo" className="sidebar-logo1" />
      </div>
    </div>
  );
};

export default EmployeeSidebar;
