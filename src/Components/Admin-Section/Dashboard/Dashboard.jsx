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
import profileimg from "../../../assets/profileimg.png"; //new
import { FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import AttendanceCard from "./AttendanceCard";

import { getCurrentSession } from "../../../utils/sessionManager";

const Dashboard = () => {
	const [username, setUsername] = useState("");
	const [role, setRole] = useState("");
	const attendanceDataSets = {
		months: [
			{ label: "Jan", value: 95 },
			{ label: "Feb", value: 90 },
			{ label: "Mar", value: 86, highlight: true },
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

	// ✅ Punch In/Out
	const [isPunchedIn, setIsPunchedIn] = useState(false);
	const [punchInTime, setPunchInTime] = useState(null);
	const [totalHours, setTotalHours] = useState("0:00:00");
	const [currentTime, setCurrentTime] = useState("");
	const [currentDate, setCurrentDate] = useState("");
	const [isBreak, setIsBreak] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	//newly added
	const [showBreakDropdown, setShowBreakDropdown] = useState(false);
	const [activeBreak, setActiveBreak] = useState(null);
	// const [view, setView] = useState("months");

	const breakSchedules = [
		{ id: "lunch", label: "Lunch Break", start: "13:00", end: "14:00" },
		{ id: "coffee", label: "Coffee Break", start: "16:00", end: "16:15" },
	];

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

	//newly added functions
	const getCurrentTimeInMinutes = () => {
		const now = new Date();
		return now.getHours() * 60 + now.getMinutes();
	};

	const toMinutes = (time) => {
		const [h, m] = time.split(":").map(Number);
		return h * 60 + m;
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

	const handleStartBreak = (breakItem = null) => {
		//modified newly and added
		if (!isBreak) {
			setIsBreak(true);
			setActiveBreak(breakItem);
			breakStartRef.current = new Date();
			clearInterval(timerRef.current);

			breakTimerRef.current = setTimeout(
				() => {
					setShowAlert(true);
				},
				15 * 60 * 1000,
			);
		} else {
			setIsBreak(false);
			setActiveBreak(null);
			const breakEnd = new Date();
			pausedDurationRef.current += breakEnd - breakStartRef.current;

			clearTimeout(breakTimerRef.current);
			setShowAlert(false);

			timerRef.current = setInterval(() => {
				setTotalHours(calculateDuration(startTimeRef.current, new Date()));
			}, 1000);
		}

		setShowBreakDropdown(false);
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
		// Read values from sessionStorage
		const session = getCurrentSession();

		if (session) {
			setUsername(session.username || "");
			setRole(session.role || "");
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
					"http://127.0.0.1:5001/admin_dashboard",
				);
				setAdminDashboardData(response.data);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			}
		};

		fetchAdminDashboardData();
	}, []);

	const navigate = useNavigate();

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
		getMeetingMinutesLeft(),
	);
	useEffect(() => {
		const interval = setInterval(() => {
			setMeetingMinutesLeft(getMeetingMinutesLeft());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="dashboard-wrapper d-flex">
			<div className="rightside-logo ">
				<img src={group10} alt="logo" className="rightside-logos" />
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
							<h1>Welcome, {username || "User"}!</h1>
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

													<div className="meeting-time">
														<img src={profileimg} alt="profileimg" />
													</div>

													<div className="chevron-box">
														<FaChevronRight />
													</div>
												</a>

												<button className="btn-punch" onClick={handlePunchIn}>
													Punch In
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
														<span>Punch In :</span>{" "}
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
														Punch Out
													</button>
													<button
														className="btn-start-break"
														onClick={() => {
															if (isBreak) {
																// ✅ END BREAK
																handleStartBreak();
															} else {
																// ✅ OPEN DROPDOWN
																setShowBreakDropdown((prev) => !prev);
															}
														}}
													>
														{isBreak ? "End Break" : "Start Break"}{" "}
														<span>▼</span>
													</button>
												</div>

												{/* break-dropdown */}

												{showBreakDropdown && !isBreak && (
													<div className="break-dropdown">
														<p className="dropdown-title">Scheduled Breaks</p>

														{breakSchedules.map((b) => {
															const nowMin = getCurrentTimeInMinutes();
															const isCurrent =
																nowMin >= toMinutes(b.start) &&
																nowMin <= toMinutes(b.end);

															return (
																<div
																	key={b.id}
																	className={`break-item ${isCurrent ? "active-break" : ""}`}
																	onClick={() => handleStartBreak(b)}
																>
																	<strong>{b.label}</strong>
																	<span>
																		{b.start} – {b.end}
																	</span>
																</div>
															);
														})}

														{isBreak && (
															<button
																className="btn-end-break"
																onClick={handleStartBreak}
															>
																End Break
															</button>
														)}

														<div
															className="break-item custom-break"
															onClick={() =>
																handleStartBreak({
																	id: "custom",
																	label: "Custom Break",
																})
															}
														>
															➕ Custom Break
														</div>
													</div>
												)}

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
							<Row class>
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
										onClick={() => navigate("/leave-approval")}
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
									<Card
										className="summary-card"
										onClick={() => navigate("/leave-approval")}
										style={{ cursor: "pointer" }}
									>
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
