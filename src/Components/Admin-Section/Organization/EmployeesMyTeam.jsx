import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./EmployeesMyTeam.css";
import { FaFilter, FaSearch } from "react-icons/fa";
import group10 from "../../../assets/Group10.png";
import { useLocation } from "react-router-dom";


const Employee = () => {
	const [employees] = useState([
		{
			id: 1,
			name: "Sakshi",
			email: "sakshi@gmail.com",
			empId: "100849",
			position: "Project Head",
			department: "Design",
			DateOfJoining: "11-07-2025",
			image: "https://i.pravatar.cc/40?img=3",
		},
		{
			id: 2,
			name: "Asolin",
			email: "ignatious@gmail.com",
			empId: "100849",
			position: "Project Head",
			department: "Development",
			DateOfJoining: "11-07-2025",
			image: "https://i.pravatar.cc/40?img=4",
		},
	]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("newest");
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		department: "all",
		position: "all",
		status: "all",
	});

	const location = useLocation();
	const highlightName = location.state?.highlightName || "";

	const filteredEmployees = highlightName
		? employees.filter((emp) =>
				emp.name.toLowerCase().includes(highlightName.toLowerCase())
		  )
		: employees;

	// for searching employees
	const baseEmployees = highlightName
		? employees.filter((emp) =>
				emp.name.toLowerCase().includes(highlightName.toLowerCase())
		  )
		: employees;

	const searchedEmployees = baseEmployees.filter((emp) =>
		`${emp.name} ${emp.email} ${emp.empId}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	// for filtering the employees
	const filteredEmployee = searchedEmployees.filter((emp) => {
		return (
			(filters.department === "all" || emp.department === filters.department) &&
			(filters.position === "all" || emp.position === filters.position) &&
			(filters.status === "all" || emp.status === filters.status)
		);
	});

	// for filtering the employees
	const sortedEmployees = [...filteredEmployee].sort((a, b) => {
		switch (sortBy) {
			case "name":
				return a.name.localeCompare(b.name);

			case "department":
				return a.department.localeCompare(b.department);

			case "status":
				return a.status.localeCompare(b.status);

			case "newest":
				return (b.id ?? 0) - (a.id ?? 0); // fallback

			case "oldest":
				return (a.id ?? 0) - (b.id ?? 0);

			default:
				return 0;
		}
	});

	return (
		<div className="employee-page">
			<div className="rightside-logo ">
				<img src={group10} alt="logo" className="rightside-logos" />
			</div>
			<AdminSidebar />
			<div className="employee-main">
				<Topbar />
				<div className="employee-content">
					<div className="employee-content">
						<div className="employee-header">
							{/* LEFT SIDE */}
							<div className="header-left">
								<h2>My Team</h2>
								 <div className="search-containerr1">
							     <FaSearch className="search-iconn1" size={16} />
								<input
									type="text"
									placeholder="Search..."
									className="search-inputt1"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								</div>
							</div>

							{/* RIGHT SIDE */}
							<div className="header-right1">
								<div className="filter-sort">
									{/* FILTER BUTTON */}
									<div className="filter-wrapper">
										<button
											className="right-butn-filterr"
											onClick={() => setShowFilters((prev) => !prev)}
										>
											<FaFilter /> Filter
										</button>
                    
                    {/* DROPDOWN PANEL */}
										{showFilters && (
											<div className="filter-dropdown">
												<h4>Filter</h4>

												{/* NAME */}
												<div className="filter-field">
													<label>Name</label>
													<input
														type="text"
														placeholder="Please enter name"
														value={filters.name}
														onChange={(e) =>
															setFilters({ ...filters, name: e.target.value })
														}
													/>
												</div>

												{/* DEPARTMENT + POSITION */}
												<div className="filter-row">
													<div className="filter-field">
														<label>Department</label>
														<select
															value={filters.department}
															onChange={(e) =>
																setFilters({
																	...filters,
																	department: e.target.value,
																})
															}
														>
															<option value="all">Select</option>
															<option value="Human Resource">
																Human Resource
															</option>
															<option value="Development">Development</option>
															<option value="Design">Design</option>
															<option value="Sales">Sales</option>
														</select>
													</div>

													<div className="filter-field">
														<label>Position</label>
														<select
															value={filters.position}
															onChange={(e) =>
																setFilters({
																	...filters,
																	position: e.target.value,
																})
															}
														>
															<option value="all">Select</option>
                              <option value="Project Head">Project Head</option>
															<option value="Designer">Designer</option>
															<option value="Developer">Developer</option>
															<option value="UIUX">UIUX</option>
														</select>
													</div>
												</div>

												{/* ACTIONS */}
												<div className="filter-actions">
													<button
														className="reset-btn"
														onClick={() => {
															setFilters({
																name: "",
																department: "all",
																position: "all",
																status: "all",
															});
															setSearchTerm("");
															setShowFilters(false);
														}}
													>
														Reset
													</button>

													<button
														className="apply-btn"
														onClick={() => setShowFilters(false)}
													>
														Apply
													</button>
												</div>
											</div>
										)}
									</div>

									<select
										className="sort-select1"
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value)}
									>
										<option value="newest">Sort By : Newest</option>
										<option value="oldest">Sort By : Oldest</option>
										<option value="name">Sort By : Name</option>
										<option value="department">Sort By : Department</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<table className="employee-table">
						<thead>
							<tr>
								<th>Name/Email ID</th>
								<th>Employee ID</th>
								<th>Date Of Joining</th>
								<th>Department</th>
								<th>Position</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{sortedEmployees.map((emp) => (
								<tr key={emp.id}>
									<td>
										<div className="emp-info">
											<img src={emp.image} alt={emp.name} className="emp-img" />
											<div>
												<p className="emp-name">{emp.name}</p>
												<p className="emp-email">{emp.email}</p>
											</div>
										</div>
									</td>
									<td>{emp.empId}</td>
									<td>{emp.DateOfJoining}</td>
									<td>{emp.department}</td>
									<td>{emp.position}</td>
									<td>
										<button className="view-btn">View Details</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="pagination">
						<div className="showing">
							Showing{" "}
							<select>
								<option>07</option>
								<option>10</option>
								<option>15</option>
							</select>
						</div>
						<div className="page-nav">
							<button>Prev</button>
							<span className="page-num">01</span>
							<button>Next</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Employee;
