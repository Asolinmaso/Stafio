import React, { useEffect, useState } from "react";
import "./MyHoliday.css";
import EmployeeSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";

const Myholiday = () => {
	const [holidayData, setHolidayData] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		type: "Mandatory",
		date: "",
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(7);

	const fetchHolidays = async () => {
		try {
			const response = await axios.get(
				"http://127.0.0.1:5001/api/myholidays",
			);
			setHolidayData(response.data);
		} catch (error) {
			console.error("Error fetching holidays:", error);
		}
	};

	useEffect(() => {
		fetchHolidays();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://127.0.0.1:5001/api/myholidays", formData);
			if (response.status === 201) {
				alert("Holiday added successfully!");
				setIsModalOpen(false);
				setFormData({ title: "", type: "Mandatory", date: "" });
				fetchHolidays();
			}
		} catch (error) {
			console.error("Error adding holiday:", error);
			alert(error.response?.data?.message || "Error adding holiday");
		}
	};

	// Pagination Logic
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentHolidays = holidayData.slice(indexOfFirstRow, indexOfLastRow);
	const totalPages = Math.ceil(holidayData.length / rowsPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};

	const handleRowsPerPageChange = (e) => {
		setRowsPerPage(Number(e.target.value));
		setCurrentPage(1); // Reset to first page
	};

	return (
		<div className="layout">
			<div className="rightside-logo ">
				<img src={group10} alt="logo" className="rightside-logos" />
			</div>
			<EmployeeSidebar />
			<div className="myholiday-container">
				<Topbar />
				<div className="holiday-header">
					<h2 className="page-title">My Holiday Calendar</h2>
					<button className="add-holiday-btn" onClick={() => setIsModalOpen(true)}>
						<FaPlusCircle className="add-holiday-icon" /> Add Holiday
					</button>
				</div>

				<div className="holiday-table-container">
					<table className="holiday-table">
						<thead>
							<tr>
								<th>Sl No</th>
								<th>Date</th>
								<th>Title</th>
								<th>Type</th>
							</tr>
						</thead>
						<tbody>
							{currentHolidays.map((holiday, index) => (
								<tr key={holiday.id}>
									<td>{String(indexOfFirstRow + index + 1).padStart(2, "0")}</td>
									<td>{holiday.date}</td>
									<td>{holiday.title}</td>
									<td>{holiday.type || "Mandatory"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="holiday-pagination">
					<div className="showing">
						Showing
						<select value={rowsPerPage} onChange={handleRowsPerPageChange}>
							<option value={7}>07</option>
							<option value={10}>10</option>
							<option value={20}>20</option>
						</select>
					</div>
					<div className="page-controls">
						<button className="page-btn" onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								className={`page-number ${currentPage === page ? 'active' : ''}`}
								onClick={() => setCurrentPage(page)}
							>
								{String(page).padStart(2, "0")}
							</button>
						))}
						<button className="page-btn" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>Next</button>
					</div>
				</div>

				{/* Add Holiday Modal */}
				{isModalOpen && (
					<div className="holiday-modal-overlay">
						<div className="holiday-modal">
							<div className="holiday-modal-header">
								<h3>Add Holiday</h3>
								<button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
							</div>
							<form className="holiday-modal-body" onSubmit={handleSubmit}>
								<div className="modal-shape-bg"></div>
								<div className="form-group">
									<label>Holiday Name :</label>
									<input
										type="text"
										name="title"
										value={formData.title}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="form-group">
									<label>Holiday Type:</label>
									<select
										name="type"
										value={formData.type}
										onChange={handleInputChange}
									>
										<option value="Mandatory">Mandatory</option>
										<option value="Restricted">Restricted</option>
									</select>
								</div>
								<div className="form-group">
									<label>Select Date:</label>
									<input
										type="date"
										name="date"
										value={formData.date}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="holiday-modal-footer">
									<button type="submit" className="add-btn">Add</button>
									<button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Myholiday;
