import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./AdminSidebar.css";
import stafioimg from "../../assets/stafioimg.png";
import booking from "../../assets/booking.png";
import Group from "../../assets/Group.png";
import Group1 from "../../assets/Group1.png";
import Group2 from "../../assets/Group2.png";
import Group4 from "../../assets/Group4.png";
import Group5 from "../../assets/Group5.png";
import Vector2 from "../../assets/Vector2.svg";
import Vector1 from "../../assets/Vector1.svg";
import Vector4 from "../../assets/Vector4.svg";
import Vector5 from "../../assets/Vector5.svg";
import { useLocation } from "react-router-dom";

export const OrganizationMenu = () => {
  const location = useLocation();
  const isOrganizationActive =
    location.pathname.startsWith("/employees-list") ||
    location.pathname.startsWith("/el-myteam") ||
    location.pathname.startsWith("/admin-profile");
  const [open, setOpen] = useState(false);

  // Paths that belong to Organization
  const orgPaths = ["/employees-list", "/admin-profile", "/el-myteam"];
  const isOrgActive = orgPaths.includes(location.pathname);

  useEffect(() => {
    if (isOrgActive) setOpen(true);
  }, [isOrgActive]);

  const handleOrgClick = () => {
    setOpen(!open);
  };

  return (
    <div className="org-menu">
      {/* Main Organization Nav */}
      <div
        className={`sidebar-link d-flex align-items-center justify-content-between ${
          isOrgActive ? "active" : ""
        }`}
        onClick={handleOrgClick}
      >
        <div className="d-flex align-items-center">
          <img
            src={Vector4}
            alt="Organization Icon"
            className={`me-2 sidebar-icon ${
              isOrganizationActive ? "active" : ""
            }`}
          />
          <div className="org">Organization</div>
        </div>
        <div className="chev-container">
          {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </div>

      {/* Submenu Links */}
      {open && (
        <div className="submenu ms-4 mt-2">
          <NavLink
            to="/employees-list"
            className={({ isActive }) =>
              isActive || location.pathname.startsWith("/el-myteam")
                ? "submenu-link active"
                : "submenu-link"
            }
          >
            Employee List
          </NavLink>
          <NavLink
            to="/admin-profile"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            My Profile
          </NavLink>
        </div>
      )}
    </div>
  );
};

export const ApprovalMenu = () => {
  const location = useLocation();
  const isApprovalsActive =
    location.pathname.startsWith("/leave-approval") ||
    location.pathname.startsWith("/myTeam-LeaveApproval") ||
    location.pathname.startsWith("/regularization-approval") ||
    location.pathname.startsWith("/ra-myteam") ||
    location.pathname.startsWith("/leave-policies");
  const [open, setOpen] = useState(false);

  // Paths that belong to Approval
  const approvalPaths = [
    "/leave-approval",
    "/regularization-approval",
    "/leave-policies",
    "/myTeam-LeaveApproval",
    "/ra-myteam",
  ];
  const isApprovalActive = approvalPaths.includes(location.pathname);

  useEffect(() => {
    if (isApprovalActive) setOpen(true);
  }, [isApprovalActive]);

  const handleApprovalClick = () => {
    setOpen(!open);
  };

  return (
    <div className="approval-menu">
      {/* Main Approval Nav */}
      <div
        className={`sidebar-link d-flex align-items-center justify-content-between ${
          isApprovalActive ? "active" : ""
        }`}
        onClick={handleApprovalClick}
      >
        <div className="d-flex align-items-center">
          <img
            src={Group4}
            alt="Approval Icon"
            className={`me-2 sidebar-icon ${isApprovalsActive ? "active" : ""}`}
          />
          <div className="approval">Approval</div>
        </div>
        <div className="chev-container">
          {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </div>

      {/* Submenu Links */}
      {open && (
        <div className="submenu ms-4 mt-2">
          <NavLink
            to="/leave-approval"
            className={({ isActive }) =>
              isActive || location.pathname.startsWith("/myTeam-LeaveApproval")
                ? "submenu-link active"
                : "submenu-link"
            }
          >
            Leave Approval
          </NavLink>
          <NavLink
            to="/regularization-approval"
            className={({ isActive }) =>
              isActive || location.pathname.startsWith("/ra-myteam")
                ? "submenu-link active"
                : "submenu-link"
            }
          >
            Regularization Approval
          </NavLink>
          <NavLink
            to="/leave-policies"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            Leave Policies
          </NavLink>
        </div>
      )}
    </div>
  );
};

export const LeaveMenu = () => {
  const location = useLocation();
  const isLeavesActive =
    location.pathname.startsWith("/admin-my-leave") ||
    location.pathname.startsWith("/admin-my-regularization") ||
    location.pathname.startsWith("/admin-my-holidays");
  const [open, setOpen] = useState(false);

  // Paths that belong to Leave
  const leavePaths = [
    "/admin-my-leave",
    "/admin-my-regularization",
    "/admin-my-holidays",
  ];
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
            className={`me-2 sidebar-icon ${isLeavesActive ? "active" : ""}`}
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
            to="/admin-my-leave"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            My Leaves
          </NavLink>
          <NavLink
            to="/admin-my-regularization"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            My Regularization
          </NavLink>
          <NavLink
            to="/admin-my-holidays"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            My Holiday
          </NavLink>
        </div>
      )}
    </div>
  );
};
export const ReportMenu = () => {
  const location = useLocation();
  const isReportsActive =
    location.pathname.startsWith("/admin-attendance-report") ||
    location.pathname.startsWith("/leave-report");
  const [open, setOpen] = useState(false);

  // Paths that belong to Reports
  const reportPaths = ["/admin-attendance-report", "/leave-report"];
  const isReportActive = reportPaths.includes(location.pathname);

  useEffect(() => {
    if (isReportActive) setOpen(true);
  }, [isReportActive]);

  const handleReportClick = () => {
    setOpen(!open);
  };

  return (
    <div className="report-menu">
      {/* Main Report Nav */}
      <div
        className={`sidebar-link d-flex align-items-center justify-content-between ${
          isReportActive ? "active" : ""
        }`}
        onClick={handleReportClick}
      >
        <div className="d-flex align-items-center">
          <img
            src={Group5}
            alt="Report Icon"
            className={`me-2 sidebar-icon ${isReportsActive ? "active" : ""}`}
          />
          <div className="report">Reports</div>
        </div>
        <div className="chev-container">
          {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </div>

      {/* Submenu Links */}
      {open && (
        <div className="submenu ms-4 mt-2">
          <NavLink
            to="/admin-attendance-report"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            Attendance Report
          </NavLink>
          <NavLink
            to="/leave-report"
            className={({ isActive }) =>
              `submenu-link ${isActive ? "active" : ""}`
            }
          >
            Leave Report
          </NavLink>
        </div>
      )}
    </div>
  );
};

const AdminSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setShowSidebar(true), 100);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("announcements");
    // Remove Remember Me data
    localStorage.removeItem("remember_admin");
    localStorage.removeItem("remember_email");
    localStorage.removeItem("remember_password");
    // 🔥 Remove Google Remember Me
    localStorage.removeItem("remember_google");
    localStorage.removeItem("remember_google_email");
    localStorage.removeItem("remember_google_name");

    window.location.href = "/";
  };

  const isDashboardActive = location.pathname === "/admin-dashboard";
  const isSettingsActive = location.pathname === "/admin-settings";
  const isDocumentationActive = location.pathname === "/performance";

  const isAttendanceActive =
    location.pathname.startsWith("/attendance") ||
    location.pathname.startsWith("/who-is-on-leave");

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
          to="/admin-dashboard"
          className={`sidebar-link ${isDashboardActive ? "active" : ""}`}
        >
          <img
            src={Group}
            alt="Dashboard Logo"
            className={`me-2 sidebar-icon ${isDashboardActive ? "active" : ""}`}
          />
          Dashboard
        </Nav.Link>

        {/* Leave Menu */}
        <NavLink to="/employees-list" className="sidebar-leave-link">
          <OrganizationMenu />
        </NavLink>
        <NavLink to="/leave-approval" className="sidebar-leave-link">
          <ApprovalMenu />
        </NavLink>
        <NavLink to="/admin-my-leave" className="sidebar-leave-link">
          <LeaveMenu />
        </NavLink>
        <NavLink to="/admin-attendance-report" className="sidebar-leave-link">
          <ReportMenu />
        </NavLink>
        <Nav.Link
          as={NavLink}
          to="/performance"
          className={`sidebar-link ${isDocumentationActive ? "active" : ""}`}
        >
          <img
            src={Vector5}
            alt="Profile Logo"
            className={`me-2 sidebar-icon ${
              isDocumentationActive ? "active" : ""
            }`}
          />
          Documentation
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/attendance"
          className={`sidebar-link ${isAttendanceActive ? "active" : ""}`}
        >
          <img
            src={Group2}
            alt="Attendance Logo"
            className={`me-2 sidebar-icon ${
              isAttendanceActive ? "active" : ""
            }`}
          />
          Attendance
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin-settings"
          className={`sidebar-link ${isSettingsActive ? "active" : ""}`}
        >
          <img
            src={Vector2}
            alt="Settings"
            className={`me-2 sidebar-icon ${isSettingsActive ? "active" : ""}`}
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

export default AdminSidebar;
