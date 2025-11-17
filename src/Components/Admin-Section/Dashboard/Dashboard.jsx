import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { BsPeople } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineAccessTime, MdOutlineLogout } from "react-icons/md";
import { TbCalendarTime } from "react-icons/tb";
import {
  BsEye,
  BsPencilSquare,
  BsCalendarCheck,
  BsEnvelope,
  BsFlag,
} from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import NotificationBar from "../../Employee-Section/NotificationBar";
import NotificationTop from "../../Employee-Section/NotificationTop";
import Vector3 from "../../../assets/Vector3.svg";
import arrow3 from "../../../assets/arrow3.png";
import gradientimg from "../../../assets/gradientimg.png";
import clock from "../../../assets/clock.gif";
import group10 from "../../../assets/Group10.png";
import { FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import AttendanceCard from "./AttendanceCard";

const Dashboard = () => {
  const [adminusername, setAdminusername] = useState("");
  const attendanceData = [
    { month: "Jan", value: 95 },
    { month: "Feb", value: 90 },
    { month: "Mar", value: 86, highlight: true },
    { month: "Apr", value: 92 },
    { month: "May", value: 88 },
  ];

  // ✅ Punch In/Out
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [totalHours, setTotalHours] = useState("0:00:00");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isBreak, setIsBreak] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const breakStartRef = useRef(null);
  const pausedDurationRef = useRef(0);
  const breakTimerRef = useRef(null);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const calculateDuration = (start, end) => {
    const diff = Math.floor((end - start - pausedDurationRef.current) / 1000);
    const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
    const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const secs = String(diff % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    // Function to update time & date every second
    const updateTime = () => {
      const now = new Date();

      // Format time (e.g., 9:01:09 AM)
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      // Format date (e.g., 10 Aug 2025)
      const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateTime(); // run immediately
    const timer = setInterval(updateTime, 1000); // update every 1s

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const handlePunchIn = (e) => {
    e.preventDefault();
    const now = new Date();
    setIsPunchedIn(true);
    setPunchInTime(now);
    startTimeRef.current = now;
    pausedDurationRef.current = 0;

    // Start timer
    timerRef.current = setInterval(() => {
      setTotalHours(calculateDuration(startTimeRef.current, new Date()));
    }, 1000);
  };

  const handleStartBreak = () => {
    if (!isBreak) {
      // 🟠 Start Break
      setIsBreak(true);
      breakStartRef.current = new Date();
      clearInterval(timerRef.current);

      // ⏰ Start 15-min watcher
      breakTimerRef.current = setTimeout(() => {
        setShowAlert(true); // show alert when break > 15 mins
      }, 15 * 60 * 1000); // 15 minutes in ms
    } else {
      // 🟢 End Break
      setIsBreak(false);
      const breakEnd = new Date();
      pausedDurationRef.current += breakEnd - breakStartRef.current;

      // stop alert + timer
      clearTimeout(breakTimerRef.current);
      setShowAlert(false);

      // Resume timer
      timerRef.current = setInterval(() => {
        setTotalHours(calculateDuration(startTimeRef.current, new Date()));
      }, 1000);
    }
  };

  const handlePunchOut = (e) => {
    setIsPunchedIn(false);
    clearInterval(timerRef.current);
    clearTimeout(breakTimerRef.current);
    setShowAlert(false);
    e.preventDefault();
    if (punchInTime) {
      const now = new Date();
      const diff = now - punchInTime;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTotalHours(`${hours}:${minutes}:${seconds}`);
    }
    setIsPunchedIn(false);
    setPunchInTime(null);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(breakTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const storedAdminusername = localStorage.getItem("admin_username"); // or "AdminUsername"
    if (storedAdminusername) {
      setAdminusername(storedAdminusername);
    }
  }, []);

  const [adminDashboardData, setAdminDashboardData] = useState({
    total_employees: 0,
    On_Time: 0,
    On_Leave: 0,
    Late_Arrival: 0,
    Pending_Approval: 0,
    This_Week_Hoilday: 0,
  });

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/admin_dashboard"
        );
        setAdminDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchAdminDashboardData();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper d-flex">
      <div className="rightside-logo ">
              <img src={group10} alt="logo"
              className="rightside-logos" />
            </div>
      <div className="sidebar">
        <AdminSidebar />
      </div>
      <div className="main-content flex-grow-1">
        <Topbar />
        <Container fluid className="p-4">
          {/* Welcome Section */}
          <Row className="mb-4 align-items-center">
            <div className="username">
              <h1>Welcome, {adminusername || "User"}!</h1>
            </div>
          </Row>

          {/* Notification Top */}
          <Row className="mb-4">
            <div md={4}>
              <NotificationTop />
            </div>
            <Col md={12}>
              <div className="meeting-card d-flex justify-content-between align-items-center">
                {/* Left group */}
                <div className="d-flex align-items-center">
                  <img src={Vector3} alt="Vector3" className="vector-img" />
                  <div className="meeting-left">
                    {!isPunchedIn ? (
                      <>
                        <h2>
                          {currentTime} , {currentDate}
                        </h2>
                        <div className="meeting-box">
                          <div className="meeting-info">
                            <h4>Standup Meeting</h4>
                            <p>02 Min Left</p>
                          </div>
                          <div className="meeting-time">07</div>
                          <div className="chevron-box">
                            <FaChevronRight />
                          </div>
                        </div>
                        <button className="btn-punch" onClick={handlePunchIn}>
                          Ckeck In
                        </button>
                      </>
                    ) : (
                      <>
                        <h2>
                          {currentTime} , {currentDate}
                        </h2>
                        <p>
                          Lunch Break 1:00 PM - 2:00 PM & Coffee Break 4:00 PM -
                          4:15 PM
                        </p>
                        <div className="punch-info-box">
                          <div className="info-item">
                            <span>Ckeck In :</span>{" "}
                            <strong>{formatTime(punchInTime)}</strong>
                          </div>
                          <div className="info-item">
                            <span>Total Hours :</span>{" "}
                            <strong>{totalHours}</strong>
                          </div>
                        </div>

                        <div className="button-row">
                          <button
                            className="btn-punch-out"
                            onClick={handlePunchOut}
                          >
                            Check Out
                          </button>
                          <button
                            className="btn-start-break"
                            onClick={handleStartBreak}
                          >
                            {isBreak ? "End Break" : "Start Break"}{" "}
                            <span>▼</span>
                          </button>
                        </div>

                        {/* ⚠️ Break time alert popup */}
                        {showAlert && (
                          <div style={alertStyle}>
                            <span>
                              ⚠️
                            </span>
                            <span>
                               Your break time of 15 minutes has ended. Please
                              resume work.
                            </span>
                            <button
                              style={closeBtnStyle}
                              onClick={() => setShowAlert(false)}
                            >
                              ✖
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Right Illustration */}
                <div className="meeting-right">
                  <img src={arrow3} alt="Illustration" className="arrow3" />
                  <img
                    src={gradientimg}
                    alt="Illustration"
                    className="maleteam"
                  />
                  <img src={clock} alt="Illustration" className="clock" />
                </div>
              </div>
            </Col>
          </Row>

          {/* Admin Summary Cards */}
          <Row className="notice mb-4">
            <Col md={8}>
              <Row>
                {/* Total Employees */}
                <Col md={4} className="mb-3">
                  <Card
                    className="summary-card"
                    onClick={() => navigate("/employees-list")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="summary-top">
                      <h2>{adminDashboardData.total_employees}</h2>
                      <div className="summary-icons">
                        <BsPeople />
                      </div>
                    </div>
                    <h6>Total Employees</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsPlusCircle />
                      </div>
                      2 new employees added!
                    </div>
                  </Card>
                </Col>

                {/* On Time */}
                <Col md={4} className="mb-3">
                  <Card
                    className="summary-card"
                    onClick={() => navigate("/attendance")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="summary-top">
                      <h2>{adminDashboardData.On_Time}</h2>
                      <div className="summary-icons">
                        <IoTimeOutline />
                      </div>
                    </div>
                    <h6>On Time</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsEye />
                      </div>
                      Check Attendance Today
                    </div>
                  </Card>
                </Col>

                {/* On Leave */}
                <Col md={4} className="mb-3">
                  <Card
                    className="summary-card"
                    onClick={() => navigate("/who-is-on-leave")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="summary-top">
                      <h2>{adminDashboardData.On_Leave}</h2>
                      <div className="summary-icons">
                        <MdOutlineAccessTime />
                      </div>
                    </div>
                    <h6>On Leave</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsPencilSquare />
                      </div>
                      Accept or reject Leave
                    </div>
                  </Card>
                </Col>

                {/* Late Arrival */}
                <Col md={4} className="mb-3">
                  <Card
                    className="summary-card"
                    onClick={() => navigate("/admin-attendance-report")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="summary-top">
                      <h2>{adminDashboardData.Late_Arrival}</h2>
                      <div className="summary-icons">
                        <MdOutlineLogout />
                      </div>
                    </div>
                    <h6>Late Arrival</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsCalendarCheck />
                      </div>
                      Check Attendance Overview
                    </div>
                  </Card>
                </Col>

                {/* Pending Approval */}
                <Col md={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <h2>{adminDashboardData.Pending_Approval}</h2>
                      <div className="summary-icons">
                        <FaCalendarAlt />
                      </div>
                    </div>
                    <h6>Pending Approval</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsEnvelope />
                      </div>
                      Approve Leave
                    </div>
                  </Card>
                </Col>

                {/* This Week Hoilday */}
                <Col md={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <h2>{adminDashboardData.This_Week_Hoilday}</h2>
                      <div className="summary-icons">
                        <TbCalendarTime />
                      </div>
                    </div>
                    <h6>This Week Hoilday</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsFlag />
                      </div>
                      Manage Holiday List
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={4}>
              <AttendanceCard attendanceData={attendanceData} />
            </Col>
          </Row>

          {/* Notifications */}
          <Row>
            <Col md={8}>
              <NotificationBar />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;

const alertStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#f47c3c",
  color: "white",
  padding: "16px 24px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  zIndex: 9999,
  width:"30%",
};

const closeBtnStyle = {
  background: "transparent",
  color: "white",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  marginLeft: "10px",
};