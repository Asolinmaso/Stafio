import React, { useState } from "react";
import "./MyTeamLeaveApproval.css";
import { FaFilter } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";


export default function MyTeamLeaveApproval() {
  const [search, setSearch] = useState("");

  const leaveData = [
    {
      id: 1,
      name: "Sakshi",
      empId: "100849",
      type: "Sick Leave",
      days: "1 Day(s)",
      date: "11-07-2025/Full Day",
      request: "11-07-2025",
      status: "Pending",
      image: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Asolin",
      empId: "100849",
      type: "Sick Leave",
      days: "0.5 Day(s)",
      date: "11-07-2025/HALF Day(AN)",
      request: "11-07-2025",
      status: "Pending",
      image: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 3,
      name: "Sakshi",
      empId: "100849",
      type: "Casual Leave",
      days: "1 Day(s)",
      date: "11-07-2025/Full Day",
      request: "11-07-2025",
      status: "Approved",
      image: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 4,
      name: "Asolin",
      empId: "100849",
      type: "Casual Leave",
      days: "3 Day(s)",
      date: "11-07-2025–13-07-2025 /Full Day",
      request: "11-07-2025",
      status: "Approved",
      image: "https://i.pravatar.cc/40?img=4",
    },
    {
      id: 5,
      name: "Sakshi",
      empId: "100849",
      type: "Sick Leave",
      days: "1 Day(s)",
      date: "11-07-2025/Full Day",
      request: "11-07-2025",
      status: "Rejected",
      image: "https://i.pravatar.cc/40?img=5",
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Approved") return "status-approved";
    if (status === "Pending") return "status-pending";
    if (status === "Rejected") return "status-rejected";
  };


  return (
    <div className="myteam-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="myteam-main">
        <Topbar />
        <div className="myteam-page">
          <h2 className="myteam-title">My Team Leave Approval</h2>

          <div className="myteam-controls">
            <div className="filter-sort">
              <button className="filter-btn">
                <FaFilter /> Filter
              </button>
              <select className="sorts-select">
                <option>Sort By : Newest</option>
                <option>Sort By : Oldest</option>
              </select>
            </div>
          </div>

          <table className="myteam-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Leave Dates</th>
                <th>Date Of Request</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="employee-info">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="emp-avatar"
                      />
                      <div className="emp-details">
                        <p className="emp-name">{item.name}</p>
                        <p className="emp-id">{item.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.type} <br />
                    <span className="days">{item.days}</span>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.request}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
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
                <option>20</option>
              </select>
            </div>
            <div className="page-nav">
              <button className="page-btn">Prev</button>
              <button className="page-btn active">01</button>
              <button className="page-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}