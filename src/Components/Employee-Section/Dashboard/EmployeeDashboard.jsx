import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { BsPeople } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import {
  MdOutlineAccessTime,
  MdOutlineLogout,
  MdOutlineBedtime,
} from "react-icons/md";
import { TbCalendarTime } from "react-icons/tb";
import {
  BsPlusCircle,
  BsEye,
  BsPencilSquare,
  BsCalendarCheck,
  BsEnvelope,
  BsFlag,
} from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import NotificationBar from "../NotificationBar";
import NotificationTop from "../NotificationTop";
import Vector3 from "../../../assets/Vector3.svg";
import arrow3 from "../../../assets/arrow3.png";
import maleteam from "../../../assets/maleteam.png";
import clock from "../../../assets/clock.gif";
import axios from "axios";
import "./EmployeeDashboard.css";
import EmployeeAttendanceCard from "./EmployeeAttendanceCard";

const EmployeeDashboard = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  // ✅ Load userId from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId && !userId) setUserId(storedId);
  }, [userId]);

  // ✅ Fetch username from backend
  useEffect(() => {
    // Read values from sessionStorage
    const storedUsername = sessionStorage.getItem("current_username");
    const storedRole = sessionStorage.getItem("current_role");

    setUsername(storedUsername);
    setRole(storedRole);
  }, []);

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

// this is for attendance bar data
const attendanceDataSets = {
  months: [
    { label: "Jan", value: 95 },
    { label: "Feb", value: 90 },
    { label: "Mar", value: 86 },
    { label: "Apr", value: 92 },
    { label: "May", value: 88 },
  ],
  weeks: [
    { label: "W1", value: 85 },
    { label: "W2", value: 88 },
    { label: "W3", value: 90 },
    { label: "W4", value: 92 },
  ],
  days: [
    { label: "Mon", value: 90 },
    { label: "Tue", value: 85 },
    { label: "Wed", value: 88 },
    { label: "Thu", value: 92 },
    { label: "Fri", value: 95 },
  ],
};
 

  const MEETING_START_HOUR = 9;
  const MEETING_START_MIN = 0;
  const MEETING_DURATION = 10; // minutes

  const meetingLink = "https://meet.google.com/shm-kuvn-xqb";

  const getMeetingMinutesLeft = () => {
    const now = new Date();

    const meetingStart = new Date();
    meetingStart.setHours(MEETING_START_HOUR, MEETING_START_MIN, 0, 0);

    const meetingEnd = new Date(meetingStart);
    meetingEnd.setMinutes(meetingStart.getMinutes() + MEETING_DURATION);

    if (now < meetingStart) {
      return MEETING_DURATION;
    }

    if (now > meetingEnd) {
      return 0;
    }

    const diffMs = meetingEnd - now;
    return Math.ceil(diffMs / 60000);
  };

  const [meetingMinutesLeft, setMeetingMinutesLeft] = useState(
    getMeetingMinutesLeft()
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setMeetingMinutesLeft(getMeetingMinutesLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [dashboardData, setDashboardData] = useState({
    total_leaves: 0,
    leaves_taken: 0,
    absent_days: 0,
    worked_days: 0,
    completed_projects: 0,
    this_week_holiday: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-wrapper d-flex">
      <div className="sidebar">
        <EmployeeSidebar />
      </div>
      <div className="main-content flex-grow-1">
        <Topbar />
        <Container fluid className="p-4">
          <Row className="mb-4 align-items-center">
            <div className="username">
              <h1>Hello, {username || "User"}!</h1>
            </div>
          </Row>

          <Row className="mb-4">
            <div md={4}>
              <NotificationTop />
            </div>
            <Col md={12}>
              <div className="meeting-card d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img src={Vector3} alt="Vector3" className="vector-img" />
                  <div className="meeting-left">
                    {!isPunchedIn ? (
                      <>
                        <h2>
                          {currentTime} , {currentDate}
                        </h2>
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="meeting-box"
                          style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <div className="meeting-info">
                            <h4>Standup Meeting</h4>
                            <p>
                              {meetingMinutesLeft > 0
                                ? `${meetingMinutesLeft} Min Left`
                                : "Meeting Ended"}
                            </p>
                          </div>

                          <div className="meeting-time">Join</div>

                          <div className="chevron-box">
                            <FaChevronRight />
                          </div>
                        </a>
                        <button className="btn-punch" onClick={handlePunchIn}>
                          Check In
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
                            <span>Check In :</span>{" "}
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
                            <span>⚠️</span>
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
                <div className="meeting-right">
                  <img src={arrow3} alt="Illustration" className="arrow3" />
                  <img src={maleteam} alt="Illustration" className="maleteam" />
                  <img src={clock} alt="Illustration" className="clock" />
                </div>
              </div>
            </Col>
          </Row>

          {/* Leave Summary */}
          <Row className="notice mb-4">
            <Col md={8}>
              <Row>
                <Col md={4} lg={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <h2>{dashboardData.total_leaves}</h2>
                      <div className="summary-icons">
                        <BsPeople />
                      </div>
                    </div>
                    <h6>Total Leaves</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsPlusCircle />
                      </div>{" "}
                      Apply Leave
                    </div>
                  </Card>
                </Col>

                <Col md={4} lg={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <h2>{dashboardData.leaves_taken}</h2>
                      <div className="summary-icons">
                        <IoTimeOutline />
                      </div>
                    </div>
                    <h6>Taken</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsEye />
                      </div>{" "}
                      Check Leave Details
                    </div>
                  </Card>
                </Col>

                <Col md={4} lg={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <h2>{dashboardData.absent_days}</h2>
                      <div className="summary-icons">
                        <MdOutlineAccessTime />
                      </div>
                    </div>
                    <h6>Absent</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsPencilSquare />
                      </div>{" "}
                      Add Regularization
                    </div>
                  </Card>
                </Col>

                <Col md={4} lg={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <h2>{dashboardData.worked_days}</h2>
                      <div className="summary-icons">
                        <MdOutlineLogout />
                      </div>
                    </div>
                    <h6>Worked Days</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsCalendarCheck />
                      </div>{" "}
                      Check Attendance Overview
                    </div>
                  </Card>
                </Col>

                <Col md={4} lg={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <h2>{dashboardData.completed_projects}</h2>
                      <div className="summary-icons">
                        <MdOutlineBedtime />
                      </div>
                    </div>
                    <h6>Completed Projects</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsEnvelope />
                      </div>{" "}
                      Sent Offer Letter
                    </div>
                  </Card>
                </Col>

                <Col md={4} lg={4} className="mb-3">
                  <Card className="summary-card">
                    <div className="summary-top">
                      <div className="summary-action">
                        <h2>{dashboardData.this_week_holiday}</h2>
                      </div>
                      <div className="summary-icons">
                        <TbCalendarTime />
                      </div>
                    </div>
                    <h6>This Week Holiday</h6>
                    <div className="summary-action">
                      <div className="summary-action-icon">
                        <BsFlag />
                      </div>{" "}
                      Independence Day (Fri, 15 Aug)
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col md={4}>
              <EmployeeAttendanceCard dataSets={attendanceDataSets} />
            </Col>
          </Row>

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

export default EmployeeDashboard;

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
  width: "30%",
};

const closeBtnStyle = {
  background: "transparent",
  color: "white",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  marginLeft: "10px",
};
