import React, { useState, useEffect, useRef } from "react";
import "./MyLeave.css";
import LeaveRequestForm from "../leave/ApplyLeave";
import { FaCheckCircle, FaFilter, FaEdit, FaTimesCircle } from "react-icons/fa";
import EmployeeSidebar from ".././EmployeeSidebar";
import Topbar from ".././Topbar";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import apiClient from "../../../utils/apiClient";

export default function MyLeave() {
	const navigate = useNavigate();
	const [leaveData, setLeaveData] = useState([]);
	const [leaveBalance, setLeaveBalance] = useState([]);
	const [showApplyModal, setShowApplyModal] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(7);
	// Filter states
	const [showFilterPopup, setShowFilterPopup] = useState(false);
	const [filterName, setFilterName] = useState("");
	const [filterLeaveType, setFilterLeaveType] = useState("All");
	const [filterStatus, setFilterStatus] = useState("All");

	const filterRef = useRef(null);
	const filterButtonRef = useRef(null);

	useEffect(() => {
		const fetchLeaveData = async () => {
			try {
				const userId =
					localStorage.getItem("employee_user_id") ||
					localStorage.getItem("current_user_id");

				// Fetch leave requests
				const response = await apiClient.get("/api/myleave", {
					headers: { "X-User-ID": userId },
				});
				setLeaveData(response.data);

				// Fetch leave balance
				const balanceResponse = await apiClient.get("/api/leave_balance", {
					headers: { "X-User-ID": userId },
				});
				setLeaveBalance(balanceResponse.data);
			} catch (error) {
				console.error("Error fetching leave data:", error);
			}
		};

		fetchLeaveData();
	}, []);

	const filteredAndSortedLeaves = leaveData.filter((leave) =>
		filterStatus === "All" ? true : leave.status === filterStatus,
	);

	const handleResetFilter = () => {
		setFilterName("");
		setFilterLeaveType("All");
		setFilterStatus("All");
	};

	const handleApplyFilter = () => {
		setCurrentPage(1);
		setShowFilterPopup(false);
	};

	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;

	const currentRows = filteredAndSortedLeaves.slice(
		indexOfFirstRow,
		indexOfLastRow,
	);

	const totalPages = Math.ceil(filteredAndSortedLeaves.length / rowsPerPage);

	// Close filter popup when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showFilterPopup &&
				filterRef.current &&
				!filterRef.current.contains(event.target) &&
				filterButtonRef.current &&
				!filterButtonRef.current.contains(event.target)
			) {
				setShowFilterPopup(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showFilterPopup]);

	return (
		<div className="layout">
			{/* Sidebar */}
			<EmployeeSidebar />

			{/* Main Content Area */}
			<div className="myleave-container1">
				<Topbar />

				{/* Page Title */}
				<h2 className="page-title">My Leaves</h2>

				{/* Leave Summary Section */}
				<div className="leave-header">
					{/* Summary Cards - Now Dynamic */}
					<div className="leave-summary">
						{leaveBalance.length > 0 ? (
							leaveBalance.slice(0, 3).map((balance) => (
								<div className="emp-summary-card" key={balance.id}>
									<FaCheckCircle className="summary-icon" />
									<p>
										<strong>
											{balance.remaining}/{balance.total} Day(s)
										</strong>
										<br />
										{balance.name}
									</p>
								</div>
							))
						) : (
							<>
								<div className="emp-summary-card">
									<FaCheckCircle className="summary-icon" />
									<p>
										<strong>Loading...</strong>
										<br />
										Leave Balance
									</p>
								</div>
							</>
						)}
					</div>

					{/* Action Buttons */}
					<div className="leave-actions">
						<div className="top-buttons">
							<button
								className="btn-apply"
								onClick={() => setShowApplyModal(true)}
							>
								Apply Leave
							</button>
							<button
								className="btn-regularization"
								onClick={() => navigate("/my-regularization")}
							>
								Regularization
							</button>
						</div>
						<div
							className="bottom-button"
							style={{ position: "relative", display: "inline-block" }}
						>
							<button
								className="btn-filter"
								ref={filterButtonRef}
								onClick={() => setShowFilterPopup(!showFilterPopup)}
							>
								<FaFilter /> Filter
							</button>

							{/* Filter Dropdown */}
							{showFilterPopup && (
								<div ref={filterRef} className="empl-app-filter-dropdown-box">
									{/* Header */}
									<div className="empl-app-filter-popup-header">
										<h3>Filter</h3>
										<button
											className="empl-app-filter-popup-close"
											onClick={() => setShowFilterPopup(false)}
										>
											<IoClose />
										</button>
									</div>
									{/* Body */}
									<div className="empl-app-filter-popup-body">
										{/* Name Field */}
										<div className="filter-field">
											<label>Name</label>
											<input
												type="text"
												placeholder="Please enter name"
												value={filterName}
												onChange={(e) => setFilterName(e.target.value)}
											/>
										</div>
										{/* Leave Type and Status Row */}
										<div className="filter-row">
											<div className="filter-field">
												<label>Leave Type</label>
												<select
													value={filterLeaveType}
													onChange={(e) => setFilterLeaveType(e.target.value)}
												>
													<option value="All">All</option>
													<option value="Casual Leave">Casual Leave</option>
													<option value="Sick Leave">Sick Leave</option>
													<option value="Annual Leave">Annual Leave</option>
												</select>
											</div>
											<div className="filter-field">
												<label>Status</label>
												<select
													value={filterStatus}
													onChange={(e) => setFilterStatus(e.target.value)}
												>
													<option value="All">All</option>
													<option value="Pending">Pending</option>
													<option value="Approved">Approved</option>
													<option value="Rejected">Rejected</option>
												</select>
											</div>
										</div>
									</div>
									{/* Footer */}
									<div className="empl-app-filter-popup-footer">
										<button
											className="filter-reset-btn"
											onClick={handleResetFilter}
										>
											Reset
										</button>
										<button
											className="filter-apply-btn"
											onClick={handleApplyFilter}
										>
											Apply
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Leave Table */}
				<div className="leave-table">
					<table>
						<thead>
							<tr>
								<th>Sl No</th>
								<th>Leave Type</th>
								<th>Leave Dates</th>
								<th>Reason</th>
								<th>Date Of Request</th>
								<th>Action</th>
							</tr>
						</thead>

						<tbody>
							{leaveData.length > 0 ? (
								currentRows.map((leave, index) => (
									<tr key={leave.id}>
										<td>
											{String(indexOfFirstRow + index + 1).padStart(2, "0")}
										</td>
										<td>{leave.type}</td>
										<td>{leave.date}</td>
										<td>{leave.reason}</td>
										<td>
											{leave.requestDate}
											<span className="status">{leave.status}</span>
										</td>
										<td className="action-icons">
											<FaEdit className="edit-icon" />
											<FaTimesCircle className="delete-icon" />
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="no-data">
										No leave records found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="pagination">
					<span>Showing</span>
					<select
						value={rowsPerPage}
						onChange={(e) => {
							setRowsPerPage(Number(e.target.value));
							setCurrentPage(1); // reset to first page
						}}
					>
						<option value={7}>07</option>
						<option value={10}>10</option>
						<option value={15}>15</option>
						<option value={20}>20</option>
					</select>
					<div className="page-controls">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
						>
							Prev
						</button>
						<button className="active">
							{String(currentPage).padStart(2, "0")}
						</button>
						<button
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>

				{/* //apply leave modal */}
				{showApplyModal && (
					<div
						className="apply-modal-overlay"
						onClick={() => setShowApplyModal(false)}
					>
						<div className="apply-modal" onClick={(e) => e.stopPropagation()}>
							<div className="apply-modal-header">
								<h3>Apply Leave</h3>

								<button
									className="close-btn"
									onClick={() => setShowApplyModal(false)}
								>
									×
								</button>
							</div>

							<div className="apply-modal-body">
								<LeaveRequestForm onClose={() => setShowApplyModal(false)} />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
