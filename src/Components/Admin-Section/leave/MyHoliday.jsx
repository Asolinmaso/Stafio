import React, { useEffect, useState } from "react";
import "./MyHoliday.css";
import EmployeeSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";
import axios from "axios";

const Myholiday = () => {
   const [holidayData, setHolidayData] = useState([]);

   useEffect(() => {
  const fetchHolidays = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5001/api/myholidays"
      );
      setHolidayData(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  fetchHolidays();
}, []);
  return (
    <div className="layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <EmployeeSidebar />
      <div className="myholiday-container">
        <Topbar />
        <h2 className="page-title">My Holiday Calendar</h2>

        <div className="holiday-table-container">
          <table className="holiday-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Date</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {holidayData.map((holiday, index) => (
                <tr key={holiday.id}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td>{holiday.date}</td>
                  <td>{holiday.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="holiday-pagination">
          <div className="showing">
            Showing
            <select>
              <option>07</option>
              <option>10</option>
              <option>20</option>
            </select>
          </div>
          <div className="page-controls">
            <button className="page-btn">Prev</button>
            <button className="page-number active">01</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myholiday;
