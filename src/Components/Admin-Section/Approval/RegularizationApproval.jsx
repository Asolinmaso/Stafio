import React from "react";
import "./RegularizationApproval.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";



export default function RegularizationApproval() {
  const data = [
    {
      id: 1,
      name: "Aarav Bijeesh",
      empId: "100849",
      regDate: "11-07-2025/1st Half",
      attendance: "Present",
      requestDate: "11-07-2025",
      status: "Pending",
      img: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: 2,
      name: "Aiswarya Shyam",
      empId: "100849",
      regDate: "11-07-2025/1st Half",
      attendance: "Present",
      requestDate: "11-07-2025",
      status: "Approved",
      img: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 3,
      name: "Sakshi",
      empId: "100849",
      regDate: "11-07-2025/1st Half",
      attendance: "Present",
      requestDate: "11-07-2025",
      status: "Approved",
      img: "https://randomuser.me/api/portraits/women/13.jpg",
    },
    {
      id: 4,
      name: "Ignatious Anto",
      empId: "100849",
      regDate: "11-07-2025/Full Day",
      attendance: "Present",
      requestDate: "11-07-2025",
      status: "Approved",
      img: "https://randomuser.me/api/portraits/men/15.jpg",
    },
    {
      id: 5,
      name: "Lakshmi",
      empId: "100849",
      regDate: "11-07-2025/Full Day",
      attendance: "Present",
      requestDate: "11-07-2025",
      status: "Approved",
      img: "https://randomuser.me/api/portraits/women/16.jpg",
    },
  ];


  const navigate = useNavigate();

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
              <h2>Regularization Approval</h2>
            </div>

            <div className="header-bottom">
              {/* Left side buttons */}
              <div className="left-tabs">
                <button className="tab-btn ">All</button>
                <button className="tab-btn active"
                 onClick={() => navigate("/ra-myteam")}
                >My Team</button>
              </div>

              {/* Right side search/filter/sort */}
              <div className="right-controls">
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  className="search-input"
                />
                <button className="right-btn-filter">
                  <FaFilter /> Filter
                </button>
                <select className="sort-select">
                  <option>Sort By : Newest</option>
                  <option>Sort By : Oldest</option>
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
                {data.map((emp) => (
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
