import React, { useState, useEffect, useRef } from "react";
import "./RegularizationApproval.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import axios from "axios";

export default function RegularizationApproval() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [attendanceType, setAttendanceType] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [showFilter, setShowFilter] = useState(false);

  // ✅ ADDED for outside click
  const filterRef = useRef(null);

  useEffect(() => {
    const fetchRegularizationApproval = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/api/regularizationapproval"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchRegularizationApproval();
  }, []);

  // ✅ ADDED: close popup on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const navigate = useNavigate();

  const filteredAndSortedLeaves = data
    .filter((leave) =>
      leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((leave) =>
      attendanceType === "All"
        ? true
        : leave.attendance === attendanceType
    )
    .filter((leave) =>
      filterStatus === "All" ? true : leave.status === filterStatus
    )
    .sort((a, b) => {
      const dateA = new Date(a.requestDate);
      const dateB = new Date(b.requestDate);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="regularization-approval-layout">
      <div className="rightside-logo">
        <img src={group10} alt="logo" className="rightside-logos" />
      </div>

      <AdminSidebar />

      <div className="regularization-approval-main">
        <Topbar />

        <div className="regularization-container">
          <div className="regularization-header">
            <div className="header-top">
              <h2>Regularization Approval</h2>
            </div>

            <div className="header-bottom">
              <div className="left-tabs">
                <button className="tab-btn">All</button>
                <button
                  className="tab-btn active"
                  onClick={() => navigate("/ra-myteam")}
                >
                  My Team
                </button>
              </div>

              <div className="right-controls">
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  className="right-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Filter */}
                <div className="filter-wrapper">
                  <button
                    className="filter-icon-btn"
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <FaFilter />
                  </button>

                  {showFilter && (
                    <div className="filter-popup" ref={filterRef}>
                      <h4>Filter</h4>

                      <label>Name</label>
                      <input
                        type="text"
                        placeholder="Please enter name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />

                      <div className="filter-row">
                        <div>
                          <label>Attendance Type</label>
                          <select
                            value={attendanceType}
                            onChange={(e) =>
                              setAttendanceType(e.target.value)
                            }
                          >
                            <option value="All">All</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                          </select>
                        </div>

                        <div>
                          <label>Status</label>
                          <select
                            value={filterStatus}
                            onChange={(e) =>
                              setFilterStatus(e.target.value)
                            }
                          >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      <div className="filter-actions">
                        <button
                          className="reset-btn"
                          onClick={() => {
                            setSearchTerm("");
                            setAttendanceType("All");
                            setFilterStatus("All");
                          }}
                        >
                          Reset
                        </button>

                        <button
                          className="apply-btn"
                          onClick={() => setShowFilter(false)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <select
                  className="right-sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="Newest">Sort By : Newest</option>
                  <option value="Oldest">Sort By : Oldest</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="regularization-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Regularization Date</th>
                  <th>Attendance Type</th>
                  <th>Date Of Request</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAndSortedLeaves.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-info">
                        <img src={emp.img} alt={emp.name} />
                        <div>
                          <p className="emp-name">{emp.name}</p>
                          <span>{emp.empId}</span>
                        </div>
                      </div>
                    </td>

                    <td>{emp.regDate}</td>
                    <td>{emp.attendance}</td>

                    <td>
                      <div className="request-status">
                        <span>{emp.requestDate}</span>
                        <p
                          className={`status-badge ${emp.status === "Pending"
                              ? "pending"
                              : "approved"
                            }`}
                        >
                          {emp.status}
                        </p>
                      </div>
                    </td>

                    <td>
                      <button className="view-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="showing">
              Showing <select><option>07</option></select>
            </div>
            <div className="page-btns">
              <button className="prev">Prev</button>
              <button className="page active">01</button>
              <button className="next">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
