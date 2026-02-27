import React, { useState, useEffect } from "react";
import "./RAMyTeam.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import axios from "axios";

export default function RegularizationApprovalMyTeam() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  // Filter popup state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTeamRA = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/myteamra");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching regularization data:", error);
      }
    };

    fetchMyTeamRA();
  }, []);

  // Filter + Search + Sort
  const filteredAndSortedData = data
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      filterStatus === "All" ? true : item.status === filterStatus
    )
    .sort((a, b) => {
      const parseDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const parts = dateStr.split("-");
        if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return new Date(dateStr);
      };
      const dateA = parseDate(a.requestDate);
      const dateB = parseDate(b.requestDate);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="ra-page">
      {/* Background Logo */}
      <div className="ra-bg-logo">
        <img src={group10} alt="logo" className="ra-bg-logo-img" />
      </div>

      <AdminSidebar />

      <div className="ra-main">
        <Topbar />

        <div className="ra-container">
          {/* Page Header */}
          <div className="ra-header">
            <h2 className="ra-title">Regularization Approval My Team</h2>

            <div className="ra-header-row">
              {/* Tabs */}
              <div className="ra-tabs">
                <button
                  className="ra-tab"
                  onClick={() => navigate("/regularization-approval")}
                >
                  All
                </button>
                <button className="ra-tab active">My Team</button>
              </div>

              {/* Right Controls */}
              <div className="ra-controls">
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  className="ra-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* FILTER WRAPPER */}
                <div className="ra-filter-wrapper">
                  <button
                    className="ra-filter-btn"
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                  >
                    <FaFilter /> Filter
                  </button>

                  {isFilterOpen && (
                    <div
                      className="ra-modal"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      <div
                        className="ra-filter-card"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="ra-filter-title">Filter</h3>

                        <div className="ra-filter-grid">
                          <div className="ra-filter-field">
                            <label>Name</label>
                            <input
                              type="text"
                              placeholder="Please enter name"
                              value={searchTerm}
                              onChange={(e) =>
                                setSearchTerm(e.target.value)
                              }
                            />
                          </div>

                          <div className="ra-filter-field">
                            <label>Attendance Type</label>
                            <select>
                              <option>All</option>
                              <option>Present</option>
                              <option>Absent</option>
                            </select>
                          </div>

                          <div className="ra-filter-field">
                            <label>Status</label>
                            <select
                              value={filterStatus}
                              onChange={(e) =>
                                setFilterStatus(e.target.value)
                              }
                            >
                              <option>All</option>
                              <option>Pending</option>
                              <option>Approved</option>
                              <option>Rejected</option>
                            </select>
                          </div>
                        </div>

                        <div className="ra-filter-actions">
                          <button
                            className="ra-reset-btn"
                            onClick={() => {
                              setSearchTerm("");
                              setFilterStatus("All");
                            }}
                          >
                            Reset
                          </button>

                          <button
                            className="ra-apply-btn"
                            onClick={() => setIsFilterOpen(false)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <select
                  className="ra-sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="Newest">Sort By : Newest</option>
                  <option value="Oldest">Sort By : Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="ra-table-card">
            <table className="ra-table">
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
                {filteredAndSortedData.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="ra-emp">
                        <img
                          src={emp.img}
                          alt={emp.name}
                          className="ra-emp-img"
                        />
                        <div className="ra-emp-text">
                          <p className="ra-emp-name">{emp.name}</p>
                          <span className="ra-emp-id">{emp.empId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="ra-muted">{emp.regDate}</td>
                    <td className="ra-muted">{emp.attendance}</td>

                    <td>
                      <div className="ra-request">
                        <span className="ra-muted">{emp.requestDate}</span>
                        <span
                          className={`ra-status ${emp.status.toLowerCase()}`}
                        >
                          {emp.status}
                        </span>
                      </div>
                    </td>

                    <td>
                      <button className="ra-view-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="ra-pagination">
            <div className="ra-showing">
              <span>Showing</span>
              <select className="ra-showing-select">
                <option>07</option>
                <option>10</option>
                <option>20</option>
              </select>
            </div>

            <div className="ra-page-controls">
              <button className="ra-page-btn">Prev</button>
              <button className="ra-page-number active">01</button>
              <button className="ra-page-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}