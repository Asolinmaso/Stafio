import React from "react";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import "./WhoIsOnLeave.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import group10 from "../../../assets/Group10.png";
import { useState,useEffect } from "react";


const WhoIsOnLeave = () => {
   const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const leaveList = [
    { id: "2244", employee: "Akshya", type: "Casual Leave", from: "10 Aug 2025", to: "11 Aug 2025", days: "1 Day" },
    { id: "2244", employee: "Rhugmini", type: "Casual Leave", from: "06 Aug 2025", to: "07 Aug 2025", days: "1 Day" },
    { id: "2244", employee: "Shalom", type: "Sick Leave", from: "07 Aug 2025", to: "09 Aug 2025", days: "2 Days" },
    { id: "2244", employee: "Tamil", type: "Sick Leave", from: "10 Aug 2025", to: "10 Aug 2025", days: "3 Days" },
    { id: "2244", employee: "Lakshmi", type: "Casual Leave", from: "10 Aug 2025", to: "10 Aug 2025", days: "1 Day" },
    { id: "2244", employee: "Akshya", type: "Sick Leave", from: "10 Aug 2025", to: "10 Aug 2025", days: "1 Day" },
  ];

   const navigate = useNavigate();

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


  return (
    <div className="whoisleave-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="whoisleave-main">
        <Topbar />

        <div className="whoisleave-header">
          <h2>Leave List</h2>
          <button className="whoisleave-filter-btn">
            <FaFilter /> Filter
          </button>
        </div>

        <div className="whoisleave-section">
          <div className="whoisleave-section-header">
            <h3>Employees On Leave</h3>
            <div className="whoisleave-controls">
              <input type="text" placeholder="🔍 Quick Search..." className="whoisleave-search" />
              <div className="whoisleave-date">
                <FaCalendarAlt />
                <span>{currentDate}</span>
              </div>
              <button className="whoisleave-view-btn"
               onClick={() => navigate("/attendance")}
               >
                View Attendance</button>
            </div>
          </div>

          <table className="whoisleave-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>No Of Days</th>
              </tr>
            </thead>
            <tbody>
              {leaveList.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.employee}</td>
                  <td>{item.type}</td>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td className="whoisleave-days">{item.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="whoisleave-pagination">
          <div className="whoisleave-showing">
            <span>Showing</span>
            <select className="whoisleave-page-select">
              <option>05</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
          <div className="whoisleave-page-controls">
            <button className="whoisleave-page-btn">Prev</button>
            <button className="whoisleave-page-btn active">01</button>
            <button className="whoisleave-page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoIsOnLeave;
