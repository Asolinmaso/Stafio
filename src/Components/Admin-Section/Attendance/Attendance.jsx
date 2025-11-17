import React,{useState,useEffect} from "react";
import { FaFilter, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import "./Attendance.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import group10 from "../../../assets/Group10.png";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/attendancelist");
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);
  
 const navigate = useNavigate();
  return (
    <div className="attendance-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="attendance-main">
        <Topbar />

        <div className="attendance-header">
          <h2>Attendance</h2>
          <div className="attendance-controls">
            <button className="filter-btn">
              <FaFilter /> Filter
            </button>
            <div className="sort-dropdown">
              <span>Sort By : Last 7 Day</span>
              <FaChevronDown />
            </div>
          </div>
        </div>

        <div className="attendance-section">
          <div className="section-header">
            <h3>Attendance Overview</h3>
            <div className="section-controls">
              <div className="search-box">
                <input type="text" placeholder="Search..." />
              </div>
              <div className="date-picker">
                <FaCalendarAlt />
                <span>10 Aug 2025</span>
              </div>
              <button className="who-is-on-leave-btn"
                 onClick={() => navigate("/who-is-on-leave")}
                 >
                Who Is On Leave
              </button>
            </div>
          </div>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Work hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
              attendanceData.map((record, index) => (
                <tr key={index}>
                  <td>{record.id}</td>
                  <td>{record.employee}</td>
                  <td>{record.role}</td>
                  <td>
                    <span className={`status ${record.status.toLowerCase().replace(' ', '-')}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.date}</td>
                  <td className="time-cell">{record.checkIn}</td>
                  <td className="time-cell">{record.checkOut}</td>
                  <td>{record.workHours}</td>
                </tr>)
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination1">
            <div className="showing-info">
              <span>Showing</span>
              <select className="page-size-select1">
                <option>05</option>
                <option>10</option>
                <option>15</option>
              </select>
            </div>
            <div className="pagination-controls">
              <button className="page-btn">Prev</button>
              <button className="page-btn active">01</button>
              <button className="page-btn">Next</button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Attendance;
