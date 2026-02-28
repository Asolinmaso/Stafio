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
import profileimg from "../../../assets/profileimg.png";
import { FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import AttendanceCard from "./AttendanceCard";
import { getCurrentSession } from "../../../utils/sessionManager";

// ─── Config ────────────────────────────────────────────────────────────────
const BASE_URL = "http://127.0.0.1:5001";

const BREAK_SCHEDULES = [
	{ id: "lunch",  label: "Lunch Break",  start: "13:00", end: "14:00" },
	{ id: "coffee", label: "Coffee Break", start: "16:00", end: "16:15" },
];

const MEETING_LINK         = "https://meet.google.com/shm-kuvn-xqb";
const MEETING_START_HOUR   = 9;
const MEETING_START_MIN    = 0;
const ALERT_BEFORE_MINUTES = 10;
const BREAK_DURATION_MIN   = 15;

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatTime = (date) =>
	date instanceof Date
		? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
		: date;

/** Returns "HH:MM:SS" string for (now - punchInDate) minus totalBreakMs */
const calcWorkingTime = (punchInDate, totalBreakMs = 0) => {
	if (!punchInDate) return "00:00:00";
	const totalMs  = Math.max(0, Date.now() - punchInDate.getTime() - totalBreakMs);
	const totalSec = Math.floor(totalMs / 1000);
	const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
	const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
	const s = String(totalSec % 60).padStart(2, "0");
	return `${h}:${m}:${s}`;
};

const getCurrentTimeInMinutes = () => {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
};
const toMinutes = (time) => {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
};

// ─── Component ──────────────────────────────────────────────────────────────
const Dashboard = () => {
	// ── Auth / session ────────────────────────────────────────────────────
	const [username, setUsername] = useState("");
	const [role,     setRole]     = useState("");
	const [userId,   setUserId]   = useState(null); // needed for API headers

	// ── Clock ─────────────────────────────────────────────────────────────
	const [currentTime, setCurrentTime] = useState("");
	const [currentDate, setCurrentDate] = useState("");

	// ── Punch state ───────────────────────────────────────────────────────
	const [isPunchedIn,  setIsPunchedIn]  = useState(false);
	const [punchInTime,  setPunchInTime]  = useState(null);   // Date object
	const [totalHours,   setTotalHours]   = useState("00:00:00");
	const [isBreak,      setIsBreak]      = useState(false);
	const [activeBreak,  setActiveBreak]  = useState(null);
	const [showAlert,    setShowAlert]    = useState(false);
	const [showBreakDropdown, setShowBreakDropdown] = useState(false);

	// ── API loading / error state ─────────────────────────────────────────
	const [punchLoading, setPunchLoading] = useState(false);
	const [punchError,   setPunchError]   = useState("");

	// ── Refs ──────────────────────────────────────────────────────────────
	const timerRef         = useRef(null);   // working hours interval
	const breakTimerRef    = useRef(null);   // 15-min break alert timeout
	const breakDropdownRef = useRef(null);
	const breakStartRef    = useRef(null);   // Date when current break started
	const totalBreakMsRef  = useRef(0);      // accumulated break ms this session

	// ── Admin summary ─────────────────────────────────────────────────────
	const [adminDashboardData, setAdminDashboardData] = useState({
		total_employees: 0, On_Time: 0, On_Leave: 0,
		Late_Arrival: 0, Pending_Approval: 0, This_Week_Hoilday: 0,
	});

	// ── Meeting ───────────────────────────────────────────────────────────
	const [meetingStatus,   setMeetingStatus]   = useState("idle");
	const [meetingTimeLeft, setMeetingTimeLeft] = useState("");
	const [hasJoined,       setHasJoined]       = useState(false);

	const navigate = useNavigate();

	// ── Axios helper (attaches user-id header) ────────────────────────────
	const apiHeaders = () => ({
		"X-User-ID": userId,
		"Content-Type": "application/json",
	});

	// ─────────────────────────────────────────────────────────────────────
	// 1. Session + initial attendance restore
	// ─────────────────────────────────────────────────────────────────────
	useEffect(() => {
		const session = getCurrentSession();
		if (session) {
			setUsername(session.username || "");
			setRole(session.role || "");
			setUserId(session.user_id || session.id || null);
		}
	}, []);

	// Once userId is known, fetch today's attendance to restore UI state on refresh
	useEffect(() => {
		if (!userId) return;
        const fetchTodayAttendance = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/attendance/today`, {
            headers: { "X-User-ID": userId },
        });

        const data = res.data;
        if (!data || !data.check_in) return;

        const checkInDate = new Date(data.check_in.replace(" GMT", ""));
        setPunchInTime(checkInDate);

        if (data.check_out) {
            setIsPunchedIn(false);
            setTotalHours(data.work_hours || "00:00:00");
            return;
        }

        setIsPunchedIn(true);

        // Restore accumulated break ms
        const restoredBreakMs = (data.total_break_minutes || 0) * 60 * 1000;
        totalBreakMsRef.current = restoredBreakMs;

        if (data.active_break) {
            // On break — show frozen working hours (don't start timer)
            setIsBreak(true);
            breakStartRef.current = new Date();
            // Show correct frozen total hours instead of 00:00:00
            setTotalHours(calcWorkingTime(checkInDate, restoredBreakMs));
        } else {
            // Working — immediately set correct hours before timer kicks in
            setTotalHours(calcWorkingTime(checkInDate, restoredBreakMs));
            startWorkingTimer(checkInDate);
        }
    } catch (err) {
        console.error("Could not restore today's attendance:", err);
    }
};
		

		fetchTodayAttendance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	// ─────────────────────────────────────────────────────────────────────
	// 2. Live clock
	// ─────────────────────────────────────────────────────────────────────
	useEffect(() => {
		const tick = () => {
			const now = new Date();
			setCurrentTime(
				now.toLocaleTimeString("en-US", {
					hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
				})
			);
			setCurrentDate(
				now.toLocaleDateString("en-GB", {
					day: "2-digit", month: "short", year: "numeric",
				})
			);
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	// ─────────────────────────────────────────────────────────────────────
	// 3. Working hours timer helpers
	// ─────────────────────────────────────────────────────────────────────
	const startWorkingTimer = (punchIn) => {
		clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			setTotalHours(calcWorkingTime(punchIn, totalBreakMsRef.current));
		}, 1000);
	};

	const stopWorkingTimer = () => {
		clearInterval(timerRef.current);
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			clearInterval(timerRef.current);
			clearTimeout(breakTimerRef.current);
		};
	}, []);

	// ─────────────────────────────────────────────────────────────────────
	// 4. Outside click → close break dropdown
	// ─────────────────────────────────────────────────────────────────────
	useEffect(() => {
		const handler = (e) => {
			if (breakDropdownRef.current && !breakDropdownRef.current.contains(e.target)) {
				setShowBreakDropdown(false);
			}
		};
		if (showBreakDropdown) document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [showBreakDropdown]);

	// ─────────────────────────────────────────────────────────────────────
	// 5. Admin dashboard data
	// ─────────────────────────────────────────────────────────────────────
	useEffect(() => {
		axios
			.get(`${BASE_URL}/admin_dashboard`)
			.then((r) => setAdminDashboardData(r.data))
			.catch((e) => console.error("Admin dashboard error:", e));
	}, []);

	// ─────────────────────────────────────────────────────────────────────
	// 6. Meeting status
	// ─────────────────────────────────────────────────────────────────────
	useEffect(() => {
		const update = () => {
			const now          = new Date();
			const meetingStart = new Date();
			meetingStart.setHours(MEETING_START_HOUR, MEETING_START_MIN, 0, 0);
			const alertStart = new Date(meetingStart);
			alertStart.setMinutes(alertStart.getMinutes() - ALERT_BEFORE_MINUTES);

			if (now < alertStart) {
				setMeetingStatus("idle"); setMeetingTimeLeft(""); return;
			}
			if (now >= alertStart && now < meetingStart) {
				const diffSec  = Math.floor((meetingStart - now) / 1000);
				const mins = String(Math.floor(diffSec / 60)).padStart(2, "0");
				const secs = String(diffSec % 60).padStart(2, "0");
				setMeetingStatus("countdown");
				setMeetingTimeLeft(`${mins}:${secs} Min Left`);
				return;
			}
			if (now >= meetingStart && !hasJoined) {
				setMeetingStatus("join"); setMeetingTimeLeft("Join the meet"); return;
			}
			if (hasJoined) {
				setMeetingStatus("ended"); setMeetingTimeLeft("Meeting Ended");
			}
		};
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	}, [hasJoined]);

	// ─────────────────────────────────────────────────────────────────────
	// 7. Punch In
	// ─────────────────────────────────────────────────────────────────────
	const handlePunchIn = async (e) => {
		e.preventDefault();
		if (!userId) { setPunchError("User session not found. Please log in again."); return; }

		setPunchLoading(true);
		setPunchError("");

		try {
			await axios.post(`${BASE_URL}/api/attendance/punch-in`, {}, { headers: apiHeaders() });

			const now = new Date();
			setPunchInTime(now);
			totalBreakMsRef.current = 0;
			setTotalHours("00:00:00");
			setIsPunchedIn(true);
			startWorkingTimer(now);
		} catch (err) {
			const msg = err.response?.data?.message || "Punch in failed. Please try again.";
			setPunchError(msg);
		} finally {
			setPunchLoading(false);
		}
	};

	// ─────────────────────────────────────────────────────────────────────
	// 8. Punch Out
	// ─────────────────────────────────────────────────────────────────────
	const handlePunchOut = async () => {
		if (!userId) return;

		setPunchLoading(true);
		setPunchError("");

		try {
			const res = await axios.post(`${BASE_URL}/api/attendance/punch-out`, {}, { headers: apiHeaders() });

			stopWorkingTimer();
			clearTimeout(breakTimerRef.current);

			// Show final work_hours returned by backend (net of breaks)
			const finalHours = res.data?.work_hours || calcWorkingTime(punchInTime, totalBreakMsRef.current);
			setTotalHours(finalHours);

			setIsBreak(false);
			setActiveBreak(null);
			setIsPunchedIn(false);
			totalBreakMsRef.current = 0;
		} catch (err) {
			const msg = err.response?.data?.message || "Punch out failed. Please try again.";
			setPunchError(msg);
		} finally {
			setPunchLoading(false);
		}
	};

	// ─────────────────────────────────────────────────────────────────────
	// 9. Start Break
	// ─────────────────────────────────────────────────────────────────────
	const handleStartBreak = async (breakItem = null) => {
		if (!userId) return;

		setPunchLoading(true);
		setPunchError("");

		try {
			await axios.post(`${BASE_URL}/api/attendance/start-break`, {}, { headers: apiHeaders() });

			stopWorkingTimer();
			setIsBreak(true);
			setActiveBreak(breakItem);
			breakStartRef.current = new Date();
			setShowBreakDropdown(false);

			// Alert after 15 min for coffee / custom breaks
			const isTimed = breakItem?.id === "coffee" || breakItem?.id === "custom";
			if (isTimed) {
				clearTimeout(breakTimerRef.current);
				breakTimerRef.current = setTimeout(
					() => setShowAlert(true),
					BREAK_DURATION_MIN * 60 * 1000
				);
			}
		} catch (err) {
			const msg = err.response?.data?.message || "Could not start break.";
			setPunchError(msg);
		} finally {
			setPunchLoading(false);
		}
	};

	// ─────────────────────────────────────────────────────────────────────
	// 10. End Break
	// ─────────────────────────────────────────────────────────────────────
	const handleEndBreak = async () => {
		if (!userId) return;

		setPunchLoading(true);
		setPunchError("");

		try {
			await axios.post(`${BASE_URL}/api/attendance/end-break`, {}, { headers: apiHeaders() });

			// Accumulate break duration on frontend so working timer stays accurate
			if (breakStartRef.current) {
				totalBreakMsRef.current += Date.now() - breakStartRef.current.getTime();
			}

			clearTimeout(breakTimerRef.current);
			setShowAlert(false);
			setIsBreak(false);
			setActiveBreak(null);
			breakStartRef.current = null;

			// Resume working timer
			startWorkingTimer(punchInTime);
		} catch (err) {
			const msg = err.response?.data?.message || "Could not end break.";
			setPunchError(msg);
		} finally {
			setPunchLoading(false);
		}
	};

	// ─────────────────────────────────────────────────────────────────────
	// 11. Attendance data for chart
	// ─────────────────────────────────────────────────────────────────────
	const attendanceDataSets = {
		months: [
			{ label: "Jan", value: 95 }, { label: "Feb", value: 90 },
			{ label: "Mar", value: 86, highlight: true }, { label: "Apr", value: 92 },
			{ label: "May", value: 88 },
		],
		weeks: [
			{ label: "W1", value: 85 }, { label: "W2", value: 88 },
			{ label: "W3", value: 90 }, { label: "W4", value: 92 },
		],
		days: [
			{ label: "Mon", value: 90 }, { label: "Tue", value: 85 },
			{ label: "Wed", value: 88 }, { label: "Thu", value: 92 },
			{ label: "Fri", value: 95 },
		],
	};

	// ─────────────────────────────────────────────────────────────────────
	// 12. Render
	// ─────────────────────────────────────────────────────────────────────
	return (
		<div className="dashboard-wrapper d-flex">
			<div className="rightside-logo">
				<img src={group10} alt="logo" className="rightside-logos" />
			</div>
			<div className="sidebar">
				<AdminSidebar />
			</div>
			<div className="main-content flex-grow-1">
				<Topbar />
				<Container fluid className="p-4">

					{/* Welcome */}
					<Row className="mb-4 align-items-center">
						<div className="username">
							<h1>Welcome, {username || "User"}!</h1>
						</div>
					</Row>

					{/* Notification + Meeting/Punch Card */}
					<Row className="mb-4">
						<div md={4}><NotificationTop /></div>
						<Col md={12}>
							<div className="meeting-card d-flex justify-content-between align-items-center">

								{/* Left group */}
								<div className="d-flex align-items-center">
									<img src={Vector3} alt="Vector3" className="vector-img" />
									<div className="meeting-left">

										{/* ── STATE 1 : Not punched in ── */}
										{!isPunchedIn ? (
											<>
												<h2>{currentTime} , {currentDate}</h2>

												<a
													href={MEETING_LINK}
													target="_blank"
													rel="noopener noreferrer"
													className="meeting-box"
													onClick={() => setHasJoined(true)}
													style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
												>
													<div className="meeting-info">
														<h4>Standup Meeting</h4>
														<p>{meetingTimeLeft}</p>
													</div>
													<div className="meeting-time">
														<img src={profileimg} alt="profileimg" />
													</div>
													<div className="chevron-box">
														<FaChevronRight />
													</div>
												</a>

												{/* Error message */}
												{punchError && (
													<p style={{ color: "#ff4d4d", fontSize: "13px", marginTop: "6px" }}>
														{punchError}
													</p>
												)}

												<button
													className="btn-punch"
													onClick={handlePunchIn}
													disabled={punchLoading}
												>
													{punchLoading ? "Punching In…" : "Punch In"}
												</button>
											</>
										) : (
											/* ── STATE 2 & 3 : Punched in ── */
											<>
												<h2>{currentTime} , {currentDate}</h2>
												<p>
													Lunch Break 1:00 PM - 2:00 PM &amp; Coffee Break 4:00 PM - 4:15 PM
												</p>

												<div className="punch-info-box">
													<div className="info-item">
														<span>Punch In :</span>{" "}
														<strong>{punchInTime ? formatTime(punchInTime) : "—"}</strong>
													</div>
													<div className="info-item">
														<span>Total Hours :</span>{" "}
														<strong>{totalHours}</strong>
													</div>
												</div>

												{/* Error message */}
												{punchError && (
													<p style={{ color: "#ff4d4d", fontSize: "13px", marginTop: "6px" }}>
														{punchError}
													</p>
												)}

												<div className="button-row">
													{/* Punch Out */}
													<button
														className="btn-punch-out1"
														onClick={handlePunchOut}
														disabled={punchLoading}
													>
														{punchLoading ? "Please wait…" : "Punch Out"}
													</button>

													{/* Start Break / End Break */}
													{isBreak ? (
														<button
															className="break-btn-st-en"
															onClick={handleEndBreak}
															disabled={punchLoading}
														>
															End Break
														</button>
													) : (
														<button
															className="break-btn-st-en"
															onClick={() => setShowBreakDropdown((prev) => !prev)}
															disabled={punchLoading}
														>
															Start Break ▼
														</button>
													)}
												</div>

												{/* Break dropdown */}
												{showBreakDropdown && !isBreak && (
													<div className="break-dropdown" ref={breakDropdownRef}>
														<p className="dropdown-title">Scheduled Breaks</p>

														{BREAK_SCHEDULES.map((b) => {
															const nowMin    = getCurrentTimeInMinutes();
															const isCurrent = nowMin >= toMinutes(b.start) && nowMin <= toMinutes(b.end);
															return (
																<div
																	key={b.id}
																	className={`break-item ${isCurrent ? "active-break" : ""}`}
																	onClick={() => handleStartBreak(b)}
																>
																	<strong>{b.label}</strong>
																	<span>{b.start} – {b.end}</span>
																</div>
															);
														})}

														{/* Custom Break */}
														<div
															className="break-item custom-break"
															onClick={() => handleStartBreak({ id: "custom", label: "Custom Break" })}
														>
															➕ Custom Break
														</div>
													</div>
												)}

												{/* Break overtime alert */}
												{showAlert && (
													<div style={alertStyle}>
														<span>⚠️</span>
														<span>Your break time of 15 minutes has ended. Please resume work.</span>
														<button style={closeBtnStyle} onClick={() => setShowAlert(false)}>✖</button>
													</div>
												)}
											</>
										)}
									</div>
								</div>

								{/* Right illustration */}
								<div className="meeting-right">
									<img src={arrow3}      alt="Illustration" className="arrow3"   />
									<img src={gradientimg} alt="Illustration" className="maleteam" />
									<img src={clock}       alt="Illustration" className="clock"    />
								</div>
							</div>
						</Col>
					</Row>

					{/* Admin Summary Cards */}
					<Row className="notice mb-4">
						<Col md={8}>
							<Row>
								<Col md={4} className="mb-3">
									<Card className="summary-card" onClick={() => navigate("/employees-list")} style={{ cursor: "pointer" }}>
										<div className="summary-top">
											<h2>{adminDashboardData.total_employees}</h2>
											<div className="summary-icons"><BsPeople /></div>
										</div>
										<h6>Total Employees</h6>
										<div className="summary-action">
											<div className="summary-action-icon"><BsPlusCircle /></div>
											2 new employees added!
										</div>
									</Card>
								</Col>
								<Col md={4} className="mb-3">
									<Card className="summary-card" onClick={() => navigate("/attendance")} style={{ cursor: "pointer" }}>
										<div className="summary-top">
											<h2>{adminDashboardData.On_Time}</h2>
											<div className="summary-icons"><IoTimeOutline /></div>
										</div>
										<h6>On Time</h6>
										<div className="summary-action">
											<div className="summary-action-icon"><BsEye /></div>
											Check Attendance Today
										</div>
									</Card>
								</Col>
								<Col md={4} className="mb-3">
									<Card className="summary-card" onClick={() => navigate("/leave-approval")} style={{ cursor: "pointer" }}>
										<div className="summary-top">
											<h2>{adminDashboardData.On_Leave}</h2>
											<div className="summary-icons"><MdOutlineAccessTime /></div>
										</div>
										<h6>On Leave</h6>
										<div className="summary-action">
											<div className="summary-action-icon"><BsPencilSquare /></div>
											Accept or reject Leave
										</div>
									</Card>
								</Col>
								<Col md={4} className="mb-3">
									<Card className="summary-card" onClick={() => navigate("/admin-attendance-report")} style={{ cursor: "pointer" }}>
										<div className="summary-top">
											<h2>{adminDashboardData.Late_Arrival}</h2>
											<div className="summary-icons"><MdOutlineLogout /></div>
										</div>
										<h6>Late Arrival</h6>
										<div className="summary-action">
											<div className="summary-action-icon"><BsCalendarCheck /></div>
											Check Attendance Overview
										</div>
									</Card>
								</Col>
								<Col md={4} className="mb-3">
									<Card className="summary-card" onClick={() => navigate("/leave-approval")} style={{ cursor: "pointer" }}>
										<div className="summary-top">
											<h2>{adminDashboardData.Pending_Approval}</h2>
											<div className="summary-icons"><FaCalendarAlt /></div>
										</div>
										<h6>Pending Approval</h6>
										<div className="summary-action">
											<div className="summary-action-icon"><BsEnvelope /></div>
											Approve Leave
										</div>
									</Card>
								</Col>
								<Col md={4} className="mb-3">
									<Card className="summary-card">
										<div className="summary-top">
											<h2>{adminDashboardData.This_Week_Hoilday}</h2>
											<div className="summary-icons"><TbCalendarTime /></div>
										</div>
										<h6>This Week Hoilday</h6>
										<div className="summary-action">
											<div className="summary-action-icon"><BsFlag /></div>
											Manage Holiday List
										</div>
									</Card>
								</Col>
							</Row>
						</Col>
						<Col md={4}>
							<AttendanceCard dataSets={attendanceDataSets} />
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

// ─── Inline styles (kept identical to original) ────────────────────────────
const alertStyle = {
	position: "fixed",
	top: "50%", left: "50%",
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