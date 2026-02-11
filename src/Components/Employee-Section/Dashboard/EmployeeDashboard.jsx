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

  // ✅ Load userId from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId && !userId) setUserId(storedId);
  }, [userId]);

  // ✅ Fetch username from backend
  useEffect(() => {
    const storedUsername = localStorage.getItem("employee_username"); // or "employeeUsername"
    if (storedUsername) {
      setUsername(storedUsername);
    }
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

  const attendanceData = [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 90 },
    { month: "Mar", value: 86, highlight: true },
    { month: "Apr", value: 100 },
    { month: "May", value: 75 },
  ];

  function AttendanceCard() {
    return (
      <Card className="attendance-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title>Monthly Attendance</Card.Title>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                fill="#E5F0F7"
                barSize={30}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(val) => `${val}%`}
                />
              </Bar>
              <Bar
                dataKey="value"
                data={attendanceData.filter((d) => d.highlight)}
                radius={[4, 4, 0, 0]}
                fill="#19BDE8"
                barSize={30}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(val) => `${val}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    );
  }

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
               <EmployeeAttendanceCard attendanceData={attendanceData} />
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