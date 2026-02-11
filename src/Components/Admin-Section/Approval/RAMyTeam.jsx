import React,{ useState, useEffect } from "react";
import "./RAMyTeam.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import axios from "axios";


export default function RegularizationApproval() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Approved | Rejected
  const [sortOrder, setSortOrder] = useState("Newest"); // Newest | Oldest
  

  useEffect(() => {
    const fetchMyTeamRA = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/myteamra");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchMyTeamRA();
  }, []);

  const navigate = useNavigate();
const filteredAndSortedLeaves = data
  // SEARCH by employee name
  .filter((leave) =>
    leave.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // FILTER by status
  .filter((leave) =>
    filterStatus === "All" ? true : leave.status === filterStatus
  )

  // SORT by request date
  .sort((a, b) => {
    const dateA = new Date(a.requestDate);
    const dateB = new Date(b.requestDate);

    return sortOrder === "Newest"
      ? dateB - dateA
      : dateA - dateB;
  });



  return (
    <div className="regularization-page">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="regularization-main">
        <Topbar />
        <div className="regularization-container">
          <div className="regularization-header">
            <div className="header-top">
              <h2>Regularization Approval My Team</h2>
            </div>

            <div className="header-bottom">
              {/* Left side buttons */}
              <div className="left-tabs">
                <button className="tab-btn "
                 onClick={() => navigate("/regularization-approval")}
                >All</button>
                <button className="tab-btn active">My Team</button>
              </div>

              {/* Right side search/filter/sort */}
              <div className="right-controls">
                <input
                type="text"
                placeholder="🔍 Search..."
                className="right-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
                <select
                className="right-butn-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
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
                          className={`status-badge ${
                            emp.status === "Pending" ? "pending" : "approved"
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
                Showing{" "}
                <select>
                  <option>07</option>
                </select>
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